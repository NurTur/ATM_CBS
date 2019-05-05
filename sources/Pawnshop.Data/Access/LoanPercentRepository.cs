using System;
using System.Collections.Generic;
using System.Linq;
using Dapper;
using Pawnshop.Core;
using Pawnshop.Core.Impl;
using Pawnshop.Core.Queries;
using Pawnshop.Data.Models.Clients;
using Pawnshop.Data.Models.Contracts;
using Pawnshop.Data.Models.Dictionaries;
using Pawnshop.Data.Models.Membership;

namespace Pawnshop.Data.Access
{
    public class LoanPercentRepository : RepositoryBase, IRepository<LoanPercentSetting>
    {
        public LoanPercentRepository(IUnitOfWork unitOfWork) : base(unitOfWork)
        {
        }

        public void Insert(LoanPercentSetting entity)
        {
            using (var transaction = BeginTransaction())
            {
                entity.Id = UnitOfWork.Session.QuerySingleOrDefault<int>(@"
INSERT INTO LoanPercentSettings
( OrganizationId, BranchId, CollateralType, CardType, LoanCostFrom, LoanCostTo, LoanPeriod, MinLoanPeriod, LoanPercent, PenaltyPercent )
VALUES ( @OrganizationId, @BranchId, @CollateralType, @CardType, @LoanCostFrom, @LoanCostTo, @LoanPeriod, @MinLoanPeriod, @LoanPercent, @PenaltyPercent )
SELECT SCOPE_IDENTITY()", entity, UnitOfWork.Transaction);

                transaction.Commit();
            }
        }

        public void Update(LoanPercentSetting entity)
        {
            using (var transaction = BeginTransaction())
            {
                UnitOfWork.Session.Execute(@"
UPDATE LoanPercentSettings
SET OrganizationId = @OrganizationId, BranchId = @BranchId, CollateralType = @CollateralType, CardType = @CardType,
    LoanCostFrom = @LoanCostFrom, LoanCostTo = @LoanCostTo, LoanPeriod = @LoanPeriod,
    MinLoanPeriod = @MinLoanPeriod, LoanPercent = @LoanPercent, PenaltyPercent = @PenaltyPercent
WHERE Id = @Id", entity, UnitOfWork.Transaction);

                transaction.Commit();
            }
        }

        public void Delete(int id)
        {
            using (var transaction = BeginTransaction())
            {
                UnitOfWork.Session.Execute(@"DELETE FROM LoanPercentSettings WHERE Id = @id", new {id}, UnitOfWork.Transaction);
                transaction.Commit();
            }
        }

        public LoanPercentSetting Get(int id)
        {
            return UnitOfWork.Session.Query<LoanPercentSetting, Group, LoanPercentSetting>(@"
SELECT l.*, g.*
FROM LoanPercentSettings l
JOIN Groups g ON l.BranchId = g.Id
WHERE l.Id = @id", (l, g) => { l.Branch = g; return l; }, new {id}).FirstOrDefault();
        }

        public LoanPercentSetting Find(object query)
        {
            if (query == null) throw new ArgumentNullException(nameof(query));

            var branchId = query?.Val<int>("BranchId");
            var collateralType = query?.Val<CollateralType>("CollateralType");
            var cardType = query?.Val<CardType>("CardType");
            var loanCost = query?.Val<int>("LoanCost");
            var loanPeriod = query?.Val<int>("LoanPeriod");

            if (!branchId.HasValue) throw new ArgumentNullException(nameof(branchId));
            if (!collateralType.HasValue) throw new ArgumentNullException(nameof(collateralType));
            if (!cardType.HasValue) throw new ArgumentNullException(nameof(cardType));

            return UnitOfWork.Session.Query<LoanPercentSetting, Group, LoanPercentSetting>(@"
SELECT TOP 1 l.*, g.*
FROM LoanPercentSettings l
JOIN Groups g ON l.BranchId = g.Id
WHERE l.BranchId = @branchId
      AND (l.CollateralType = @collateralType OR l.CollateralType = 0)
      AND (l.CardType = @cardType OR l.CardType = 0)
      AND (@loanCost BETWEEN l.LoanCostFrom AND l.LoanCostTo)
      AND (l.LoanPeriod = @loanPeriod OR l.LoanPeriod = 0)
ORDER BY l.CollateralType DESC,
         l.CardType DESC,
         l.LoanCostFrom DESC,
         l.LoanCostTo DESC,
         l.LoanPeriod DESC",
                (l, g) => { l.Branch = g; return l; },
                new
                {
                    branchId,
                    collateralType,
                    cardType,
                    loanCost,
                    loanPeriod,
                }).FirstOrDefault();
        }

        public List<LoanPercentSetting> List(ListQuery listQuery, object query = null)
        {
            if (listQuery == null) throw new ArgumentNullException(nameof(listQuery));

            var organizationId = query?.Val<int?>("OrganizationId");
            if (!organizationId.HasValue) throw new ArgumentNullException(nameof(organizationId));

            var pre = "l.OrganizationId = @organizationId";
            var condition = listQuery.Like(pre, "g.DisplayName");
            var order = listQuery.Order(string.Empty, new Sort
            {
                Name = "l.CollateralType",
                Direction = SortDirection.Asc
            });
            var page = listQuery.Page();

            return UnitOfWork.Session.Query<LoanPercentSetting, Group, LoanPercentSetting>($@"
SELECT l.*, g.*
FROM LoanPercentSettings l
JOIN Groups g ON l.BranchId = g.Id
{condition} {order} {page}", 
            (l, g) => { l.Branch = g; return l; },
            new
            {
                organizationId,
                listQuery.Page?.Offset,
                listQuery.Page?.Limit,
                listQuery.Filter
            }).ToList();
        }

        public int Count(ListQuery listQuery, object query = null)
        {
            if (listQuery == null) throw new ArgumentNullException(nameof(listQuery));

            var organizationId = query?.Val<int?>("OrganizationId");
            if (!organizationId.HasValue) throw new ArgumentNullException(nameof(organizationId));

            var pre = "OrganizationId = @organizationId";
            var condition = listQuery.Like(pre, "g.DisplayName");

            return UnitOfWork.Session.ExecuteScalar<int>($@"
SELECT COUNT(*)
FROM LoanPercentSettings l
JOIN Groups g ON l.BranchId = g.Id
{condition}", new
            {
                organizationId,
                listQuery.Filter
            });
        }
    }
}