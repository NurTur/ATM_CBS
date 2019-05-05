using System;
using System.Collections.Generic;
using Dapper;
using Pawnshop.Core;
using Pawnshop.Core.Impl;
using Pawnshop.Core.Queries;
using Pawnshop.Data.Models.CashOrders;

namespace Pawnshop.Data.Access
{
    public class CashOrderNumberCounterRepository : RepositoryBase, IRepository<CashOrderNumberCounter>
    {
        public CashOrderNumberCounterRepository(IUnitOfWork unitOfWork) : base(unitOfWork)
        {
        }

        public void Insert(CashOrderNumberCounter entity)
        {
            throw new System.NotImplementedException();
        }

        public void Update(CashOrderNumberCounter entity)
        {
            using (var transaction = BeginTransaction())
            {
                UnitOfWork.Session.Execute(@"
IF NOT EXISTS (SELECT Id FROM CashOrderNumberCounters WHERE OrderType = @OrderType AND Year = @Year AND BranchId = @BranchId)
BEGIN
    INSERT INTO CashOrderNumberCounters ( OrderType, Year, BranchId, Counter )
    VALUES ( @OrderType, @Year, @BranchId, @Counter )
END
ELSE
BEGIN
    UPDATE CashOrderNumberCounters
    SET Counter = @Counter
    WHERE OrderType = @OrderType AND Year = @Year AND BranchId = @BranchId
END", entity, UnitOfWork.Transaction);

                transaction.Commit();
            }
        }

        public void Delete(int id)
        {
            throw new System.NotImplementedException();
        }

        public CashOrderNumberCounter Get(int id)
        {
            throw new System.NotImplementedException();
        }

        public CashOrderNumberCounter Find(object query)
        {
            if (query == null) throw new ArgumentNullException(nameof(query));

            var orderType = query.Val<OrderType?>("OrderType");
            var year = query.Val<int?>("Year");
            var branchId = query.Val<int>("BranchId");
            var condition = "WHERE OrderType = @OrderType AND Year = @year AND BranchId = @branchId";

            return UnitOfWork.Session.QuerySingleOrDefault<CashOrderNumberCounter>($@"
SELECT *
FROM CashOrderNumberCounters
{condition}", new
            {
                orderType,
                year,
                branchId
            }, UnitOfWork.Transaction);
        }

        public string Next(OrderType orderType, int year, int branch, string code)
        {
            var counter = Find(new
            {
                OrderType = orderType,
                Year = year,
                BranchId = branch
            }) ?? new CashOrderNumberCounter
            {
                OrderType = orderType,
                Year = year,
                BranchId = branch,
                Counter = 0,
            };
            counter.Counter++;
            Update(counter);

            return $"{counter.Year.ToString().Substring(2, 2)}{code}{counter.Counter:D4}";
        }

        public List<CashOrderNumberCounter> List(ListQuery listQuery, object query = null)
        {
            throw new System.NotImplementedException();
        }

        public int Count(ListQuery listQuery, object query = null)
        {
            throw new System.NotImplementedException();
        }
    }
}