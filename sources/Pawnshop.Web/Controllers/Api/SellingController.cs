using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.StaticFiles;
using Pawnshop.Core;
using Pawnshop.Core.Exceptions;
using Pawnshop.Data.Access;
using Pawnshop.Data.Models.Audit;
using Pawnshop.Data.Models.CashOrders;
using Pawnshop.Data.Models.Contracts;
using Pawnshop.Data.Models.Contracts.Actions;
using Pawnshop.Data.Models.Files;
using Pawnshop.Data.Models.Sellings;
using Pawnshop.Web.Engine;
using Pawnshop.Web.Engine.Export;
using Pawnshop.Web.Engine.Middleware;
using Pawnshop.Web.Engine.Storage;
using Pawnshop.Web.Models.List;
using Pawnshop.Web.Models.Sellings;

namespace Pawnshop.Web.Controllers.Api
{
    [Authorize(Permissions.SellingView)]
    public class SellingController : Controller
    {
        private readonly SellingRepository _repository;
        private readonly CashOrderRepository _cashOrderRepository;
        private readonly ContractRepository _contractRepository;
        private readonly CashOrderNumberCounterRepository _counterRepository;
        private readonly SellingsExcelBuilder _excelBuilder;
        private readonly IStorage _storage;
        private readonly BranchContext _branchContext;
        private readonly ISessionContext _sessionContext;

        public SellingController(SellingRepository repository, CashOrderRepository cashOrderRepository, ContractRepository contractRepository,
            CashOrderNumberCounterRepository counterRepository, SellingsExcelBuilder excelBuilder,
            IStorage storage, BranchContext branchContext, ISessionContext sessionContext)
        {
            _repository = repository;
            _cashOrderRepository = cashOrderRepository;
            _contractRepository = contractRepository;
            _counterRepository = counterRepository;
            _excelBuilder = excelBuilder;
            _storage = storage;
            _branchContext = branchContext;
            _sessionContext = sessionContext;
        }

        [HttpPost]
        public ListModel<Selling> List([FromBody] ListQueryModel<SellingListQueryModel> listQuery)
        {
            if (listQuery == null) listQuery = new ListQueryModel<SellingListQueryModel>();
            if (listQuery.Model == null) listQuery.Model = new SellingListQueryModel();
            listQuery.Model.OwnerId = _branchContext.Branch.Id;

            return new ListModel<Selling>
            {
                List = _repository.List(listQuery, listQuery.Model),
                Count = _repository.Count(listQuery, listQuery.Model)
            };
        }

        [HttpPost]
        public Selling Card([FromBody] int id)
        {
            if (id <= 0) throw new ArgumentOutOfRangeException(nameof(id));

            var selling = _repository.Get(id);
            if (selling == null) throw new InvalidOperationException();

            if (!selling.SellingDate.HasValue)
            {
                selling.SellingDate = DateTime.Now;
            }
            return selling;
        }

        [HttpPost, Authorize(Permissions.SellingManage)]
        [Event(EventCode.SellingSaved, EventMode = EventMode.Response, EntityType = EntityType.Selling)]
        public Selling Save([FromBody] Selling selling)
        {
            using (var transaction = _repository.BeginTransaction())
            {
                if (selling.Id == 0)
                {
                    selling.OwnerId = _branchContext.Branch.Id;
                    selling.BranchId = _branchContext.Branch.Id;
                    selling.AuthorId = _sessionContext.UserId;
                }

                ModelState.Clear();
                TryValidateModel(selling);
                ModelState.Validate();

                if (selling.Id > 0)
                {
                    _repository.Update(selling);
                }
                else
                {
                    _repository.Insert(selling);
                }

                transaction.Commit();
            }

            return selling;
        }

        [HttpPost, Authorize(Permissions.SellingManage)]
        [Event(EventCode.SellingSell, EventMode = EventMode.Response, EntityType = EntityType.Selling)]
        public Selling Sell([FromBody] Selling selling)
        {
            using (var transaction = _repository.BeginTransaction())
            {
                if (selling.Id == 0)
                {
                    throw new PawnshopApplicationException("Сохраните реализацию для регистрации продажи");
                }

                if (selling.CashOrderId.HasValue)
                {
                    throw new PawnshopApplicationException("Продажа уже зарегистрирована");
                }

                selling.Status = SellingStatus.Sold;

                if (selling.ContractId.HasValue && selling.ContractPositionId.HasValue)
                {
                    var contract = _contractRepository.Get(selling.ContractId.Value);
                    var position = contract.Positions.SingleOrDefault(p => p.Id == selling.ContractPositionId.Value);
                    if (position != null)
                    {
                        position.Status = ContractPositionStatus.Disposed;
                    }
                    if (contract.Positions.All(p => p.Status == ContractPositionStatus.Disposed))
                    {
                        contract.Status = ContractStatus.Disposed;
                    }
                    _contractRepository.Update(contract);
                }

                ModelState.Clear();
                TryValidateModel(selling);
                ModelState.Validate();

                var settings = _branchContext.Configuration.CashOrderSettings
                    .Get(selling.CollateralType).DisposeSettings;

                if (!selling.SellingDate.HasValue)
                {
                    throw new PawnshopApplicationException("Поле дата продажи обязательно для заполнения");
                }

                if (!selling.SellingCost.HasValue)
                {
                    throw new PawnshopApplicationException("Поле стоимость продажи обязательно для заполнения");
                }

                if (!settings.DebitId.HasValue)
                {
                    throw new PawnshopApplicationException("В настройках организации заполните счет дебет для реализации");
                }

                if (!settings.CreditId.HasValue)
                {
                    throw new PawnshopApplicationException("В настройках организации заполните счет кредит для реализации");
                }

                var cashOrder = new CashOrder
                {
                    OrderType = OrderType.CashIn,
                    OrderNumber = _counterRepository.Next(
                        OrderType.CashIn, selling.SellingDate.Value.Year,
                        _branchContext.Branch.Id,
                        _branchContext.Configuration.CashOrderSettings.CashInNumberCode),
                    OrderDate = selling.SellingDate.Value,
                    OrderCost = selling.SellingCost.Value,
                    DebitAccountId = settings.DebitId.Value,
                    CreditAccountId = settings.CreditId.Value,
                    UserId = _sessionContext.UserId,
                    Reason = $"Продажа изделия {selling.Note}",
                    RegDate = DateTime.Now,
                    OwnerId = _branchContext.Branch.Id,
                    BranchId = _branchContext.Branch.Id,
                    AuthorId = _sessionContext.UserId
                };

                _cashOrderRepository.Insert(cashOrder);
                selling.CashOrderId = cashOrder.Id;
                selling.CashOrder = _cashOrderRepository.Get(cashOrder.Id);

                _repository.Update(selling);

                transaction.Commit();
            }

            return selling;
        }

        [HttpPost, Authorize(Permissions.SellingManage)]
        [Event(EventCode.SellingSellCancel, EventMode = EventMode.Request, EntityType = EntityType.Selling)]
        public IActionResult Cancel([FromBody] int id)
        {
            if (id <= 0) throw new ArgumentOutOfRangeException(nameof(id));

            var selling = _repository.Get(id);
            if (selling.Status != SellingStatus.Sold)
            {
                throw new PawnshopApplicationException("Не возможно отменить продажу у непроданного изделия");
            }

            if (!selling.CashOrderId.HasValue)
            {
                throw new PawnshopApplicationException("Не найден приходный кассовый ордер, отмена не возможна");
            }

            using (var transaction = _repository.BeginTransaction())
            {
                _cashOrderRepository.Delete(selling.CashOrderId.Value);

                selling.SellingCost = null;
                selling.SellingDate = null;
                selling.Status = SellingStatus.InStock;
                selling.CashOrderId = null;

                _repository.Update(selling);

                transaction.Commit();
            }

            return Ok();
        }

        [HttpPost, Authorize(Permissions.SellingManage)]
        [Event(EventCode.SellingDeleted, EventMode = EventMode.Request, EntityType = EntityType.Selling)]
        public IActionResult Delete([FromBody] int id)
        {
            if (id <= 0) throw new ArgumentOutOfRangeException(nameof(id));

            _repository.Delete(id);
            return Ok();
        }

        [HttpPost]
        public async Task<IActionResult> Export([FromBody] List<Selling> sellings)
        {
            using (var stream = _excelBuilder.Build(sellings))
            {
                var fileName = await _storage.Save(stream, ContainerName.Temp, "export.xlsx");
                string contentType;
                new FileExtensionContentTypeProvider().TryGetContentType(fileName, out contentType);

                var fileRow = new FileRow
                {
                    CreateDate = DateTime.Now,
                    ContentType = contentType ?? "application/octet-stream",
                    FileName = fileName,
                    FilePath = fileName
                };
                return Ok(fileRow);
            }
        }
    }
}