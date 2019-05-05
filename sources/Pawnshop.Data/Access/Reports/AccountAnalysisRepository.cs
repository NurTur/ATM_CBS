using System;
using System.Collections.Generic;
using System.Linq;
using Dapper;
using Pawnshop.Core;
using Pawnshop.Core.Impl;
using Pawnshop.Core.Queries;
using Pawnshop.Data.Models.CashOrders;
using Pawnshop.Data.Models.Clients;
using Pawnshop.Data.Models.Dictionaries;
using Pawnshop.Data.Models.Membership;

namespace Pawnshop.Data.Access.Reports
{
    public class AccountAnalysisRepository : RepositoryBase
    {
        public AccountAnalysisRepository(IUnitOfWork unitOfWork) : base(unitOfWork)
        {
        }

        public List<dynamic> List(object query = null)
        {
            var beginDate = query?.Val<DateTime?>("BeginDate");
            var endDate = query?.Val<DateTime?>("EndDate");
            var branchId = query?.Val<int>("BranchId");
            var accountId = query?.Val<int>("AccountId");
            
            if (!beginDate.HasValue) beginDate = DateTime.Now.Date;
            if (!endDate.HasValue) endDate = DateTime.Now.Date.AddHours(23).AddMinutes(59).AddSeconds(59);
            if (!branchId.HasValue) throw new ArgumentNullException(nameof(branchId));
            if (!accountId.HasValue) throw new ArgumentNullException(nameof(accountId));

            return UnitOfWork.Session.Query<dynamic>(@"
DECLARE @t TABLE (
    AccountId INT,
	AccountName NVARCHAR(MAX),
	AccountCode NVARCHAR(MAX),
	FromCredit BIGINT,
	ToDebit BIGINT
)

INSERT INTO @t (AccountId, AccountName, AccountCode, FromCredit)
SELECT
    da.Id as AccountId,
	da.Name as AccountName,
	da.Code as AccountCode,
	SUM(CAST(co.OrderCost as BIGINT)) as FromCredit
FROM CashOrders co
JOIN Accounts da ON co.DebitAccountId = da.Id
WHERE co.DeleteDate IS NULL
	AND co.BranchId = @branchId
	AND co.CreditAccountId = @accountId
	AND co.OrderDate BETWEEN @beginDate AND @endDate
	AND co.OrderType = 20
GROUP BY da.Id, da.Name, da.Code

INSERT INTO @t (AccountId, AccountName, AccountCode, ToDebit)
SELECT
    ca.Id as AccountId,
	ca.Name as AccountName,
	ca.Code as AccountCode,
	SUM(CAST(co.OrderCost as BIGINT)) as ToDebit
FROM CashOrders co
JOIN Accounts ca ON co.CreditAccountId = ca.Id
WHERE co.DeleteDate IS NULL
	AND co.BranchId = @branchId
	AND co.DebitAccountId = @accountId
	AND co.OrderDate BETWEEN @beginDate AND @endDate
	AND co.OrderType = 10
GROUP BY ca.Id, ca.Name, ca.Code

SELECT
    AccountId,
	AccountName,
	AccountCode,
	SUM(IIF(FromCredit IS NULL, 0, FromCredit)) as FromCredit,
	SUM(IIF(ToDebit IS NULL, 0, ToDebit)) as ToDebit
FROM @t
GROUP BY AccountId, AccountName, AccountCode
ORDER BY AccountCode", new
                {
                    beginDate,
                    endDate,
                    branchId,
                    accountId
                }).ToList();
        }

        public dynamic Group(object query = null)
        {
            var beginDate = query?.Val<DateTime?>("BeginDate");
            var endDate = query?.Val<DateTime?>("EndDate");
            var branchId = query?.Val<int>("BranchId");
            var accountId = query?.Val<int>("AccountId");
            
            if (!beginDate.HasValue) beginDate = DateTime.Now.Date;
            if (!endDate.HasValue) endDate = DateTime.Now.Date.AddHours(23).AddMinutes(59).AddSeconds(59);
            if (!branchId.HasValue) throw new ArgumentNullException(nameof(branchId));
            if (!accountId.HasValue) throw new ArgumentNullException(nameof(accountId));

            return UnitOfWork.Session.QuerySingleOrDefault<dynamic>(@"
DECLARE @DebitBeginPeriod BIGINT = 0;
DECLARE @CreditBeginPeriod BIGINT = 0;
DECLARE @DebitEndPeriod BIGINT = 0;
DECLARE @CreditEndPeriod BIGINT = 0;
DECLARE @CashBeginPeriod BIGINT = 0;
DECLARE @CashEndPeriod BIGINT = 0;

SELECT @DebitBeginPeriod = SUM(IIF(co.OrderDate < @beginDate, CAST(co.OrderCost as BIGINT), 0)),
    @DebitEndPeriod = SUM(CAST(co.OrderCost as BIGINT))
FROM CashOrders co
WHERE co.DeleteDate IS NULL
    AND co.BranchId = @branchId
    AND co.DebitAccountId = @accountId
    AND co.OrderDate < @endDate
    AND co.OrderType = 10

SELECT @CreditBeginPeriod = SUM(IIF(co.OrderDate < @beginDate, CAST(co.OrderCost as BIGINT), 0)),
    @CreditEndPeriod = SUM(CAST(co.OrderCost as BIGINT))
FROM CashOrders co
WHERE co.DeleteDate IS NULL
    AND co.BranchId = @branchId
    AND co.CreditAccountId = @accountId
    AND co.OrderDate < @endDate
    AND co.OrderType = 20

SET @CashBeginPeriod = IIF(@DebitBeginPeriod IS NULL, 0, @DebitBeginPeriod) - IIF(@CreditBeginPeriod IS NULL, 0, @CreditBeginPeriod);
SET @CashEndPeriod = IIF(@DebitEndPeriod IS NULL, 0, @DebitEndPeriod) - IIF(@CreditEndPeriod IS NULL, 0, @CreditEndPeriod);

SELECT @CashBeginPeriod as CashBeginPeriod, @CashEndPeriod as CashEndPeriod",
                new
                {
                    beginDate,
                    endDate,
                    branchId,
                    accountId
                });
        }

        public List<CashOrder> CashOrders(object query = null)
        {
            var beginDate = query?.Val<DateTime?>("BeginDate");
            var endDate = query?.Val<DateTime?>("EndDate");
            var debitAccountId = query?.Val<int?>("DebitAccountId");
            var creditAccountId = query?.Val<int?>("CreditAccountId");
            var branchId = query?.Val<int>("BranchId");

            if (!beginDate.HasValue) throw new ArgumentNullException(nameof(beginDate));
            if (!endDate.HasValue) throw new ArgumentNullException(nameof(endDate));
            if (!branchId.HasValue) throw new ArgumentNullException(nameof(branchId));

            var condition = @"
WHERE co.BranchId = @branchId
    AND co.OrderDate BETWEEN @beginDate AND @endDate";

            if (debitAccountId.HasValue) condition += " AND co.DebitAccountId = @debitAccountId";
            if (creditAccountId.HasValue) condition += " AND co.CreditAccountId = @creditAccountId";

            var order = "ORDER BY co.OrderDate";

            return UnitOfWork.Session.Query<CashOrder, Client, User, Account, Account, Group, User, CashOrder>($@"
SELECT co.*, c.*, u.*, da.*, ca.*, g.*, a.*
FROM CashOrders co
JOIN MemberRelations mr ON mr.RightMemberId = co.OwnerId
LEFT JOIN Clients c ON co.ClientId = c.Id
LEFT JOIN Users u ON co.UserId = u.Id
JOIN Accounts da ON co.DebitAccountId = da.Id
JOIN Accounts ca ON co.CreditAccountId = ca.Id
JOIN Groups g ON co.BranchId = g.Id
JOIN Users a ON co.AuthorId = a.Id
{condition} {order}",
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
                beginDate,
                endDate,
                branchId,
                debitAccountId,
                creditAccountId,
            }).ToList();
        }
    }
}