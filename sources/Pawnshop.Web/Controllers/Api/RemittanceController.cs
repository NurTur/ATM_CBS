using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Pawnshop.Core;
using Pawnshop.Core.Exceptions;
using Pawnshop.Data.Access;
using Pawnshop.Data.Models.Audit;
using Pawnshop.Data.Models.CashOrders;
using Pawnshop.Web.Engine;
using Pawnshop.Web.Engine.Audit;
using Pawnshop.Web.Models.CashOrder;
using Pawnshop.Web.Models.List;

namespace Pawnshop.Web.Controllers.Api
{
    [Authorize(Permissions.CashOrderView)]
    public class RemittanceController : Controller
    {
        private readonly RemittanceRepository _remittanceRepository;
        private readonly CashOrderRepository _orderRepository;
        private readonly CashOrderNumberCounterRepository _cashCounterRepository;
        private readonly RemittanceSettingRepository _remittanceSettingRepository;
        private readonly MemberRepository _memberRepository;
        private readonly BranchContext _branchContext;
        private readonly ISessionContext _sessionContext;
        private readonly EventLog _eventLog;

        public RemittanceController(RemittanceRepository remittanceRepository, CashOrderRepository orderRepository,
                                    CashOrderNumberCounterRepository cashCounterRepository, RemittanceSettingRepository remittanceSettingRepository,
                                    MemberRepository memberRepository,
                                    BranchContext  branchContext, ISessionContext sessionContext, EventLog eventLog)
        {
            _remittanceRepository = remittanceRepository;
            _orderRepository = orderRepository;
            _cashCounterRepository = cashCounterRepository;
            _remittanceSettingRepository = remittanceSettingRepository;
            _memberRepository = memberRepository;
            _branchContext = branchContext;
            _sessionContext = sessionContext;
            _eventLog = eventLog;
        }

        [HttpPost]
        public ListModel<Remittance> List([FromBody] ListQueryModel<RemittanceListQueryModel> listQuery)
        {
            if (listQuery == null) listQuery = new ListQueryModel<RemittanceListQueryModel>();
            if (listQuery.Model == null) listQuery.Model = new RemittanceListQueryModel();
            listQuery.Model.BranchId = _branchContext.Branch.Id;

            if (listQuery.Model.EndDate.HasValue)
            {
                listQuery.Model.EndDate = listQuery.Model.EndDate.Value.Date.AddHours(23).AddMinutes(59).AddSeconds(59);
            }

            return new ListModel<Remittance>
            {
                List = _remittanceRepository.List(listQuery, listQuery.Model),
                Count = _remittanceRepository.Count(listQuery, listQuery.Model)
            };
        }

        [HttpPost]
        public Remittance Card([FromBody] int id)
        {
            if (id <= 0) throw new ArgumentOutOfRangeException(nameof(id));

            var model = _remittanceRepository.Get(id);
            if (model == null) throw new InvalidOperationException();

            return model;
        }

        [HttpPost, Authorize(Permissions.CashOrderManage)]
        public Remittance Save([FromBody] Remittance model)
        {
            if (model.Id == 0)
            {
                model.SendBranchId = _branchContext.Branch.Id;
                model.SendUserId = _sessionContext.UserId;
                model.SendDate = DateTime.Now;
                model.Status = RemittanceStatusType.Sent;
                model.CreateDate = DateTime.Now;
            }

            ModelState.Clear();
            TryValidateModel(model);
            ModelState.Validate();

            if (model.SendBranchId != _branchContext.Branch.Id) throw new PawnshopApplicationException("Запрещено редактировать переводы созданные не в вашем филиале");

            if (model.Id > 0)
            {
                _remittanceRepository.Update(model);
            }
            else
            {
                _remittanceRepository.Insert(model);
            }

            return model;
        }

        [HttpPost, Authorize(Permissions.CashOrderManage)]
        public IActionResult Delete([FromBody] int id)
        {
            if (id <= 0) throw new ArgumentOutOfRangeException(nameof(id));

            var model = _remittanceRepository.Get(id);
            if (model == null) throw new InvalidOperationException();
            if (model.Status > RemittanceStatusType.Sent) throw new PawnshopApplicationException("Запрещено удалять принятые переводы");

            _remittanceRepository.Delete(id);
            return Ok();
        }

        [HttpPost, Authorize(Permissions.CashOrderManage)]
        public Remittance Receive([FromBody] int id)
        {
            if (id <= 0) throw new ArgumentOutOfRangeException(nameof(id));

            var model = _remittanceRepository.Get(id);
            if (model == null) throw new InvalidOperationException();
            if (model.Status > RemittanceStatusType.Sent) throw new PawnshopApplicationException("Запрещено принимать принятые переводы");

            using (var transaction = _remittanceRepository.BeginTransaction())
            {
                model.ReceiveUserId = _sessionContext.UserId;
                model.ReceiveDate = model.SendDate;
                model.Status = RemittanceStatusType.Received;

                RegisterOrder(model);

                _remittanceRepository.Update(model);

                transaction.Commit();
            }

            return model;
        }

        [HttpPost, Authorize(Permissions.CashOrderManage)]
        public void ReceiveCancel([FromBody] int id)
        {
            if (id <= 0) throw new ArgumentOutOfRangeException(nameof(id));

            var model = _remittanceRepository.Get(id);
            if (model == null) throw new InvalidOperationException();
            if (model.Status != RemittanceStatusType.Received) throw new PawnshopApplicationException("Невозможно отменять непринятые переводы");
            if (model.CreateDate.Date != DateTime.Today)
            {
                throw new PawnshopApplicationException("Данное действие отмене не подлежит.");
            }

            if (model.ContractId.HasValue)
            {
                throw new PawnshopApplicationException("Невозможно отменить порожденный перевод");
            }

            using (var transaction = _remittanceRepository.BeginTransaction())
            {
                model.ReceiveUserId = null;
                model.ReceiveDate = null;
                model.Status = RemittanceStatusType.Sent;

                _orderRepository.Delete(model.SendOrderId.Value);
                _eventLog.Log(EventCode.CashOrderDeleted, EventStatus.Success, EntityType.CashOrder, model.SendOrderId.Value, null, null);
                model.SendOrderId = null;

                _orderRepository.Delete(model.ReceiveOrderId.Value);
                _eventLog.Log(EventCode.CashOrderDeleted, EventStatus.Success, EntityType.CashOrder, model.ReceiveOrderId.Value, null, null);
                model.ReceiveOrderId = null;

                _remittanceRepository.Update(model);

                transaction.Commit();
            }
        }

        private void RegisterOrder(Remittance remittance)
        {
            var remittanceSetting = _remittanceSettingRepository.Find(new { remittance.SendBranchId, remittance.ReceiveBranchId });
            if (remittanceSetting == null)
            {
                throw new PawnshopApplicationException("Не найдены настройки переводов для выбранной пары филиалов");
            }

            var sendBranch = _memberRepository.FindBranch(remittance.SendUserId, remittance.SendBranchId);
            var cashOutNumberCode = sendBranch?.Configuration?.CashOrderSettings?.CashOutNumberCode ?? _branchContext.Configuration.CashOrderSettings.CashOutNumberCode;
            var outOrder = new CashOrder
            {
                OrderType = OrderType.CashOut,
                UserId = remittanceSetting.CashOutUserId,
                DebitAccountId = remittanceSetting.CashOutDebitId,
                CreditAccountId = remittanceSetting.CashOutCreditId,
                OrderCost = remittance.SendCost,
                OrderDate = remittance.SendDate,
                ExpenseTypeId = remittanceSetting.ExpenseTypeId,
                Reason = $"Снятие денег для передачи в филиал {remittance.ReceiveBranch?.DisplayName}",
                Note = remittance.Note,
                RegDate = DateTime.Now,
                OwnerId = remittance.SendBranchId,
                BranchId = remittance.SendBranchId,
                AuthorId = remittance.SendUserId,
                OrderNumber = _cashCounterRepository.Next(OrderType.CashOut, remittance.SendDate.Year, remittance.SendBranchId, cashOutNumberCode)
            };

            _orderRepository.Insert(outOrder);
            _eventLog.Log(EventCode.CashOrderSaved, EventStatus.Success, EntityType.CashOrder, outOrder.Id, JsonConvert.SerializeObject(remittance), JsonConvert.SerializeObject(outOrder));
            remittance.SendOrderId = outOrder.Id;

            var inOrder = new CashOrder
            {
                OrderType = OrderType.CashIn,
                UserId = remittanceSetting.CashInUserId,
                DebitAccountId = remittanceSetting.CashInDebitId,
                CreditAccountId = remittanceSetting.CashInCreditId,
                OrderCost = remittance.SendCost,
                OrderDate = remittance.ReceiveDate.Value,
                Reason = $"Получение денег из филиала {remittance.SendBranch?.DisplayName}",
                Note = remittance.Note,
                RegDate = DateTime.Now,
                OwnerId = remittance.ReceiveBranchId,
                BranchId = remittance.ReceiveBranchId,
                AuthorId = remittance.ReceiveUserId.Value,
                OrderNumber = _cashCounterRepository.Next(OrderType.CashIn, remittance.ReceiveDate.Value.Year, remittance.ReceiveBranchId, _branchContext.Configuration.CashOrderSettings.CashInNumberCode)
            };

            _orderRepository.Insert(inOrder);
            _eventLog.Log(EventCode.CashOrderSaved, EventStatus.Success, EntityType.CashOrder, inOrder.Id, JsonConvert.SerializeObject(remittance), JsonConvert.SerializeObject(inOrder));
            remittance.ReceiveOrderId = inOrder.Id;
        }
    }
}
