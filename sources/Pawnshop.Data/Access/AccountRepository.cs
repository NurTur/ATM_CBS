using System;
using System.Collections.Generic;
using System.Linq;
using Dapper;
using Pawnshop.Core;
using Pawnshop.Core.Impl;
using Pawnshop.Core.Queries;
using Pawnshop.Data.Models.Contracts;
using Pawnshop.Data.Models.Dictionaries;

namespace Pawnshop.Data.Access
{
    public class AccountRepository : RepositoryBase, IRepository<Account>
    {
        public AccountRepository(IUnitOfWork unitOfWork) : base(unitOfWork)
        {
        }

        public void Insert(Account entity)
        {
            using (var transaction = BeginTransaction())
            {
                entity.Id = UnitOfWork.Session.QuerySingleOrDefault<int>(@"
INSERT INTO Accounts ( Code, Name )
VALUES ( @Code, @Name )
SELECT SCOPE_IDENTITY()", entity, UnitOfWork.Transaction);

                transaction.Commit();
            }
        }

        public void Update(Account entity)
        {
            using (var transaction = BeginTransaction())
            {
                UnitOfWork.Session.Execute(@"
UPDATE Accounts
SET Code = @Code, Name = @Name
WHERE Id = @Id", entity, UnitOfWork.Transaction);

                transaction.Commit();
            }
        }

        public void Delete(int id)
        {
            using (var transaction = BeginTransaction())
            {
                UnitOfWork.Session.Execute(@"DELETE FROM Accounts WHERE Id = @id", new {id}, UnitOfWork.Transaction);
                transaction.Commit();
            }
        }

        public Account Get(int id)
        {
            return UnitOfWork.Session.QuerySingleOrDefault<Account>(@"
SELECT *
FROM Accounts
WHERE Id = @id", new {id});
        }

        public Account Find(object query)
        {
            throw new System.NotImplementedException();
        }

        public List<Account> List(ListQuery listQuery, object query = null)
        {
            if (listQuery == null) throw new ArgumentNullException(nameof(listQuery));

            var condition = listQuery.Like(string.Empty, "Code");
            var order = listQuery.Order(string.Empty, new Sort
            {
                Name = "Code",
                Direction = SortDirection.Asc
            });
            var page = listQuery.Page();

            return UnitOfWork.Session.Query<Account>($@"
SELECT *
FROM Accounts
{condition} {order} {page}", new
            {
                listQuery.Page?.Offset,
                listQuery.Page?.Limit,
                listQuery.Filter
            }).ToList();
        }

        public int Count(ListQuery listQuery, object query = null)
        {
            if (listQuery == null) throw new ArgumentNullException(nameof(listQuery));

            var condition = listQuery.Like(string.Empty, "Code");

            return UnitOfWork.Session.ExecuteScalar<int>($@"
SELECT COUNT(*)
FROM Accounts
{condition}", new
            {
                listQuery.Filter
            });
        }

        public int RelationCount(int accountId)
        {
            return UnitOfWork.Session.ExecuteScalar<int>(@"
SELECT SUM(AccountCounts.AccountCount)
FROM (
    SELECT COUNT(*) as AccountCount
    FROM ContractActionRows
    WHERE DebitAccountId = @accountId OR CreditAccountId = @accountId
    UNION ALL
    SELECT COUNT(*) as AccountCount
    FROM CashOrders
    WHERE DebitAccountId = @accountId OR CreditAccountId = @accountId
) AccountCounts", new { accountId });
        }
    }
}