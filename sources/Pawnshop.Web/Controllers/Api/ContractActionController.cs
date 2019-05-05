using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Pawnshop.Core;
using Pawnshop.Core.Exceptions;
using Pawnshop.Data.Access;
using Pawnshop.Data.Models.Audit;
using Pawnshop.Data.Models.CashOrders;
using Pawnshop.Data.Models.Clients;
using Pawnshop.Data.Models.Contracts;
using Pawnshop.Data.Models.Contracts.Actions;
using Pawnshop.Data.Models.Insurances;
using Pawnshop.Data.Models.Membership;
using Pawnshop.Data.Models.Sellings;
using Pawnshop.Web.Engine;
using Pawnshop.Web.Engine.Audit;
using Pawnshop.Web.Engine.MessageSenders;
using Pawnshop.Web.Engine.Middleware;
using Pawnshop.Web.Models.Insurance;
using Newtonsoft.Json;
using Pawnshop.Data.Models.InnerNotifications;

namespace Pawnshop.Web.Controllers.Api
{
    [Authorize(Permissions.ContractManage)]
    public class ContractActionController : Controller
    {
        private readonly ISessionContext _sessionContext;
        private readonly BranchContext _branchContext;
        private readonly ContractRepository _contractRepository;
        private readonly ContractActionRepository _actionRepository;
        private readonly ContractNumberCounterRepository _contractCounterRepository;
        private readonly CashOrderRepository _orderRepository;
        private readonly CashOrderNumberCounterRepository _cashCounterRepository;
        private readonly SellingRepository _sellingRepository;
        private readonly InsuranceRepository _insuranceRepository;
        private readonly InsuranceActionRepository _insuranceActionRepository;
        private readonly EventLog _eventLog;
        private readonly InsuranceEmailSender _emailSender;
        private readonly RemittanceRepository _remittanceRepository;
        private readonly RemittanceSettingRepository _remittanceSettingRepository;
        private readonly InnerNotificationRepository _innerNotificationRepository;

        public ContractActionController(
            ISessionContext sessionContext, BranchContext branchContext,
            ContractRepository contractRepository, ContractActionRepository actionRepository, ContractNumberCounterRepository contractCounterRepository,
            CashOrderRepository orderRepository, CashOrderNumberCounterRepository cashCounterRepository, SellingRepository sellingRepository, 
            InsuranceRepository insuranceRepository, InsuranceActionRepository insuranceActionRepository, EventLog eventLog, InsuranceEmailSender emailSender,
            RemittanceRepository remittanceRepository, RemittanceSettingRepository remittanceSettingRepository, InnerNotificationRepository innerNotificationRepository)
        {
            _sessionContext = sessionContext;
            _branchContext = branchContext;
            _contractRepository = contractRepository;
            _actionRepository = actionRepository;
            _contractCounterRepository = contractCounterRepository;
            _orderRepository = orderRepository;
            _cashCounterRepository = cashCounterRepository;
            _sellingRepository = sellingRepository;
            _insuranceRepository = insuranceRepository;
            _insuranceActionRepository = insuranceActionRepository;
            _eventLog = eventLog;
            _emailSender = emailSender;
            _remittanceRepository = remittanceRepository;
            _remittanceSettingRepository = remittanceSettingRepository;
            _innerNotificationRepository = innerNotificationRepository;
        }

        [HttpPost]
        [Event(EventCode.ContractActionCancel, EventMode = EventMode.Request, EntityType = EntityType.Contract)]
        public void Cancel([FromBody] ContractAction action)
        {
            ModelState.Validate();

            if (action == null) throw new ArgumentNullException(nameof(action));
            if (action.ContractId <= 0) throw new ArgumentException();

            if (action.Date.Date != DateTime.Today)
            {
                throw new PawnshopApplicationException("Данное действие отмене не подлежит.");
            }

            Remittance remittance = new Remittance();
            if (action.Data != null && action.Data.RemittanceId != null)
            {
                remittance = _remittanceRepository.Get((int)action.Data.RemittanceId);
            }

            using (var transaction = _actionRepository.BeginTransaction())
            {
                if (action.FollowedId.HasValue)
                {
                    var followedContract = _contractRepository.Get(action.FollowedId.Value);
                    if (!followedContract.DeleteDate.HasValue)
                    {
                        if (followedContract.Status > ContractStatus.Draft)
                            throw new PawnshopApplicationException("Нельзя отменить действие, если порожденный договор подписан.");
                        _contractRepository.Delete(followedContract.Id);
                    }
                }

                var contract = _contractRepository.Get(action.ContractId);
                var insurance = _insuranceRepository.Find(new InsuranceQueryModel { ContractId = action.ContractId });
                switch (action.ActionType)
                {
                    case ContractActionType.Prolong:
                        var lastProlong = contract.Actions
                            .Where(a => a.ActionType == ContractActionType.Prolong && a.Id != action.Id)
                            .OrderBy(a => a.Date)
                            .LastOrDefault();
                        if (lastProlong != null)
                        {
                            contract.ProlongDate = lastProlong.Date;
                            contract.MaturityDate = lastProlong.Date.AddDays(lastProlong.Data.ProlongPeriod);
                        }
                        else
                        {
                            contract.ProlongDate = null;
                            contract.MaturityDate = contract.OriginalMaturityDate;
                        }
                        break;
                    case ContractActionType.Buyout:
                    case ContractActionType.PartialBuyout:
                    case ContractActionType.PartialPayment:
                        foreach (var position in contract.Positions)
                        {
                            position.Status = ContractPositionStatus.Active;
                        }
                        contract.Status = ContractStatus.Signed;
                        if (insurance != null)
                        {
                            if (insurance.Status != InsuranceStatus.Closed) throw new InvalidOperationException();
                            insurance.Status = InsuranceStatus.Signed;
                            _insuranceRepository.Update(insurance);
                        }
                        break;
                    case ContractActionType.Sign:
                        contract.Status = ContractStatus.Draft;
                        if (insurance != null)
                        {
                            if (insurance.Status != InsuranceStatus.Signed) throw new InvalidOperationException();
                            insurance.Status = InsuranceStatus.Draft;
                            _insuranceRepository.Update(insurance);

                            var insuranceAction = insurance.Actions.FirstOrDefault(a => a.ActionType == InsuranceActionType.Sign);
                            if (insuranceAction != null)
                            {
                                if (!insurance.PrevInsuranceId.HasValue)
                                {
                                    _orderRepository.Delete(insuranceAction.OrderId);
                                    _eventLog.Log(EventCode.CashOrderDeleted, EventStatus.Success, EntityType.CashOrder, insuranceAction.OrderId, null, null);
                                }
                                _insuranceActionRepository.Delete(insuranceAction.Id);
                            }
                        }
                        break;
                    case ContractActionType.Selling:
                        foreach (var position in contract.Positions)
                        {
                            position.Status = ContractPositionStatus.Active;

                            var selling = _sellingRepository.Find(new {ContractPositionId = position.Id});
                            if (selling != null)
                            {
                                _sellingRepository.Delete(selling.Id);
                                _eventLog.Log(EventCode.SellingDeleted, EventStatus.Success, EntityType.Selling, selling.Id, null, null);
                            }
                        }
                        contract.Status = ContractStatus.Signed;
                        break;
                    case ContractActionType.Transfer:
                        contract.TransferDate = null;
                        break;
                    case ContractActionType.MonthlyPayment:
                        if (contract.Status == ContractStatus.BoughtOut)
                        {
                            foreach (var position in contract.Positions)
                            {
                                position.Status = ContractPositionStatus.Active;
                            }
                            contract.Status = ContractStatus.Signed;
                            if (insurance != null)
                            {
                                if (insurance.Status != InsuranceStatus.Closed) throw new InvalidOperationException();
                                insurance.Status = InsuranceStatus.Signed;
                                _insuranceRepository.Update(insurance);
                            }
                        }
                        break;
                    case ContractActionType.Addition:
                        foreach (var position in contract.Positions)
                        {
                            position.Status = ContractPositionStatus.Active;
                        }
                        contract.Status = ContractStatus.Signed;
                        if (insurance != null)
                        {
                            if (insurance.Status != InsuranceStatus.Closed) throw new InvalidOperationException();
                            insurance.Status = InsuranceStatus.Signed;
                            _insuranceRepository.Update(insurance);
                        }
                        break;
                    default:
                        throw new ArgumentOutOfRangeException();
                }

                if (action.Rows != null)
                {
                    foreach (var actionRow in action.Rows)
                    {
                        _orderRepository.Delete(actionRow.OrderId);
                        _eventLog.Log(EventCode.CashOrderDeleted, EventStatus.Success, EntityType.CashOrder, actionRow.OrderId, null, null);
                    }
                }

                if (action.Data != null && action.Data.RemittanceId != null)
                {   
                    _orderRepository.Delete((int)remittance.SendOrderId);
                    _eventLog.Log(EventCode.CashOrderDeleted, EventStatus.Success, EntityType.CashOrder, remittance.SendOrderId.Value, null, null);
                    _orderRepository.Delete((int)remittance.ReceiveOrderId);
                    _eventLog.Log(EventCode.CashOrderDeleted, EventStatus.Success, EntityType.CashOrder, remittance.ReceiveOrderId.Value, null, null);
                    _remittanceRepository.Delete(remittance.Id);
                }

                if (action.Data != null && action.Data.Notification != null)
                {
                    _innerNotificationRepository.Delete((int)action.Data.Notification.Id);
                    _innerNotificationRepository.Insert(new InnerNotification
                    {
                        Id = 0,
                        CreateDate = DateTime.Now,
                        CreatedBy = 1,
                        EntityType = EntityType.Contract,
                        EntityId = contract.Id,
                        Message = $"Действие \"{action.ActionType.GetDisplayName()}\" на сумму {action.TotalCost.ToString()} для договора {contract.ContractNumber} было отменено в филиале {_branchContext.Branch.DisplayName}. Примите соответствующие меры.",
                        ReceiveBranchId = contract.BranchId,
                        Status = InnerNotificationStatus.Sent
                    });

                }

                _contractRepository.Update(contract);
                _actionRepository.Delete(action.Id);
                
                transaction.Commit();
            }
        }

        [HttpPost]
        [Event(EventCode.ContractSelling, EventMode = EventMode.Request, EntityType = EntityType.Contract)]
        public ContractAction Selling([FromBody] ContractAction action)
        {
            ModelState.Validate();

            if (action == null) throw new ArgumentNullException(nameof(action));
            if (action.ContractId <= 0) throw new ArgumentException();

            var contract = _contractRepository.Get(action.ContractId);
            if (contract.Status != ContractStatus.Signed) throw new InvalidOperationException();

            using (var transaction = _contractRepository.BeginTransaction())
            {
                action.ActionType = ContractActionType.Selling;

                _contractRepository.UpdatePositions(action.ContractId, action.Data.Positions);
                contract.Positions = action.Data.Positions.ToList();

                RegisterSellings(contract, action);

                foreach (var contractPosition in contract.Positions)
                {
                    contractPosition.Status = ContractPositionStatus.SoldOut;
                }
                contract.Status = ContractStatus.SoldOut;
                _contractRepository.Update(contract);

                action.AuthorId = _sessionContext.UserId;
                action.CreateDate = DateTime.Now;
                _actionRepository.Insert(action);

                transaction.Commit();
            }

            return action;
        }

        [HttpPost]
        [Event(EventCode.ContractSign, EventMode = EventMode.Request, EntityType = EntityType.Contract)]
        public ContractAction Sign([FromBody] ContractAction action)
        {
            ModelState.Validate();

            if (action == null) throw new ArgumentNullException(nameof(action));
            if (action.ContractId <= 0) throw new ArgumentException();

            var contract = _contractRepository.Get(action.ContractId);
            if (contract.Status > ContractStatus.Draft) throw new InvalidOperationException();

            using (var transaction = _contractRepository.BeginTransaction())
            {
                action.ActionType = ContractActionType.Sign;

                RegisterOrders(contract, action, OrderType.CashOut);

                contract.Status = ContractStatus.Signed;
                _contractRepository.Update(contract);
                action.AuthorId = _sessionContext.UserId;
                action.CreateDate = DateTime.Now;
                _actionRepository.Insert(action);

                var insurance = _insuranceRepository.Find(new InsuranceQueryModel { ContractId = action.ContractId });
                if (insurance != null)
                {
                    RegisterInsuranceSignAction(insurance, action);
                }

                transaction.Commit();
            }

            return action;
        }

        [HttpPost]
        [Event(EventCode.ContractProlong, EventMode = EventMode.Request, EntityType = EntityType.Contract)]
        public ContractAction Prolong([FromBody] ContractAction action)
        {
            ModelState.Validate();

            if (action == null) throw new ArgumentNullException(nameof(action));
            if (action.ContractId <= 0) throw new ArgumentException();

            var contract = _contractRepository.Get(action.ContractId);
            if (contract.Status != ContractStatus.Signed) throw new InvalidOperationException();

            using (var transaction = _contractRepository.BeginTransaction())
            {
                action.ActionType = ContractActionType.Prolong;

                RegisterOrders(contract, action, OrderType.CashIn);

                if (contract.BranchId != _branchContext.Branch.Id && action.TotalCost>0)
                {
                    var remittance = RemittanceToOtherGroup(contract, action);
                    action.Data.RemittanceId = remittance.Id;
                    action.Data.Branch = _branchContext.Branch;
                    action.Data.Notification = CreateInnerNotificationToOtherGroup(contract, action);
                }

                contract.ProlongDate = action.Date;
                contract.MaturityDate = action.Date.AddDays(action.Data.ProlongPeriod);
                _contractRepository.Update(contract);

                action.Data.Branch = _branchContext.Branch;
                action.AuthorId = _sessionContext.UserId;
                action.CreateDate = DateTime.Now;
                _actionRepository.Insert(action);

                transaction.Commit();
            }

            return action;
        }

        [HttpPost]
        [Event(EventCode.ContractBuyout, EventMode = EventMode.Request, EntityType = EntityType.Contract)]
        public ContractAction Buyout([FromBody] ContractAction action)
        {
            ModelState.Validate();

            if (action == null) throw new ArgumentNullException(nameof(action));
            if (action.ContractId <= 0) throw new ArgumentException();

            var contract = _contractRepository.Get(action.ContractId);
            if (contract.Status != ContractStatus.Signed) throw new InvalidOperationException();

            using (var transaction = _contractRepository.BeginTransaction())
            {
                action.ActionType = ContractActionType.Buyout;

                RegisterOrders(contract, action, OrderType.CashIn);

                if (contract.BranchId != _branchContext.Branch.Id && action.TotalCost > 0)
                {
                    var remittance = RemittanceToOtherGroup(contract, action);
                    var notification = CreateInnerNotificationToOtherGroup(contract, action);
                    if (action.Data == null)
                    {
                        action.Data = new ContractActionData
                        {
                            Branch = _branchContext.Branch,
                            RemittanceId = remittance.Id,
                            Notification = notification
                        };
                    }
                    else
                    {
                        action.Data.Branch = _branchContext.Branch;
                        action.Data.RemittanceId = remittance.Id;
                        action.Data.Notification = notification;
                    }
                        
                }

                foreach (var position in contract.Positions)
                {
                    position.Status = ContractPositionStatus.BoughtOut;
                }
                contract.Status = ContractStatus.BoughtOut;
                _contractRepository.Update(contract);
                
                action.AuthorId = _sessionContext.UserId;
                action.CreateDate = DateTime.Now;
                _actionRepository.Insert(action);

                var insurance = _insuranceRepository.Find(new InsuranceQueryModel { ContractId = action.ContractId });
                if (insurance != null)
                {
                    insurance.EndDate = action.Date;
                    insurance.CashbackCost = insurance.InsuranceCost - (insurance.InsuranceCost / insurance.InsurancePeriod * (action.Date - contract.ContractDate).Days);
                    insurance.Status = InsuranceStatus.Closed;
                    _insuranceRepository.Update(insurance);
                    DateTime lastNskInsuranceDate = new DateTime(2019,1,21);
                    if (insurance.BeginDate < lastNskInsuranceDate)
                    {
                        _emailSender.InsuranceCloseSend(insurance, contract);
                    }
                }

                transaction.Commit();
            }

            return action;
        }

        [HttpPost]
        [Event(EventCode.ContractPartialBuyout, EventMode = EventMode.Request, EntityType = EntityType.Contract)]
        public ContractAction PartialBuyout([FromBody] ContractAction action)
        {
            ModelState.Validate();

            if (action == null) throw new ArgumentNullException(nameof(action));
            if (action.ContractId <= 0) throw new ArgumentException();

            var debtRow = action.Rows.Single(r => r.PaymentType == PaymentType.Debt);

            var contract = _contractRepository.Get(action.ContractId);
            if (contract.Status != ContractStatus.Signed) throw new InvalidOperationException();

            using (var transaction = _contractRepository.BeginTransaction())
            {
                action.ActionType = ContractActionType.PartialBuyout;

                debtRow.Cost = contract.LoanCost;
                RegisterOrders(contract, action, OrderType.CashIn);

                foreach (var position in contract.Positions)
                {
                    position.Status = action.Data.Positions.Any(p => p.Id == position.Id)
                        ? ContractPositionStatus.BoughtOut : ContractPositionStatus.PulledOut;
                }
                contract.Status = ContractStatus.BoughtOut;
                _contractRepository.Update(contract);

                contract = CreateContract(contract, action);

                action.FollowedId = contract.Id;
                action.AuthorId = _sessionContext.UserId;
                action.CreateDate = DateTime.Now;
                _actionRepository.Insert(action);

                transaction.Commit();
            }

            return action;
        }

        [HttpPost]
        [Event(EventCode.ContractPartialPayment, EventMode = EventMode.Request, EntityType = EntityType.Contract)]
        public ContractAction PartialPayment([FromBody] ContractAction action)
        {
            ModelState.Validate();

            if (action == null) throw new ArgumentNullException(nameof(action));
            if (action.ContractId <= 0) throw new ArgumentException();

            var debtRow = action.Rows.Single(r => r.PaymentType == PaymentType.Debt);
            var debtRowCost = debtRow.Cost;

            if (debtRowCost <= 0) throw new PawnshopApplicationException("Укажите сумму частичного гашения");

            var contract = _contractRepository.Get(action.ContractId);
            if (contract.Status != ContractStatus.Signed) throw new InvalidOperationException();

            using (var transaction = _contractRepository.BeginTransaction())
            {
                action.ActionType = ContractActionType.PartialPayment;

                debtRow.Cost = contract.LoanCost;
                RegisterOrders(contract, action, OrderType.CashIn);

                foreach (var position in contract.Positions)
                {
                    position.Status = ContractPositionStatus.PulledOut;
                }
                contract.Status = ContractStatus.BoughtOut;
                _contractRepository.Update(contract);

                contract = CreateContract(contract, action, contract.LoanCost - (int) debtRowCost);

                action.FollowedId = contract.Id;
                action.AuthorId = _sessionContext.UserId;
                action.CreateDate = DateTime.Now;
                _actionRepository.Insert(action);

                transaction.Commit();
            }

            return action;
        }

        [HttpPost]
        [Authorize(Permissions.ContractTransfer)]
        [Event(EventCode.ContractTransferred, EventMode = EventMode.Request, EntityType = EntityType.Contract)]
        public ContractAction Transfer([FromBody] ContractAction action)
        {
            ModelState.Validate();

            if (action == null) throw new ArgumentNullException(nameof(action));
            if (action.ContractId <= 0) throw new ArgumentException();

            var contract = _contractRepository.Get(action.ContractId);
            if (contract.Status != ContractStatus.Signed) throw new InvalidOperationException();

            using (var transaction = _contractRepository.BeginTransaction())
            {
                action.ActionType = ContractActionType.Transfer;

                RegisterOrders(contract, action, OrderType.CashIn);
                
                contract.TransferDate = action.Date;
                _contractRepository.Update(contract);

                action.AuthorId = _sessionContext.UserId;
                action.CreateDate = DateTime.Now;
                _actionRepository.Insert(action);

                transaction.Commit();
            }

            return action;
        }

        [HttpPost]
        [Event(EventCode.ContractMonthlyPayment, EventMode = EventMode.Request, EntityType = EntityType.Contract)]
        public ContractAction MonthlyPayment([FromBody] ContractAction action)
        {
            ModelState.Validate();

            if (action == null) throw new ArgumentNullException(nameof(action));
            if (action.ContractId <= 0) throw new ArgumentException();

            var contract = _contractRepository.Get(action.ContractId);
            if (contract.Status != ContractStatus.Signed) throw new InvalidOperationException();

            using (var transaction = _contractRepository.BeginTransaction())
            {
                action.ActionType = ContractActionType.MonthlyPayment;

                RegisterOrders(contract, action, OrderType.CashIn);

                action.AuthorId = _sessionContext.UserId;
                action.CreateDate = DateTime.Now;
                _actionRepository.Insert(action);

                var monthlyPaymentTotalCost = contract.Actions.Where(a => a.ActionType == ContractActionType.MonthlyPayment).SelectMany(a => a.Rows).Where(r => r.PaymentType == PaymentType.Debt).Sum(r => r.Cost);
                monthlyPaymentTotalCost += action.Rows.FirstOrDefault(r => r.PaymentType == PaymentType.Debt)?.Cost ?? 0;
                if (monthlyPaymentTotalCost >= contract.LoanCost)
                {
                    foreach (var position in contract.Positions)
                    {
                        position.Status = ContractPositionStatus.BoughtOut;
                    }
                    contract.Status = ContractStatus.BoughtOut;
                    _contractRepository.Update(contract);

                    var insurance = _insuranceRepository.Find(new InsuranceQueryModel { ContractId = action.ContractId });
                    if (insurance != null)
                    {
                        insurance.EndDate = action.Date;
                        insurance.CashbackCost = insurance.InsuranceCost - (insurance.InsuranceCost / insurance.InsurancePeriod * (action.Date - contract.ContractDate).Days);
                        insurance.Status = InsuranceStatus.Closed;
                        _insuranceRepository.Update(insurance);
                        DateTime lastNskInsuranceDate = new DateTime(2019, 1, 21);
                        if (insurance.BeginDate < lastNskInsuranceDate)
                        {
                            _emailSender.InsuranceCloseSend(insurance, contract);
                        }
                    }
                }

                transaction.Commit();
            }

            return action;
        }

        [HttpPost]
        [Event(EventCode.ContractPartialPayment, EventMode = EventMode.Request, EntityType = EntityType.Contract)]
        public ContractAction AnnuityPartialPayment([FromBody] ContractAction action)
        {
            ModelState.Validate();

            if (action == null) throw new ArgumentNullException(nameof(action));
            if (action.ContractId <= 0) throw new ArgumentException();

            var debtRow = action.Rows.Single(r => r.PaymentType == PaymentType.Debt);
            var debtRowCost = debtRow.Cost;

            if (debtRowCost <= 0) throw new PawnshopApplicationException("Укажите сумму частичного гашения");

            var contract = _contractRepository.Get(action.ContractId);
            if (contract.Status != ContractStatus.Signed) throw new InvalidOperationException();

            using (var transaction = _contractRepository.BeginTransaction())
            {
                action.ActionType = ContractActionType.PartialPayment;

                var monthlyPaymentTotalCost = decimal.ToInt32(contract.Actions.Where(a => a.ActionType == ContractActionType.MonthlyPayment).SelectMany(a => a.Rows).Where(r => r.PaymentType == PaymentType.Debt).Sum(r => r.Cost));
                debtRow.Cost = contract.LoanCost - monthlyPaymentTotalCost;
                RegisterOrders(contract, action, OrderType.CashIn);

                foreach (var position in contract.Positions)
                {
                    position.Status = ContractPositionStatus.PulledOut;
                }
                contract.Status = ContractStatus.BoughtOut;
                _contractRepository.Update(contract);

                contract = CreateContract(contract, action, monthlyPaymentTotalCost, (int)debtRowCost);

                action.FollowedId = contract.Id;
                action.AuthorId = _sessionContext.UserId;
                action.CreateDate = DateTime.Now;
                _actionRepository.Insert(action);

                transaction.Commit();
            }

            return action;
        }

        [HttpPost]
        [Event(EventCode.ContractAddition, EventMode = EventMode.Request, EntityType = EntityType.Contract)]
        public ContractAction AnnuityAddition([FromBody] ContractAction action)
        {
            ModelState.Validate();
            if (action == null) throw new ArgumentNullException(nameof(action));
            if (action.ContractId <= 0) throw new ArgumentException();

            var debtRow = action.Rows.FirstOrDefault(r => r.PaymentType == PaymentType.Debt);
            var debtRowCost = debtRow.Cost;

            var loanRow = action.Rows.FirstOrDefault(r => r.PaymentType == PaymentType.Loan);
            var loanRowCost = loanRow.Cost;

            var penaltyRow = action.Rows.FirstOrDefault(r => r.PaymentType == PaymentType.Penalty);
            decimal penaltyRowCost = 0;
            if (penaltyRow != null)
            {
                penaltyRowCost = penaltyRow.Cost;
            }

            var additionCost = Math.Ceiling(action.TotalCost - debtRowCost - loanRowCost - penaltyRowCost);

            if (additionCost <= 0) throw new PawnshopApplicationException("Укажите сумму добора");

            var contract = _contractRepository.Get(action.ContractId);
            if (contract.Status != ContractStatus.Signed) throw new InvalidOperationException();

            using (var transaction = _contractRepository.BeginTransaction())
            {
                action.ActionType = ContractActionType.Addition;

                var monthlyPaymentTotalCost = decimal.ToInt32(contract.Actions.Where(a => a.ActionType == ContractActionType.MonthlyPayment).SelectMany(a => a.Rows).Where(r => r.PaymentType == PaymentType.Debt).Sum(r => r.Cost));
                debtRow.Cost = contract.LoanCost - monthlyPaymentTotalCost;
                RegisterOrders(contract, action, OrderType.CashIn);

                foreach (var position in contract.Positions)
                {
                    position.Status = ContractPositionStatus.PulledOut;
                }
                contract.Status = ContractStatus.BoughtOut;
                _contractRepository.Update(contract);
                
                contract.ContractData.Client.CardType = CardType.Standard;
                switch (contract.PercentPaymentType)
                {
                    case PercentPaymentType.EndPeriod:
                        contract.LoanPeriod = 30;
                        break;
                    case PercentPaymentType.AnnuityTwelve:
                        contract.LoanPeriod = 365;
                        break;
                    case PercentPaymentType.AnnuityTwentyFour:
                        contract.LoanPeriod = 730;
                        break;
                    default:
                        break;
                }

                contract.MaturityDate = DateTime.Now.Date.AddDays(contract.LoanPeriod - 1);
                contract.OriginalMaturityDate = contract.MaturityDate;

                contract.LoanCost = (int)debtRowCost + (int)additionCost;
                contract.Positions[0].EstimatedCost = contract.Positions[0].LoanCost + (int)additionCost;
                contract.Positions[0].LoanCost = contract.LoanCost;
                contract = CreateContract(contract, action, 0, 0);

                action.FollowedId = contract.Id;
                action.AuthorId = _sessionContext.UserId;
                action.CreateDate = DateTime.Now;
                _actionRepository.Insert(action);

                transaction.Commit();
            }

            return action;
        }

        [HttpPost]
        [Event(EventCode.ContractAddition, EventMode = EventMode.Request, EntityType = EntityType.Contract)]
        public ContractAction Addition([FromBody] ContractAction action)
        {
            ModelState.Validate();
            if (action == null) throw new ArgumentNullException(nameof(action));
            if (action.ContractId <= 0) throw new ArgumentException();

            var debtRow = action.Rows.FirstOrDefault(r => r.PaymentType == PaymentType.Debt);
            var debtRowCost = debtRow.Cost;

            var loanRow = action.Rows.FirstOrDefault(r => r.PaymentType == PaymentType.Loan);
            var loanRowCost = loanRow.Cost;

            var penaltyRow = action.Rows.FirstOrDefault(r => r.PaymentType == PaymentType.Penalty);
            decimal penaltyRowCost = 0;
            if (penaltyRow != null)
            {
                penaltyRowCost = penaltyRow.Cost;
            }

            var additionCost = action.TotalCost - debtRowCost - loanRowCost - penaltyRowCost;

            if (additionCost <= 0) throw new PawnshopApplicationException("Укажите сумму добора");

            var contract = _contractRepository.Get(action.ContractId);
            if (contract.Status != ContractStatus.Signed) throw new InvalidOperationException();

            using (var transaction = _contractRepository.BeginTransaction())
            {
                action.ActionType = ContractActionType.Addition;

                var monthlyPaymentTotalCost = decimal.ToInt32(contract.Actions.Where(a => a.ActionType == ContractActionType.MonthlyPayment).SelectMany(a => a.Rows).Where(r => r.PaymentType == PaymentType.Debt).Sum(r => r.Cost));
                debtRow.Cost = debtRowCost;
                RegisterOrders(contract, action, OrderType.CashIn);

                foreach (var position in contract.Positions)
                {
                    position.Status = ContractPositionStatus.PulledOut;
                }
                contract.Status = ContractStatus.BoughtOut;
                _contractRepository.Update(contract);

                contract.ContractData.Client.CardType = CardType.Standard;

                switch (contract.PercentPaymentType)
                {
                    case PercentPaymentType.EndPeriod:
                        contract.LoanPeriod = 30;
                        break;
                    case PercentPaymentType.AnnuityTwelve:
                        contract.LoanPeriod = 365;
                        break;
                    case PercentPaymentType.AnnuityTwentyFour:
                        contract.LoanPeriod = 730;
                        break;
                    default:
                        break;
                }

                contract.MaturityDate = DateTime.Now.Date.AddDays(contract.LoanPeriod - 1);
                contract.OriginalMaturityDate = contract.MaturityDate;

                contract.Positions[0].LoanCost += (int)additionCost;
                contract.LoanCost = (int)(debtRowCost + additionCost);
                contract = CreateContract(contract, action);

                action.FollowedId = contract.Id;
                action.AuthorId = _sessionContext.UserId;
                action.CreateDate = DateTime.Now;
                _actionRepository.Insert(action);

                transaction.Commit();
            }

            return action;
        }

        private Contract CreateContract(Contract contract, ContractAction action, int? loanCost = null)
        {
            var pulledPositions = contract.Positions.Where(p => p.Status == ContractPositionStatus.PulledOut).ToArray();

            var clone = new Contract();
            clone.ContractDate       = action.Date;
            clone.ClientId           = contract.ClientId;
            clone.CollateralType     = contract.CollateralType;
            clone.PercentPaymentType = contract.PercentPaymentType;
            clone.LoanPeriod         = contract.LoanPeriod;
            clone.EstimatedCost      = pulledPositions.Sum(p => p.EstimatedCost);
            clone.LoanCost           = loanCost ?? pulledPositions.Sum(p => p.LoanCost);
            clone.LoanPercent        = contract.LoanPercent;
            clone.LoanPercentCost    = clone.LoanCost * (clone.LoanPercent / 100);
            clone.PenaltyPercent     = contract.PenaltyPercent;
            clone.PenaltyPercentCost = clone.LoanCost * (clone.PenaltyPercent / 100);
            clone.Note               = contract.Note;
            clone.ContractData       = contract.ContractData;
            clone.ContractData.Client.CardType = CardType.Standard;
            clone.ContractSpecific   = contract.ContractSpecific;
            clone.Files              = contract.Files;
            clone.Positions          = pulledPositions.Select(p => new ContractPosition
            {
                PositionId       = p.PositionId,
                PositionCount    = p.PositionCount,
                LoanCost         = loanCost.HasValue ? decimal.ToInt32(Math.Round((decimal)loanCost.Value / pulledPositions.Count())) : p.LoanCost,
                CategoryId       = p.CategoryId,
                Note             = p.Note,
                PositionSpecific = p.PositionSpecific,
                Status           = ContractPositionStatus.Active
            }).ToList();
            clone.MaturityDate         = clone.ContractDate.AddDays(clone.LoanPeriod);
            clone.OriginalMaturityDate = clone.ContractDate.AddDays(clone.LoanPeriod);
            clone.Status               = ContractStatus.Draft;
            clone.Locked               = true;
            clone.OwnerId              = _branchContext.Branch.Id;
            clone.BranchId             = _branchContext.Branch.Id;
            clone.AuthorId             = _sessionContext.UserId;
            clone.ContractNumber       = _contractCounterRepository.Next(
                clone.ContractDate.Year, _branchContext.Branch.Id,
                _branchContext.Configuration.ContractSettings.NumberCode);

            _contractRepository.Insert(clone);
            _eventLog.Log(EventCode.ContractSaved, EventStatus.Success, EntityType.Contract, clone.Id, null, null);

            var insurance = _insuranceRepository.Find(new InsuranceQueryModel { ContractId = contract.Id });
            if (insurance != null)
            {
                var loanPeriod = (action.Date - contract.ContractDate).Days;
                var cashbackCost = insurance.InsuranceCost - (insurance.InsuranceCost / insurance.InsurancePeriod * loanPeriod);

                insurance.EndDate = action.Date;
                insurance.CashbackCost = cashbackCost;
                insurance.Status = InsuranceStatus.Closed;
                _insuranceRepository.Update(insurance);

                var cloneInsurance = new Insurance
                {
                    ContractId = clone.Id,
                    InsuranceNumber = insurance.InsuranceNumber,
                    InsuranceCost = cashbackCost,
                    InsurancePeriod = insurance.InsurancePeriod - loanPeriod,
                    BeginDate = action.Date.Date.AddDays(1),
                    PrevInsuranceId = insurance.Id,
                    BranchId = _branchContext.Branch.Id,
                    UserId = _sessionContext.UserId,
                    OwnerId = _branchContext.Branch.Id
                };

                _insuranceRepository.Insert(cloneInsurance);
                DateTime lastNskInsuranceDate = new DateTime(2019, 1, 21);
                if (insurance.BeginDate < lastNskInsuranceDate)
                {
                    _emailSender.InsuranceCloseSend(insurance, contract);
                }
            }

            return clone;
        }

        private Contract CreateContract(Contract contract, ContractAction action, int monthlyPaymentTotalCost, int debtRowCost)
        {
            var clone = new Contract();
            clone.ContractDate = action.Date;
            clone.ClientId = contract.ClientId;
            clone.CollateralType = contract.CollateralType;
            clone.PercentPaymentType = contract.PercentPaymentType;
            clone.LoanPeriod = contract.LoanPeriod;
            clone.EstimatedCost = contract.Positions.Sum(p => p.EstimatedCost);
            clone.LoanCost = contract.LoanCost - monthlyPaymentTotalCost - debtRowCost;
            clone.LoanPercent = contract.LoanPercent;
            clone.LoanPercentCost = clone.LoanCost * (clone.LoanPercent / 100);
            clone.PenaltyPercent = contract.PenaltyPercent;
            clone.PenaltyPercentCost = clone.LoanCost * (clone.PenaltyPercent / 100);
            clone.Note = contract.Note;
            clone.ContractData = contract.ContractData;
            clone.ContractData.Client.CardType = CardType.Standard;
            clone.ContractSpecific = contract.ContractSpecific;
            clone.Files = contract.Files;
            clone.Positions = contract.Positions.Select(p => new ContractPosition
            {
                PositionId = p.PositionId,
                PositionCount = p.PositionCount,
                LoanCost = p.LoanCost - monthlyPaymentTotalCost - debtRowCost,
                CategoryId = p.CategoryId,
                Note = p.Note,
                PositionSpecific = p.PositionSpecific,
                Status = ContractPositionStatus.Active
            }).ToList();
            clone.MaturityDate = contract.MaturityDate;
            clone.OriginalMaturityDate = contract.OriginalMaturityDate;
            clone.Status = ContractStatus.Draft;
            clone.Locked = true;
            clone.OwnerId = _branchContext.Branch.Id;
            clone.BranchId = _branchContext.Branch.Id;
            clone.AuthorId = _sessionContext.UserId;
            clone.ContractNumber = _contractCounterRepository.Next(
                clone.ContractDate.Year, _branchContext.Branch.Id,
                _branchContext.Configuration.ContractSettings.NumberCode);

            _contractRepository.Insert(clone);
            _eventLog.Log(EventCode.ContractSaved, EventStatus.Success, EntityType.Contract, clone.Id, null, null);

            var insurance = _insuranceRepository.Find(new InsuranceQueryModel { ContractId = contract.Id });
            if (insurance != null)
            {
                var loanPeriod = (action.Date - contract.ContractDate).Days;
                var cashbackCost = insurance.InsuranceCost - (insurance.InsuranceCost / insurance.InsurancePeriod * loanPeriod);

                insurance.EndDate = action.Date;
                insurance.CashbackCost = cashbackCost;
                insurance.Status = InsuranceStatus.Closed;
                _insuranceRepository.Update(insurance);

                var cloneInsurance = new Insurance
                {
                    ContractId = clone.Id,
                    InsuranceNumber = insurance.InsuranceNumber,
                    InsuranceCost = cashbackCost,
                    InsurancePeriod = insurance.InsurancePeriod - loanPeriod,
                    BeginDate = action.Date.Date.AddDays(1),
                    PrevInsuranceId = insurance.Id,
                    BranchId = _branchContext.Branch.Id,
                    UserId = _sessionContext.UserId,
                    OwnerId = _branchContext.Branch.Id
                };

                _insuranceRepository.Insert(cloneInsurance);
                DateTime lastNskInsuranceDate = new DateTime(2019, 1, 21);
                if (insurance.BeginDate < lastNskInsuranceDate)
                {
                    _emailSender.InsuranceCloseSend(insurance, contract);
                }
            }

            return clone;
        }

        private void RegisterSellings(Contract contract, ContractAction action)
        {
            var settings = _branchContext.Configuration?.CashOrderSettings;
            AccountSettings sellingSettings;
            switch (contract.CollateralType)
            {
                case CollateralType.Gold:
                    sellingSettings = settings?.GoldCollateralSettings?.SellingSettings;
                    break;
                case CollateralType.Car:
                    sellingSettings = settings?.CarCollateralSettings?.SellingSettings;
                    break;
                case CollateralType.Goods:
                    sellingSettings = settings?.GoodCollateralSettings?.SellingSettings;
                    break;
                case CollateralType.Machinery:
                    sellingSettings = settings?.MachineryCollateralSettings?.SellingSettings;
                    break;
                default:
                    throw new ArgumentOutOfRangeException();
            }
            if (sellingSettings?.CreditId == null || sellingSettings.DebitId == null)
            {
                throw new PawnshopApplicationException("Конфигурация счетов отправки на реализацию не указана.");
            }

            List<ContractActionRow> rows = new List<ContractActionRow>();

            foreach (var position in action.Data.Positions)
            {
                if (position.PositionCount > 1)
                    throw new PawnshopApplicationException("Реализация товаров в количестве больше 1 не поддерживается.");

                var selling = new Selling
                {
                    AuthorId = _sessionContext.UserId,
                    BranchId = _branchContext.Branch.Id,
                    OwnerId = _branchContext.Branch.Id,
                    CollateralType = contract.CollateralType,
                    ContractId = contract.Id,
                    ContractPositionId = position.Id > 0 ? position.Id : (int?) null,
                    PositionId = position.PositionId,
                    PositionSpecific = position.PositionSpecific,
                    PriceCost = position.EstimatedCost,
                    Note = action.Note,
                    CreateDate = DateTime.Now,
                    Status = SellingStatus.InStock,
                };
                _sellingRepository.Insert(selling);
                _eventLog.Log(EventCode.SellingSaved, EventStatus.Success, EntityType.Selling, selling.Id, null, null);

                var order = new CashOrder();
                order.OrderType = OrderType.Selling;
                order.ClientId = null;
                order.CreditAccountId = sellingSettings.CreditId.Value;
                order.DebitAccountId = sellingSettings.DebitId.Value;
                order.OrderCost = position.LoanCost;
                order.OrderDate = action.Date;
                order.Note = action.Note;
                order.Reason = action.Reason;
                order.RegDate = DateTime.Now;
                order.OwnerId = _branchContext.Branch.Id;
                order.BranchId = _branchContext.Branch.Id;
                order.AuthorId = _sessionContext.UserId;
                order.OrderNumber = _cashCounterRepository.Next(
                    order.OrderType, order.OrderDate.Year,
                    _branchContext.Branch.Id, "SEL"); // TODO

                _orderRepository.Insert(order);
                _eventLog.Log(EventCode.CashOrderSaved, EventStatus.Success, EntityType.CashOrder, order.Id, null, null);

                rows.Add(new ContractActionRow
                {
                    ActionId = action.Id,
                    Cost = order.OrderCost,
                    CreditAccountId = order.CreditAccountId,
                    DebitAccountId = order.DebitAccountId,
                    OrderId = order.Id,
                    PaymentType = PaymentType.Debt
                });
            }

            action.Rows = rows.ToArray();
        }

        private void RegisterOrders(Contract contract, ContractAction action, OrderType orderType)
        {
            if (action.Rows == null || action.Rows.Length == 0) throw new ArgumentException();

            foreach (var row in action.Rows)
            {
                string code;
                switch (orderType)
                {
                    case OrderType.CashIn:
                        code = _branchContext.Configuration.CashOrderSettings.CashInNumberCode;
                        break;
                    case OrderType.CashOut:
                        code = _branchContext.Configuration.CashOrderSettings.CashOutNumberCode;
                        break;
                    default:
                        throw new ArgumentOutOfRangeException(nameof(orderType), orderType, null);
                }

                var order = new CashOrder();
                order.OrderType       = orderType;
                order.ClientId        = contract.ClientId;
                order.CreditAccountId = row.CreditAccountId;
                order.DebitAccountId  = row.DebitAccountId;
                order.OrderCost       = Math.Round(row.Cost);
                order.OrderDate       = action.Date;
                order.Note            = string.IsNullOrWhiteSpace(action.Note) ? GetDefaultNote(row.PaymentType, action.ActionType) : action.Note;
                order.Reason          = action.Reason;
                order.RegDate         = DateTime.Now;
                if (contract.BranchId != _branchContext.Branch.Id)
                {
                    order.OwnerId = contract.BranchId;
                    order.BranchId = contract.BranchId;
                    order.AuthorId = _sessionContext.UserId;
                    order.OrderNumber = _cashCounterRepository.Next(
                        order.OrderType, order.OrderDate.Year,
                        contract.BranchId, contract.Branch.Name);
                }
                else
                {
                    order.OwnerId = _branchContext.Branch.Id;
                    order.BranchId = _branchContext.Branch.Id;
                    order.AuthorId = _sessionContext.UserId;
                    order.OrderNumber = _cashCounterRepository.Next(
                        order.OrderType, order.OrderDate.Year,
                        _branchContext.Branch.Id, code);
                }

                _orderRepository.Insert(order);
                _eventLog.Log(EventCode.CashOrderSaved, EventStatus.Success, EntityType.CashOrder, order.Id, null, null);

                row.OrderId = order.Id;
            }
        }

        private void RegisterInsuranceSignAction(Insurance insurance, ContractAction contractAction)
        {
            var action = new InsuranceAction
            {
                InsuranceId = insurance.Id,
                ActionType = InsuranceActionType.Sign,
                ActionDate = contractAction.Date,
                AuthorId = _sessionContext.UserId
            };

            if (insurance.PrevInsuranceId.HasValue)
            {
                var prevInsurance = _insuranceRepository.Get(insurance.PrevInsuranceId.Value);
                var prevInsuranceSignAction = prevInsurance.Actions.FirstOrDefault(a => a.ActionType == InsuranceActionType.Sign);
                if (prevInsuranceSignAction == null) throw new InvalidOperationException();

                action.OrderId = prevInsuranceSignAction.OrderId;
            }
            else
            {
                var order = new CashOrder
                {
                    OrderType = OrderType.CashIn,
                    ClientId = insurance.Contract.ClientId,
                    DebitAccountId = _branchContext.Configuration?.CashOrderSettings?.InsuranceSettings?.SignSettings?.DebitId ?? 0,
                    CreditAccountId = _branchContext.Configuration?.CashOrderSettings?.InsuranceSettings?.SignSettings?.CreditId ?? 0,
                    OrderCost = insurance.InsuranceCost,
                    OrderDate = action.ActionDate,
                    Reason = "Подписание страхового договора",
                    RegDate = DateTime.Now,
                    OwnerId = _branchContext.Branch.Id,
                    BranchId = _branchContext.Branch.Id,
                    AuthorId = _sessionContext.UserId,
                    OrderNumber = _cashCounterRepository.Next(OrderType.CashIn, action.ActionDate.Year, _branchContext.Branch.Id, _branchContext.Configuration.CashOrderSettings.CashInNumberCode)
                };

                if (order.DebitAccountId == 0 || order.CreditAccountId == 0)
                {
                    throw new PawnshopApplicationException("Настройте счета дебет и кредит для страхового договора");
                }

                _orderRepository.Insert(order);
                _eventLog.Log(EventCode.CashOrderSaved, EventStatus.Success, EntityType.CashOrder, order.Id, null, null);

                action.OrderId = order.Id;
            }

            _insuranceActionRepository.Insert(action);

            insurance.Status = InsuranceStatus.Signed;
            _insuranceRepository.Update(insurance);
        }

        private string GetDefaultNote(PaymentType paymentType, ContractActionType actionType)
        {
            switch (paymentType)
            {
                case PaymentType.Debt:
                    return actionType == ContractActionType.PartialBuyout ||
                           actionType == ContractActionType.PartialPayment
                        ? "Частичный основной долг"
                        : "Основной долг";
                case PaymentType.Loan:
                    return "Проценты";
                case PaymentType.Penalty:
                    return "Штраф за просрочку";
                default:
                    return string.Empty;
            }
        }

        private Remittance RemittanceToOtherGroup(Contract contract, ContractAction action)
        {
            Remittance remittance = new Remittance
            {
                CreateDate = DateTime.Now,
                SendDate = DateTime.Now,
                SendBranchId = contract.BranchId,
                SendUserId = 1,
                SendCost = (int) action.TotalCost,

                ReceiveBranchId = _branchContext.Branch.Id,
                ReceiveUserId = 1,
                ReceiveDate = DateTime.Now,
                Note = action.Reason,
                Status = RemittanceStatusType.Received,
                ContractId = action.ContractId
            };
            _remittanceRepository.Insert(remittance);

            CreateCashOrdersForRemittance(remittance,contract);

            return remittance;
        }

        private Remittance CreateCashOrdersForRemittance(Remittance remittance, Contract contract)
        {

            var remittanceSetting = _remittanceSettingRepository.Find(new { remittance.SendBranchId, remittance.ReceiveBranchId });
            if (remittanceSetting == null)
            {
                throw new PawnshopApplicationException("Не найдены настройки переводов для выбранной пары филиалов");
            }

            var sendBranch = remittance.SendBranch;
            var cashOutNumberCode = sendBranch?.Configuration?.CashOrderSettings?.CashOutNumberCode ?? _branchContext.Configuration.CashOrderSettings.CashOutNumberCode;
            var outOrder = new CashOrder
            {
                OrderType = OrderType.CashOut,
                DebitAccountId = remittanceSetting.CashOutDebitId,
                CreditAccountId = remittanceSetting.CashOutCreditId,
                OrderCost = remittance.SendCost,
                OrderDate = remittance.SendDate,
                ExpenseTypeId = remittanceSetting.ExpenseTypeId,
                Reason = $"Снятие денег для передачи в филиал {remittance.ReceiveBranch?.DisplayName} для {remittance.Note}",
                Note = remittance.Note,
                RegDate = DateTime.Now,
                OwnerId = remittance.SendBranchId,
                BranchId = remittance.SendBranchId,
                AuthorId = remittance.SendUserId,
                OrderNumber = _cashCounterRepository.Next(OrderType.CashOut, remittance.SendDate.Year, remittance.SendBranchId, cashOutNumberCode),
                ClientId = contract.ClientId
            };

            _orderRepository.Insert(outOrder);
            _eventLog.Log(EventCode.CashOrderSaved, EventStatus.Success, EntityType.CashOrder, outOrder.Id, JsonConvert.SerializeObject(remittance), JsonConvert.SerializeObject(outOrder));
            remittance.SendOrderId = outOrder.Id;

            var inOrder = new CashOrder
            {
                OrderType = OrderType.CashIn,
                DebitAccountId = remittanceSetting.CashInDebitId,
                CreditAccountId = remittanceSetting.CashInCreditId,
                OrderCost = remittance.SendCost,
                OrderDate = remittance.ReceiveDate.Value,
                Reason = $"Получение денег из филиала {remittance.SendBranch?.DisplayName} для {remittance.Note}",
                Note = remittance.Note,
                RegDate = DateTime.Now,
                OwnerId = remittance.ReceiveBranchId,
                BranchId = remittance.ReceiveBranchId,
                AuthorId = remittance.ReceiveUserId.Value,
                OrderNumber = _cashCounterRepository.Next(OrderType.CashIn, remittance.ReceiveDate.Value.Year, remittance.ReceiveBranchId, _branchContext.Configuration.CashOrderSettings.CashInNumberCode),
                ClientId = contract.ClientId
            };

            _orderRepository.Insert(inOrder);
            _eventLog.Log(EventCode.CashOrderSaved, EventStatus.Success, EntityType.CashOrder, inOrder.Id, JsonConvert.SerializeObject(remittance), JsonConvert.SerializeObject(inOrder));
            remittance.ReceiveOrderId = inOrder.Id;
            _remittanceRepository.Update(remittance);
            return remittance;
        }

        private InnerNotification CreateInnerNotificationToOtherGroup(Contract contract, ContractAction action)
        {
            string message = String.Empty;
            switch (action.ActionType)
            {
                case ContractActionType.Prolong:
                    message =
                        $@"Ваш договор {contract.ContractNumber} был продлен в филиале {_branchContext.Branch.DisplayName} на сумму {action.TotalCost.ToString()}. Сделайте необходимые действия.";
                    break;
                case ContractActionType.Buyout:
                    message =
                        $@"Ваш договор {contract.ContractNumber} был выкуплен в филиале {_branchContext.Branch.DisplayName} на сумму {action.TotalCost.ToString()}. Сделайте необходимые действия.";
                    break;
                case ContractActionType.MonthlyPayment:
                    message =
                        $@"По договору {contract.ContractNumber} был принят ежемесячный платеж в филиале {_branchContext.Branch.DisplayName} на сумму {action.TotalCost.ToString()}. Сделайте необходимые действия.";
                    break;
                default:
                    message = $@"Договор {contract.ContractNumber} - действие {action.ActionType.GetDisplayName()}";
                    break;
            }
            var notification = new InnerNotification
            {
                Id = 0,
                CreateDate = DateTime.Now,
                CreatedBy = 1,
                EntityType = EntityType.Contract,
                EntityId = contract.Id,
                Message = message,
                ReceiveBranchId = contract.BranchId,
                Status = InnerNotificationStatus.Sent
            };
            _innerNotificationRepository.Insert(notification);
            return notification;
        }
    }
}