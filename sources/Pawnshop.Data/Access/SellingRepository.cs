using System;
using System.Collections.Generic;
using System.Linq;
using Dapper;
using Pawnshop.Core;
using Pawnshop.Core.Impl;
using Pawnshop.Core.Queries;
using Pawnshop.Data.Models.Contracts;
using Pawnshop.Data.Models.Dictionaries;
using Pawnshop.Data.Models.Membership;
using Pawnshop.Data.Models.Sellings;

namespace Pawnshop.Data.Access
{
    public class SellingRepository : RepositoryBase, IRepository<Selling>
    {
        public SellingRepository(IUnitOfWork unitOfWork) : base(unitOfWork)
        {
        }

        public void Insert(Selling entity)
        {
            using (var transaction = BeginTransaction())
            {
                entity.Id = UnitOfWork.Session.QuerySingleOrDefault<int>(@"
INSERT INTO Sellings
( CollateralType, CreateDate, ContractId, ContractPositionId, PositionId, PriceCost, Note, PositionSpecific,
SellingCost, SellingDate, CashOrderId, Status, OwnerId, BranchId, AuthorId, DeleteDate )
VALUES ( @CollateralType, @CreateDate, @ContractId, @ContractPositionId, @PositionId, @PriceCost, @Note, @PositionSpecific,
@SellingCost, @SellingDate, @CashOrderId, @Status, @OwnerId, @BranchId, @AuthorId, @DeleteDate )
SELECT SCOPE_IDENTITY()", entity, UnitOfWork.Transaction);

                transaction.Commit();
            }
        }

        public void Update(Selling entity)
        {
            using (var transaction = BeginTransaction())
            {
                UnitOfWork.Session.Execute(@"
UPDATE Sellings
SET CollateralType = @CollateralType, CreateDate = @CreateDate, ContractId = @ContractId, ContractPositionId = @ContractPositionId,
PositionId = @PositionId, PriceCost = @PriceCost, Note = @Note, PositionSpecific = @PositionSpecific,
SellingCost = @SellingCost, SellingDate = @SellingDate, CashOrderId = @CashOrderId, Status = @Status,
OwnerId = @OwnerId, BranchId = @BranchId, AuthorId = @AuthorId, DeleteDate = @DeleteDate
WHERE Id = @Id", entity, UnitOfWork.Transaction);

                transaction.Commit();
            }
        }

        public void Delete(int id)
        {
            using (var transaction = BeginTransaction())
            {
                UnitOfWork.Session.Execute(@"UPDATE Sellings SET DeleteDate = dbo.GETASTANADATE() WHERE Id = @id", new {id}, UnitOfWork.Transaction);
                transaction.Commit();
            }
        }

        public Selling Get(int id)
        {
            return UnitOfWork.Session.QuerySingleOrDefault<Selling>(@"
SELECT *
FROM Sellings
WHERE Id = @id", new { id });
        }

        public Selling Find(object query)
        {
            var contractPositionId = query?.Val<int>("ContractPositionId");
            var pre = "Sellings.DeleteDate IS NULL";
            pre += contractPositionId.HasValue ? " AND Sellings.ContractPositionId = @contractPositionId" : string.Empty;

            return UnitOfWork.Session.QueryFirstOrDefault<Selling>($@"
SELECT *
FROM Sellings
WHERE {pre}", new { contractPositionId }, UnitOfWork.Transaction);
        }

        public List<Selling> List(ListQuery listQuery, object query = null)
        {
            if (listQuery == null) throw new ArgumentNullException(nameof(listQuery));

            var beginDate = query?.Val<DateTime?>("BeginDate");
            var endDate = query?.Val<DateTime?>("EndDate");
            var collateralType = query?.Val<CollateralType?>("CollateralType");
            var status = query?.Val<SellingStatus?>("Status");
            var ownerId = query?.Val<int>("OwnerId");

            var pre = "Sellings.DeleteDate IS NULL";
            pre += beginDate.HasValue ? " AND Sellings.CreateDate >= @beginDate" : string.Empty;
            pre += endDate.HasValue ? " AND Sellings.CreateDate <= @endDate" : string.Empty;
            pre += collateralType.HasValue ? " AND Sellings.CollateralType = @collateralType" : string.Empty;
            pre += status.HasValue ? " AND Sellings.Status = @status" : string.Empty;
            pre += " AND MemberRelations.LeftMemberId = @ownerId";

            var condition = listQuery.Like(pre, "Positions.Name");
            var order = listQuery.Order(string.Empty, new Sort
            {
                Name = "Sellings.CreateDate",
                Direction = SortDirection.Desc
            });
            var page = listQuery.Page();

            return UnitOfWork.Session.Query<Selling, Position, Group, User, Selling>($@"
SELECT Sellings.*, Positions.*, Groups.*, Users.* FROM (
SELECT DISTINCT Sellings.*
FROM Sellings
JOIN Positions ON Sellings.PositionId = Positions.Id
JOIN MemberRelations ON MemberRelations.RightMemberId = Sellings.OwnerId
{condition}
) as Sellings
JOIN Positions ON Sellings.PositionId = Positions.Id
JOIN Groups ON Sellings.BranchId = Groups.Id
JOIN Users ON Sellings.AuthorId = Users.Id
{order} {page}",
                (s, p, g, u) =>
                {
                    s.Position = p;
                    s.Branch = g;
                    s.Author = u;
                    return s;
                },
                new
                {
                    beginDate,
                    endDate,
                    collateralType,
                    status,
                    ownerId,
                    listQuery.Page?.Offset,
                    listQuery.Page?.Limit,
                    listQuery.Filter
                }).ToList();
        }

        public int Count(ListQuery listQuery, object query = null)
        {
            if (listQuery == null) throw new ArgumentNullException(nameof(listQuery));

            var beginDate = query?.Val<DateTime?>("BeginDate");
            var endDate = query?.Val<DateTime?>("EndDate");
            var collateralType = query?.Val<CollateralType?>("CollateralType");
            var status = query?.Val<SellingStatus?>("Status");
            var ownerId = query?.Val<int>("OwnerId");

            var pre = "Sellings.DeleteDate IS NULL";
            pre += beginDate.HasValue ? " AND Sellings.CreateDate >= @beginDate" : string.Empty;
            pre += endDate.HasValue ? " AND Sellings.CreateDate <= @endDate" : string.Empty;
            pre += collateralType.HasValue ? " AND Sellings.CollateralType = @collateralType" : string.Empty;
            pre += status.HasValue ? " AND Sellings.Status = @status" : string.Empty;
            pre += " AND MemberRelations.LeftMemberId = @ownerId";

            var condition = listQuery.Like(pre, "Positions.Name");

            return UnitOfWork.Session.ExecuteScalar<int>($@"
SELECT COUNT(DISTINCT Sellings.Id)
FROM Sellings
JOIN MemberRelations ON MemberRelations.RightMemberId = Sellings.OwnerId
JOIN Positions ON Sellings.PositionId = Positions.Id
{condition}", new
            {
                beginDate,
                endDate,
                collateralType,
                status,
                ownerId,
                listQuery.Filter
            });
        }
    }
}