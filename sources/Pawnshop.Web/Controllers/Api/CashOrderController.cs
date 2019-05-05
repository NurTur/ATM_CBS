using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.StaticFiles;
using Pawnshop.Core;
using Pawnshop.Core.Exceptions;
using Pawnshop.Data.Access;
using Pawnshop.Data.Models.Audit;
using Pawnshop.Data.Models.CashOrders;
using Pawnshop.Data.Models.Files;
using Pawnshop.Web.Engine;
using Pawnshop.Web.Engine.Export;
using Pawnshop.Web.Engine.Middleware;
using Pawnshop.Web.Engine.Storage;
using Pawnshop.Web.Models.CashOrder;
using Pawnshop.Web.Models.List;

namespace Pawnshop.Web.Controllers.Api
{
    [Authorize(Permissions.CashOrderView)]
    public class CashOrderController : Controller
    {
        private readonly CashOrderRepository _repository;
        private readonly CashOrderNumberCounterRepository _counterRepository;
        private readonly CashOrdersExcelBuilder _excelBuilder;
        private readonly IStorage _storage;
        private readonly BranchContext _branchContext;
        private readonly ISessionContext _sessionContext;

        public CashOrderController(CashOrderRepository repository,
            CashOrderNumberCounterRepository counterRepository, CashOrdersExcelBuilder excelBuilder,
            IStorage storage, BranchContext branchContext,
            ISessionContext sessionContext)
        {
            _repository = repository;
            _counterRepository = counterRepository;
            _excelBuilder = excelBuilder;
            _storage = storage;
            _branchContext = branchContext;
            _sessionContext = sessionContext;
        }

        [HttpPost]
        public ListModel<CashOrder> List([FromBody] ListQueryModel<CashOrderListQueryModel> listQuery)
        {
            if (listQuery == null) listQuery = new ListQueryModel<CashOrderListQueryModel>();
            if (listQuery.Model == null) listQuery.Model = new CashOrderListQueryModel();
            if (listQuery.Model.OwnerId==0)
            {
                listQuery.Model.OwnerId = _branchContext.Branch.Id;
            }

            if (listQuery.Model.EndDate.HasValue)
            {
                listQuery.Model.EndDate = listQuery.Model.EndDate.Value.Date.AddHours(23).AddMinutes(59).AddSeconds(59);
            }

            return new ListModel<CashOrder>
            {
                List = _repository.List(listQuery, listQuery.Model),
                Count = _repository.Count(listQuery, listQuery.Model)
            };
        }

        [HttpPost]
        public CashOrder Card([FromBody] int id)
        {
            if (id <= 0) throw new ArgumentOutOfRangeException(nameof(id));

            var cashOrder = _repository.Get(id);
            if (cashOrder == null) throw new InvalidOperationException();

            return cashOrder;
        }

        [HttpPost]
        public CashOrder Find([FromBody] CashOrderQueryModel query)
        {
            var cashOrder = _repository.Find(query);
            return cashOrder;
        }

        [HttpPost, Authorize(Permissions.CashOrderManage)]
        public CashOrder Copy([FromBody] int id)
        {
            if (id <= 0) throw new ArgumentOutOfRangeException(nameof(id));

            var cashOrder = _repository.Get(id);
            if (cashOrder == null) throw new InvalidOperationException();

            cashOrder.Id = 0;
            cashOrder.OrderNumber = string.Empty;
            cashOrder.OrderDate = DateTime.Now;
            cashOrder.RegDate = DateTime.Now;
            cashOrder.OwnerId = 0;
            cashOrder.BranchId = 0;
            cashOrder.AuthorId = 0;
            return cashOrder;
        }

        [HttpPost, Authorize(Permissions.CashOrderManage)]
        [Event(EventCode.CashOrderSaved, EventMode = EventMode.Response, EntityType = EntityType.CashOrder)]
        public CashOrder Save([FromBody] CashOrder cashOrder)
        {
            if (cashOrder.Id == 0)
            {
                cashOrder.RegDate = DateTime.Now;
                cashOrder.OwnerId = _branchContext.Branch.Id;
                cashOrder.BranchId = _branchContext.Branch.Id;
                cashOrder.AuthorId = _sessionContext.UserId;
                cashOrder.ApproveStatus = 0;
            }

            ModelState.Clear();
            TryValidateModel(cashOrder);
            ModelState.Validate();

            if (cashOrder.OrderDate.Date < DateTime.Now.Date && !_sessionContext.ForSupport)
            {
                throw new PawnshopApplicationException("Поле дата кассового ордера не может быть меньше текущей даты");
            }

            using (var transaction = _repository.BeginTransaction())
            {
                if (cashOrder.Id > 0)
                {
                    _repository.Update(cashOrder);
                }
                else
                {
                    string code;
                    switch (cashOrder.OrderType)
                    {
                        case OrderType.CashIn:
                            code = _branchContext.Configuration.CashOrderSettings.CashInNumberCode;
                            break;
                        case OrderType.CashOut:
                            code = _branchContext.Configuration.CashOrderSettings.CashOutNumberCode;
                            break;
                        default:
                            throw new ArgumentOutOfRangeException(nameof(cashOrder.OrderType), cashOrder.OrderType, null);
                    }
                    cashOrder.OrderNumber = _counterRepository.Next(
                        cashOrder.OrderType, cashOrder.OrderDate.Year,
                        _branchContext.Branch.Id, code);
                    _repository.Insert(cashOrder);
                }

                transaction.Commit();
            }

            return cashOrder;
        }

        [HttpPost, Authorize(Permissions.CashOrderManage)]
        [Event(EventCode.CashOrderDeleted, EventMode = EventMode.Request, EntityType = EntityType.CashOrder)]
        public IActionResult Delete([FromBody] int id)
        {
            if (id <= 0) throw new ArgumentOutOfRangeException(nameof(id));

            var cashOrder = _repository.Get(id);
            if (cashOrder == null) throw new InvalidOperationException();
            if (!cashOrder.CreatedToday && !_sessionContext.ForSupport) throw new PawnshopApplicationException("Удалять можно только кассовые ордеры за сегодняшний день");

            var count = _repository.RelationCount(id);
            if (count > 0)
            {
                throw new Exception("Невозможно удалить кассовый ордер, так как он привязан к другим документам");
            }

            _repository.Delete(id);
            return Ok();
        }

        [HttpPost, Authorize(Permissions.CashOrderManage)]
        [Event(EventCode.CashOrderRecovery, EventMode = EventMode.Request, EntityType = EntityType.CashOrder)]
        public IActionResult UndoDelete([FromBody] int id)
        {
            if (id <= 0) throw new ArgumentOutOfRangeException(nameof(id));

            var cashOrder = _repository.Get(id);
            if (cashOrder == null) throw new InvalidOperationException();
            if (!cashOrder.CreatedToday && !_sessionContext.ForSupport) throw new PawnshopApplicationException("Восстанавливать можно только кассовые ордеры за сегодняшний день");

            _repository.UndoDelete(id);
            return Ok();
        }

        [HttpPost, Authorize(Permissions.CashOrderApprove)]
        [Event(EventCode.CashOrderApproved, EventMode = EventMode.Response, EntityType = EntityType.CashOrder)]
        public CashOrder Approve ([FromBody] int id)
        {
            if (id <= 0) throw new ArgumentOutOfRangeException(nameof(id));

            var cashOrder = _repository.Get(id);

            cashOrder.ApprovedId = _sessionContext.UserId;
            cashOrder.ApproveStatus = OrderStatus.Approved;
            cashOrder.ApproveDate = DateTime.Now;

            using (var transaction = _repository.BeginTransaction())
            {
                _repository.Update(cashOrder);

                transaction.Commit();
            }

            return cashOrder;
        }

        [HttpPost, Authorize(Permissions.CashOrderApprove)]
        [Event(EventCode.CashOrderProhibited, EventMode = EventMode.Response, EntityType = EntityType.CashOrder)]
        public CashOrder Prohibit ([FromBody] int id)
        {
            if (id <= 0) throw new ArgumentOutOfRangeException(nameof(id));

            var cashOrder = _repository.Get(id);

            cashOrder.ApprovedId = _sessionContext.UserId;
            cashOrder.ApproveStatus = OrderStatus.Prohibited;
            cashOrder.ApproveDate = DateTime.Now;

            using (var transaction = _repository.BeginTransaction())
            {
                _repository.Update(cashOrder);

                transaction.Commit();
            }

            return cashOrder;
        }
        [HttpPost]
        public async Task<IActionResult> Export([FromBody] List<CashOrder> cashOrders)
        {
            using (var stream = _excelBuilder.Build(cashOrders))
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