using System;
using System.Collections.Generic;
using System.Linq;
using Dapper;
using Pawnshop.Core;
using Pawnshop.Core.Impl;
using Pawnshop.Core.Queries;
using Pawnshop.Data.Models.CashOrders;
using Pawnshop.Data.Models.Clients;
using Pawnshop.Data.Models.Contracts.Actions;
using Pawnshop.Data.Models.Dictionaries;
using Pawnshop.Data.Models.Membership;

namespace Pawnshop.Data.Access
{
    public class CashOrderRepository : RepositoryBase, IRepository<CashOrder>
    {
        public CashOrderRepository(IUnitOfWork unitOfWork) : base(unitOfWork)
        {
        }

        public void Insert(CashOrder entity)
        {
            using (var transaction = BeginTransaction())
            {
                entity.Id = UnitOfWork.Session.QuerySingleOrDefault<int>(@"
INSERT INTO CashOrders
( OrderType, OrderNumber, OrderDate, OrderCost, DebitAccountId, CreditAccountId, ClientId,
  UserId, ExpenseTypeId, Reason, Note, RegDate, OwnerId, BranchId, AuthorId, DeleteDate, ApprovedId, ApproveStatus, ApproveDate, ProveType )
VALUES ( @OrderType, @OrderNumber, @OrderDate, @OrderCost, @DebitAccountId, @CreditAccountId, @ClientId,
  @UserId, @ExpenseTypeId, @Reason, @Note, @RegDate, @OwnerId, @BranchId, @AuthorId, @DeleteDate, @ApprovedId, @ApproveStatus, @ApproveDate, @ProveType )
SELECT SCOPE_IDENTITY()", entity, UnitOfWork.Transaction);

                transaction.Commit();
            }
        }

        public void Update(CashOrder entity)
        {
            using (var transaction = BeginTransaction())
            {
                UnitOfWork.Session.Execute(@"
UPDATE CashOrders
SET OrderType = @OrderType, OrderNumber = @OrderNumber, OrderDate = @OrderDate, OrderCost = @OrderCost,
DebitAccountId = @DebitAccountId, CreditAccountId = @CreditAccountId, ClientId = @ClientId, UserId = @UserId,
ExpenseTypeId = @ExpenseTypeId, Reason = @Reason, Note = @Note, RegDate = @RegDate, OwnerId = @OwnerId, 
BranchId = @BranchId, AuthorId = @AuthorId, DeleteDate = @DeleteDate, ApprovedId=@ApprovedId, ApproveStatus=@ApproveStatus, 
ApproveDate=@ApproveDate, ProveType=@ProveType
WHERE Id = @Id", entity, UnitOfWork.Transaction);

                transaction.Commit();
            }
        }

        public void Delete(int id)
        {
            using (var transaction = BeginTransaction())
            {
                UnitOfWork.Session.Execute(@"
UPDATE CashOrders SET DeleteDate = dbo.GETASTANADATE() WHERE Id = @id",
                    new { id }, UnitOfWork.Transaction);

                transaction.Commit();
            }
        }

        public void UndoDelete(int id)
        {
            using (var transaction = BeginTransaction())
            {
                UnitOfWork.Session.Execute(@"
UPDATE CashOrders SET DeleteDate = NULL WHERE Id = @id",
                    new { id }, UnitOfWork.Transaction);

                transaction.Commit();
            }
        }

        public CashOrder Get(int id)
        {
            var entity = UnitOfWork.Session.Query<CashOrder, Client, User, Account, Account, User, Organization, CashOrder>(@"
SELECT co.*, c.*, u.*, da.*, ca.*, a.*, o.*
FROM CashOrders co
LEFT JOIN Clients c ON co.ClientId = c.Id
LEFT JOIN Users u ON co.UserId = u.Id
JOIN Accounts da ON co.DebitAccountId = da.Id
JOIN Accounts ca ON co.CreditAccountId = ca.Id
JOIN Users a ON co.AuthorId = a.Id
JOIN Members m ON a.Id = m.Id
JOIN Organizations o ON m.OrganizationId = o.Id
WHERE co.Id = @id",
                (co, c, u, da, ca, a, o) =>
                {
                    co.Client = c;
                    co.User = u;
                    co.DebitAccount = da;
                    co.CreditAccount = ca;
                    co.Author = a;
                    a.Organization = o;
                    return co;
                },
                new { id }, UnitOfWork.Transaction).FirstOrDefault();

            if (entity == null) return null;

            if (entity.ExpenseTypeId.HasValue)
            {
                entity.ExpenseType = UnitOfWork.Session.Query<ExpenseType, ExpenseGroup, ExpenseType>(@"
SELECT et.*, eg.*
FROM ExpenseTypes et
JOIN ExpenseGroups eg ON et.ExpenseGroupId = eg.Id
WHERE et.Id = @id", (et, eg) => { et.ExpenseGroup = eg; return et; }, new { id = entity.ExpenseTypeId.Value }).FirstOrDefault();
            }

            return entity;
        }

        public CashOrder Find(object query)
        {
            if (query == null) throw new ArgumentNullException(nameof(query));

            var contractId = query?.Val<int?>("ContractId");
            var actionType = query?.Val<ContractActionType?>("ActionType");
            if (!contractId.HasValue) throw new ArgumentNullException(nameof(contractId));
            if (!actionType.HasValue) throw new ArgumentNullException(nameof(actionType));

            return UnitOfWork.Session.Query<CashOrder, Client, User, Account, Account, User, Organization, CashOrder>(@"
SELECT TOP 1 co.*, c.*, u.*, da.*, ca.*, a.*, o.*
FROM ContractActionRows car
JOIN ContractActions cact ON car.ActionId = cact.Id AND cact.ContractId = @contractId AND cact.ActionType = @actionType AND cact.DeleteDate IS NULL
JOIN CashOrders co ON car.OrderId = co.Id
LEFT JOIN Clients c ON co.ClientId = c.Id
LEFT JOIN Users u ON co.UserId = u.Id
JOIN Accounts da ON co.DebitAccountId = da.Id
JOIN Accounts ca ON co.CreditAccountId = ca.Id
JOIN Users a ON co.AuthorId = a.Id
JOIN Members m ON a.Id = m.Id
JOIN Organizations o ON m.OrganizationId = o.Id",
                (co, c, u, da, ca, a, o) =>
                {
                    co.Client = c;
                    co.User = u;
                    co.DebitAccount = da;
                    co.CreditAccount = ca;
                    co.Author = a;
                    a.Organization = o;
                    return co;
                },
                new { contractId, actionType }).FirstOrDefault();
        }

        public List<CashOrder> List(ListQuery listQuery, object query = null)
        {
            if (listQuery == null) throw new ArgumentNullException(nameof(listQuery));

            var orderType = query?.Val<OrderType?>("OrderType");
            var beginDate = query?.Val<DateTime?>("BeginDate");
            var endDate = query?.Val<DateTime?>("EndDate");
            var clientId = query?.Val<int?>("ClientId");
            var userId = query?.Val<int?>("UserId");
            var accountId = query?.Val<int?>("AccountId");
            var orderNumber = query?.Val<int?>("OrderNumber");
            var isDelete = query?.Val<bool?>("IsDelete");
            var ownerId = query?.Val<int>("OwnerId");
            var isApproved = query?.Val<bool?>("IsApproved");

            var pre = isDelete.HasValue && isDelete.Value ? "co.DeleteDate IS NOT NULL" : "co.DeleteDate IS NULL";
            pre += orderType.HasValue ? " AND co.OrderType = @orderType" : string.Empty;
            pre += beginDate.HasValue ? " AND co.OrderDate >= @beginDate" : string.Empty;
            pre += endDate.HasValue ? " AND co.OrderDate <= @endDate" : string.Empty;
            pre += clientId.HasValue ? " AND co.ClientId = @clientId" : string.Empty;
            pre += userId.HasValue ? " AND co.UserId = @userId" : string.Empty;
            pre += accountId.HasValue
                ? " AND (co.DebitAccountId = @accountId OR co.CreditAccountId = @accountId)"
                : string.Empty;
            pre += orderNumber.HasValue ? " AND co.OrderNumber = @orderNumber" : string.Empty;
            pre += " AND (@ownerId = -1 OR co.OwnerId = @ownerId)";
            pre += isApproved.HasValue && isApproved.Value ? " AND ApproveStatus!=10" : " AND ApproveStatus=10";

            var condition = listQuery.Like(pre, "co.OrderNumber", "c.Fullname", "u.Fullname");
            var order = listQuery.Order("co.OrderDate DESC", new Sort
            {
                Name = "co.OrderNumber",
                Direction = SortDirection.Desc
            });
            var page = listQuery.Page();

            return UnitOfWork.Session.Query<CashOrder, Client, User, Account, Account, Group, User, CashOrder>($@"
WITH CashOrderPaged AS (
    SELECT co.Id
    FROM CashOrders co
    LEFT JOIN Clients c ON co.ClientId = c.Id
    LEFT JOIN Users u ON co.UserId = u.Id
    {condition} {order} {page}
)
SELECT co.*, c.*, u.*, da.*, ca.*, g.*, a.*
FROM CashOrderPaged cop
JOIN CashOrders co ON cop.Id = co.Id
LEFT JOIN Clients c ON co.ClientId = c.Id
LEFT JOIN Users u ON co.UserId = u.Id
JOIN Accounts da ON co.DebitAccountId = da.Id
JOIN Accounts ca ON co.CreditAccountId = ca.Id
JOIN Groups g ON co.BranchId = g.Id
JOIN Users a ON co.AuthorId = a.Id",
            (co, c, u, da, ca, g, a) =>
            {
                co.Client = c;
                co.User = u;
                co.DebitAccount = da;
                co.CreditAccount = ca;
                co.Branch = g;
                co.Author = a;
                return co;
            },
            new
            {
                orderType,
                beginDate,
                endDate,
                clientId,
                userId,
                orderNumber,
                accountId,
                ownerId,
                listQuery.Page?.Offset,
                listQuery.Page?.Limit,
                listQuery.Filter
            }).ToList();
        }

        public int Count(ListQuery listQuery, object query = null)
        {
            if (listQuery == null) throw new ArgumentNullException(nameof(listQuery));

            var orderType = query?.Val<OrderType?>("OrderType");
            var beginDate = query?.Val<DateTime?>("BeginDate");
            var endDate = query?.Val<DateTime?>("EndDate");
            var clientId = query?.Val<int?>("ClientId");
            var userId = query?.Val<int?>("UserId");
            var accountId = query?.Val<int?>("AccountId");
            var orderNumber = query?.Val<int?>("OrderNumber");
            var isDelete = query?.Val<bool?>("IsDelete");
            var ownerId = query?.Val<int>("OwnerId");
            var isApproved = query?.Val<bool?>("IsApproved");

            var pre = isDelete.HasValue && isDelete.Value ? "co.DeleteDate IS NOT NULL" : "co.DeleteDate IS NULL";
            pre += orderType.HasValue ? " AND co.OrderType = @orderType" : string.Empty;
            pre += beginDate.HasValue ? " AND co.OrderDate >= @beginDate" : string.Empty;
            pre += endDate.HasValue ? " AND co.OrderDate <= @endDate" : string.Empty;
            pre += clientId.HasValue ? " AND co.ClientId = @clientId" : string.Empty;
            pre += userId.HasValue ? " AND co.UserId = @userId" : string.Empty;
            pre += accountId.HasValue
                ? " AND (co.DebitAccountId = @accountId OR co.CreditAccountId = @accountId)"
                : string.Empty;
            pre += orderNumber.HasValue ? " AND co.OrderNumber = @orderNumber" : string.Empty;
            pre += " AND (@ownerId = -1 OR co.OwnerId = @ownerId)";
            pre += isApproved.HasValue && isApproved.Value ? " AND ApproveStatus!=10" : " AND ApproveStatus=10";


            var condition = listQuery.Like(pre, "co.OrderNumber", "c.Fullname", "u.Fullname");

            return UnitOfWork.Session.ExecuteScalar<int>($@"
SELECT COUNT(DISTINCT co.Id)
FROM CashOrders co
LEFT JOIN MemberRelations mr ON mr.RightMemberId = co.OwnerId
LEFT JOIN Clients c ON co.ClientId = c.Id
LEFT JOIN Users u ON co.UserId = u.Id
{condition}", new
            {
                orderType,
                beginDate,
                endDate,
                clientId,
                userId,
                orderNumber,
                accountId,
                ownerId,
                listQuery.Filter
            });
        }

        public int RelationCount(int id)
        {
            return UnitOfWork.Session.ExecuteScalar<int>(@"
SELECT SUM(OrderCounts.OrderCount)
FROM (
    SELECT COUNT(*) as OrderCount
    FROM Remittances
    WHERE SendOrderId = @id OR ReceiveOrderId = @id
    UNION ALL
    SELECT COUNT(*) as OrderCount
    FROM InsuranceActions
    WHERE OrderId = @id
    UNION ALL
    SELECT COUNT(*) as OrderCount
    FROM ContractActionRows
    WHERE OrderId = @id
) OrderCounts", new { id });
        }
    }
}