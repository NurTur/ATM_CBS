using System;
using System.Collections.Generic;
using System.Linq;
using Dapper;
using Pawnshop.Core;
using Pawnshop.Core.Impl;
using Pawnshop.Core.Queries;
using Pawnshop.Data.Models.Contracts;
using Pawnshop.Data.Models.Contracts.Actions;
using Pawnshop.Data.Models.Dictionaries;
using Pawnshop.Data.Models.Files;
using Pawnshop.Data.Models.Membership;

namespace Pawnshop.Data.Access
{
    public class ContractRepository : RepositoryBase, IRepository<Contract>
    {
        public ContractRepository(IUnitOfWork unitOfWork) : base(unitOfWork)
        {
        }

        public void Insert(Contract entity)
        {
            using (var transaction = BeginTransaction())
            {
                entity.Id = UnitOfWork.Session.QuerySingleOrDefault<int>(@"
INSERT INTO Contracts
( ClientId, ContractNumber, ContractDate, CollateralType, PercentPaymentType, MaturityDate, OriginalMaturityDate, EstimatedCost,
LoanCost, LoanPeriod, LoanPercent, LoanPercentCost, Note, ContractData, ContractSpecific, OwnerId, Status,
ProlongDate, TransferDate, PenaltyPercent, PenaltyPercentCost, BranchId, AuthorId, Locked )
VALUES ( @ClientId, @ContractNumber, @ContractDate, @CollateralType, @PercentPaymentType, @MaturityDate, @OriginalMaturityDate, @EstimatedCost,
@LoanCost, @LoanPeriod, @LoanPercent, @LoanPercentCost, @Note, @ContractData, @ContractSpecific, @OwnerId, @Status,
@ProlongDate, @TransferDate, @PenaltyPercent, @PenaltyPercentCost, @BranchId, @AuthorId, @Locked )
SELECT SCOPE_IDENTITY()", entity, UnitOfWork.Transaction);

                foreach (var position in entity.Positions)
                {
                    position.ContractId = entity.Id;
                    UnitOfWork.Session.Execute(@"
INSERT INTO ContractPositions
( ContractId, PositionId, PositionCount, LoanCost, CategoryId, Note, PositionSpecific, EstimatedCost )
VALUES ( @ContractId, @PositionId, @PositionCount, @LoanCost, @CategoryId, @Note, @PositionSpecific, @EstimatedCost )",
                    position, UnitOfWork.Transaction);
                }

                transaction.Commit();
            }
        }

        public void Update(Contract entity)
        {
            using (var transaction = BeginTransaction())
            {
                UnitOfWork.Session.Execute(@"
UPDATE Contracts
SET ClientId = @ClientId, ContractDate = @ContractDate, CollateralType = @CollateralType,
PercentPaymentType = @PercentPaymentType, MaturityDate = @MaturityDate, OriginalMaturityDate = @OriginalMaturityDate, EstimatedCost = @EstimatedCost,
LoanCost = @LoanCost, LoanPeriod = @LoanPeriod, LoanPercent = @LoanPercent, LoanPercentCost = @LoanPercentCost,
Note = @Note, ContractData = @ContractData, ContractSpecific = @ContractSpecific, OwnerId = @OwnerId,
Status = @Status, ProlongDate = @ProlongDate, TransferDate = @TransferDate, PenaltyPercent = @PenaltyPercent, 
PenaltyPercentCost = @PenaltyPercentCost, BranchId = @BranchId, AuthorId = @AuthorId, Locked = @Locked
WHERE Id = @Id", entity, UnitOfWork.Transaction);

                UpdatePositions(entity.Id, entity.Positions.ToArray());

                transaction.Commit();
            }
        }

        public void UpdatePositions(int contractId, ContractPosition[] positions)
        {
            var positionIds = positions.Select(p => p.Id).ToList();
            positionIds.Add(0);
            UnitOfWork.Session.Execute(@"
DELETE FROM ContractPositions WHERE ContractId = @contractId AND Id NOT IN @positionIds",
                new { contractId = contractId, positionIds = positionIds.ToArray() }, UnitOfWork.Transaction);

            foreach (var position in positions)
            {
                position.ContractId = contractId;
                position.Id = UnitOfWork.Session.ExecuteScalar<int>(@"
IF NOT EXISTS (SELECT Id FROM ContractPositions WHERE Id = @Id)
BEGIN
    INSERT INTO ContractPositions
    ( ContractId, PositionId, PositionCount, LoanCost, CategoryId, Note, PositionSpecific, EstimatedCost )
    VALUES ( @ContractId, @PositionId, @PositionCount, @LoanCost, @CategoryId, @Note, @PositionSpecific, @EstimatedCost )
    SELECT SCOPE_IDENTITY()
END
ELSE
BEGIN
    UPDATE ContractPositions
    SET ContractId = @ContractId, PositionId = @PositionId, PositionCount = @PositionCount,
    LoanCost = @LoanCost, CategoryId = @CategoryId, Note = @Note, PositionSpecific = @PositionSpecific, EstimatedCost = @EstimatedCost
    WHERE Id = @Id
    SELECT @Id
END", position, UnitOfWork.Transaction);
            }
        }

        public void Delete(int id)
        {
            using (var transaction = BeginTransaction())
            {
                UnitOfWork.Session.Execute(@"
UPDATE Contracts SET DeleteDate = dbo.GETASTANADATE() WHERE Id = @id",
                    new { id }, UnitOfWork.Transaction);

                UnitOfWork.Session.Execute(@"
UPDATE ContractPositions SET DeleteDate = dbo.GETASTANADATE() WHERE ContractId = @id",
                    new { id }, UnitOfWork.Transaction);

                transaction.Commit();
            }
        }

        public void UndoDelete(int id)
        {
            using (var transaction = BeginTransaction())
            {
                UnitOfWork.Session.Execute(@"
UPDATE Contracts SET DeleteDate = NULL WHERE Id = @id",
                    new { id }, UnitOfWork.Transaction);

                UnitOfWork.Session.Execute(@"
UPDATE ContractPositions SET DeleteDate = NULL WHERE ContractId = @id",
                    new { id }, UnitOfWork.Transaction);

                transaction.Commit();
            }
        }
        
        public Contract Get(int id)
        {
            var entity = UnitOfWork.Session.Query<Contract, Group, User, Contract>(@"
SELECT *
FROM Contracts
JOIN Groups ON Contracts.BranchId = Groups.Id
JOIN Users ON Contracts.AuthorId = Users.Id
WHERE Contracts.Id = @id",
                (c, g, u) =>
                {
                    c.Branch = g;
                    c.Author = u;
                    return c;
                },
                new { id }, UnitOfWork.Transaction).FirstOrDefault();

            if (entity.CollateralType == CollateralType.Car)
            {
                entity.Positions = UnitOfWork.Session.Query<ContractPosition, Car, Category, ContractPosition>(@"
SELECT
    ContractPositions.*,
    Cars.Id,
    Positions.Name,
    Positions.CollateralType,
    Cars.Mark,
    Cars.Model,
    Cars.ReleaseYear,
    Cars.TransportNumber,
    Cars.MotorNumber,
    Cars.BodyNumber,
    Cars.TechPassportNumber,
    Cars.TechPassportDate,
    Cars.Color,
    Categories.*
FROM ContractPositions
JOIN Positions ON Positions.Id = ContractPositions.PositionId
JOIN Cars ON Cars.Id = ContractPositions.PositionId
JOIN Categories ON ContractPositions.CategoryId = Categories.Id
WHERE ContractId = @id", (cp, p, c) =>
                {
                    cp.Position = p;
                    cp.Category = c;
                    return cp;
                }, new { id }, UnitOfWork.Transaction).ToList();
            }
            else if (entity.CollateralType == CollateralType.Machinery)
            {
                entity.Positions = UnitOfWork.Session.Query<ContractPosition, Machinery, Category, ContractPosition>(@"
SELECT
    ContractPositions.*,
    Machineries.Id,
    Positions.Name,
    Positions.CollateralType,
    Machineries.Mark,
    Machineries.Model,
    Machineries.ReleaseYear,
    Machineries.TransportNumber,
    Machineries.MotorNumber,
    Machineries.BodyNumber,
    Machineries.TechPassportNumber,
    Machineries.TechPassportDate,
    Machineries.Color,
    Categories.*
FROM ContractPositions
JOIN Positions ON Positions.Id = ContractPositions.PositionId
JOIN Machineries ON Machineries.Id = ContractPositions.PositionId
JOIN Categories ON ContractPositions.CategoryId = Categories.Id
WHERE ContractId = @id", (cp, p, c) =>
                {
                    cp.Position = p;
                    cp.Category = c;
                    return cp;
                }, new { id }, UnitOfWork.Transaction).ToList();
            }
            else
            {
                entity.Positions = UnitOfWork.Session.Query<ContractPosition, Position, Category, ContractPosition>(@"
SELECT *
FROM ContractPositions
JOIN Positions ON Positions.Id = ContractPositions.PositionId
JOIN Categories ON ContractPositions.CategoryId = Categories.Id
WHERE ContractId = @id", (cp, p, c) =>
                {
                    cp.Position = p;
                    cp.Category = c;
                    return cp;
                }, new { id }, UnitOfWork.Transaction).ToList();
            }

            entity.Files = UnitOfWork.Session.Query<FileRow>(@"
SELECT FileRows.*
  FROM ContractFileRows
  JOIN FileRows ON ContractFileRows.FileRowId = FileRows.Id
 WHERE ContractFileRows.ContractId = @id", new { id }, UnitOfWork.Transaction).ToList();

            entity.Actions = UnitOfWork.Session.Query<ContractAction>(@"
SELECT *
FROM ContractActions
WHERE ContractId = @id AND DeleteDate IS NULL
ORDER BY Date", new { id }, UnitOfWork.Transaction).ToList();
            foreach (var action in entity.Actions)
            {
                action.Rows = UnitOfWork.Session.Query<ContractActionRow>(@"
SELECT *
FROM ContractActionRows
WHERE ActionId = @id", new { id = action.Id }, UnitOfWork.Transaction).ToArray();
            }

            return entity;
        }

        public Contract Find(object query)
        {
            if (query == null) throw new ArgumentNullException(nameof(query));

            var positionId = query?.Val<int?>("PositionId");
            var collateralType = query?.Val<CollateralType?>("CollateralType");
            var status = query?.Val<ContractStatus?>("Status");

            var condition = @"
WHERE cp.DeleteDate IS NULL
    AND c.DeleteDate IS NULL
    AND cp.PositionId = @positionId
    AND c.CollateralType = @collateralType
    AND c.Status = @status";

            return UnitOfWork.Session.QuerySingleOrDefault<Contract>($@"
SELECT TOP 1 c.*
FROM ContractPositions cp
JOIN Contracts c ON cp.ContractId = c.Id
{condition}", new
            {
                positionId,
                collateralType,
                status
            }, UnitOfWork.Transaction);
        }

        public dynamic Find(string contractNumber, string identityNumber)
        {
            if (string.IsNullOrWhiteSpace(contractNumber)) throw new ArgumentNullException(nameof(contractNumber));
            if (string.IsNullOrWhiteSpace(identityNumber)) throw new ArgumentNullException(nameof(identityNumber));

            return UnitOfWork.Session.Query<dynamic>(@"
DECLARE @ContractId INT
DECLARE @ContractDate DATETIME
DECLARE @MaturityDate DATETIME
DECLARE @PercentPaymentType INT
DECLARE @LoanCost INT
DECLARE @PaymentCost INT

SELECT TOP 1 
    @ContractId = c.Id, 
    @ContractDate = c.ContractDate, 
    @MaturityDate = c.MaturityDate,
    @PercentPaymentType = c.PercentPaymentType,
    @LoanCost = c.LoanCost
FROM Contracts c
WHERE c.ContractNumber = @ContractNumber
    AND JSON_VALUE(c.ContractData, '$.Client.IdentityNumber') = @IdentityNumber

IF @ContractId IS NOT NULL
BEGIN
    IF @PercentPaymentType IN (30, 31)
    BEGIN
        DECLARE @Year INT = DATEPART(YEAR, dbo.GETASTANADATE())
        DECLARE @Month INT = DATEPART(MONTH, dbo.GETASTANADATE())
        DECLARE @Day INT = DATEPART(DAY, dbo.GETASTANADATE())

        DECLARE @ContractDay INT = DATEPART(DAY, @ContractDate)

        IF @ContractDay < @Day SET @Month = @Month + 1
        
        SET @MaturityDate = DATEFROMPARTS(@Year, @Month, @ContractDay)

        SELECT @PaymentCost=sum(co.OrderCost)
        FROM ContractActions ca
        JOIN ContractActionRows cra ON cra.ActionId=ca.id
		JOIN CashOrders co ON co.id=cra.OrderId
		WHERE ca.ContractId=@ContractId
			AND ca.DeleteDate IS NULL
			AND cra.PaymentType=10
			AND ca.ActionType!=50
			AND co.OrderType=10
    END

    SET @PaymentCost = ISNULL(@PaymentCost, 0)

    SELECT 
        @ContractId as ContractId, 
        @ContractNumber as ContractNumber, 
        @ContractDate as ContractDate, 
        @MaturityDate as MaturityDate, 
        @PercentPaymentType as PercentPaymentType,
        @LoanCost as LoanCost,
        @LoanCost - @PaymentCost as BalanceCost
END
ELSE
BEGIN
    SELECT TOP 0
        @ContractId as ContractId, 
        @ContractNumber as ContractNumber, 
        @ContractDate as ContractDate, 
        @MaturityDate as MaturityDate, 
        @PercentPaymentType as PercentPaymentType,
        @LoanCost as LoanCost,
        @LoanCost - @PaymentCost as BalanceCost
END", new { ContractNumber = contractNumber, IdentityNumber = identityNumber }).FirstOrDefault();
        }

        public List<Contract> List(ListQuery listQuery, object query = null)
        {
            if (listQuery == null) throw new ArgumentNullException(nameof(listQuery));

            var beginDate = query?.Val<DateTime?>("BeginDate");
            var endDate = query?.Val<DateTime?>("EndDate");
            var collateralType = query?.Val<CollateralType?>("CollateralType");
            var displayStatus = query?.Val<ContractDisplayStatus?>("DisplayStatus");
            var clientId = query?.Val<int?>("ClientId");
            var ownerIds = query?.Val<int[]>("OwnerIds");
            var isTransferred = query?.Val<bool?>("IsTransferred");
            var identityNumber = query?.Val<Int64?>("IdentityNumber");

            var pre = displayStatus.HasValue && displayStatus.Value == ContractDisplayStatus.Deleted ? "c.DeleteDate IS NOT NULL" : "c.DeleteDate IS NULL";

            if (identityNumber.HasValue)
            {
                pre += " AND JSON_VALUE(c.ContractData, '$.Client.IdentityNumber') = CAST(@identityNumber AS NVARCHAR(MAX))";
            }
            else
            {
                pre += ownerIds != null && ownerIds.Length > 0 ? " AND mr.LeftMemberId IN @ownerIds" : string.Empty;
                
            }

            pre += collateralType.HasValue ? " AND c.CollateralType = @collateralType" : string.Empty;
            pre += clientId.HasValue ? " AND c.ClientId = @clientId" : string.Empty;

            if (isTransferred.HasValue && isTransferred.Value) pre += " AND c.TransferDate IS NOT NULL";
            else pre += " AND c.TransferDate IS NULL";

            var from = "FROM Contracts c";
            if (displayStatus.HasValue)
            {
                switch (displayStatus)
                {
                    case ContractDisplayStatus.New:
                        pre += " AND c.Status = 0";
                        pre += beginDate.HasValue ? " AND c.ContractDate >= @beginDate" : string.Empty;
                        pre += endDate.HasValue ? " AND c.ContractDate <= @endDate" : string.Empty;
                        break;
                    case ContractDisplayStatus.Open:
                        pre += " AND c.Status = 30 AND c.MaturityDate >= CONVERT(DATE, dbo.GETASTANADATE()) AND c.ProlongDate IS NULL";
                        pre += beginDate.HasValue ? " AND c.ContractDate >= @beginDate" : string.Empty;
                        pre += endDate.HasValue ? " AND c.ContractDate <= @endDate" : string.Empty;
                        break;
                    case ContractDisplayStatus.Overdue:
                        pre += " AND c.Status = 30 AND c.MaturityDate < CONVERT(DATE, dbo.GETASTANADATE())";
                        pre += beginDate.HasValue ? " AND c.ContractDate >= @beginDate" : string.Empty;
                        pre += endDate.HasValue ? " AND c.ContractDate <= @endDate" : string.Empty;
                        break;
                    case ContractDisplayStatus.Prolong:
                        pre += " AND c.Status = 30 AND c.MaturityDate >= CONVERT(DATE, dbo.GETASTANADATE()) AND c.ProlongDate IS NOT NULL";
                        pre += " AND ca.ActionType = 10";
                        pre += beginDate.HasValue ? " AND ca.[Date] >= @beginDate" : string.Empty;
                        pre += endDate.HasValue ? " AND ca.[Date] <= @endDate" : string.Empty;
                        from = "FROM ContractActions ca JOIN Contracts c ON ca.ContractId = c.Id";
                        break;
                    case ContractDisplayStatus.BoughtOut:
                        pre += " AND c.Status = 40";
                        pre += " AND ca.ActionType IN (20, 30, 40)";
                        pre += beginDate.HasValue ? " AND ca.[Date] >= @beginDate" : string.Empty;
                        pre += endDate.HasValue ? " AND ca.[Date] <= @endDate" : string.Empty;
                        from = "FROM ContractActions ca JOIN Contracts c ON ca.ContractId = c.Id";
                        break;
                    case ContractDisplayStatus.SoldOut:
                        pre += " AND c.Status = 50";
                        pre += " AND ca.ActionType = 60";
                        pre += beginDate.HasValue ? " AND ca.[Date] >= @beginDate" : string.Empty;
                        pre += endDate.HasValue ? " AND ca.[Date] <= @endDate" : string.Empty;
                        from = "FROM ContractActions ca JOIN Contracts c ON ca.ContractId = c.Id";
                        break;
                    case ContractDisplayStatus.Signed:
                        pre += " AND c.Status = 30";
                        pre += beginDate.HasValue ? " AND c.ContractDate >= @beginDate" : string.Empty;
                        pre += endDate.HasValue ? " AND c.ContractDate <= @endDate" : string.Empty;
                        break;
                    default:
                        break;
                }
            }
            else
            {
                pre += beginDate.HasValue ? " AND c.ContractDate >= @beginDate" : string.Empty;
                pre += endDate.HasValue ? " AND c.ContractDate <= @endDate" : string.Empty;
            }

            var condition = listQuery.Like(pre, "c.ContractNumber", "JSON_VALUE(c.ContractData, '$.Client.Fullname')", "JSON_VALUE(c.ContractData, '$.Client.IdentityNumber')", "JSON_VALUE(c.ContractData, '$.Client.MobilePhone')");
            var order = listQuery.Order("c.ContractDate DESC", new Sort
            {
                Name = "c.ContractNumber",
                Direction = SortDirection.Desc
            });
            var page = listQuery.Page();

            return UnitOfWork.Session.Query<Contract, Group, User, Contract>($@"
WITH ContractPaged AS (
    SELECT DISTINCT c.Id,c.ContractNumber,c.ContractDate
    {from}
    JOIN MemberRelations mr ON mr.RightMemberId = c.OwnerId
    {condition} {order} {page}
)
SELECT DISTINCT c.*,
    (CASE 
        WHEN c.DeleteDate IS NOT NULL THEN 60
        WHEN c.Status = 0 THEN 0
        WHEN c.Status = 30 AND c.MaturityDate >= CONVERT(DATE, dbo.GETASTANADATE()) AND c.ProlongDate IS NULL THEN 10
        WHEN c.Status = 30 AND c.MaturityDate < CONVERT(DATE, dbo.GETASTANADATE()) THEN 20
        WHEN c.Status = 30 AND c.MaturityDate >= CONVERT(DATE, dbo.GETASTANADATE()) AND c.ProlongDate IS NOT NULL THEN 30
        WHEN c.Status = 40 THEN 40
        WHEN c.Status = 50 THEN 50
        ELSE 0
    END) AS DisplayStatus,
    g.*,
    u.*
FROM ContractPaged cp
JOIN Contracts c ON cp.Id = c.Id
JOIN Groups g ON c.BranchId = g.Id
JOIN Users u ON c.AuthorId = u.Id
{order}",
                (c, g, u) =>
                {
                    c.Branch = g;
                    c.Author = u;
                    return c;
                },
                new
                {
                    beginDate,
                    endDate,
                    collateralType,
                    clientId,
                    ownerIds,
                    identityNumber,
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
            var displayStatus = query?.Val<ContractDisplayStatus?>("DisplayStatus");
            var clientId = query?.Val<int?>("ClientId");
            var ownerIds = query?.Val<int[]>("OwnerIds");
            var isTransferred = query?.Val<bool?>("IsTransferred");
            var identityNumber = query?.Val<Int64?>("IdentityNumber");

            var pre = displayStatus.HasValue && displayStatus.Value == ContractDisplayStatus.Deleted ? "c.DeleteDate IS NOT NULL" : "c.DeleteDate IS NULL";
            pre += collateralType.HasValue ? " AND c.CollateralType = @collateralType" : string.Empty;
            pre += clientId.HasValue ? " AND c.ClientId = @clientId" : string.Empty;

            if (identityNumber.HasValue)
            {
                pre += " AND JSON_VALUE(c.ContractData, '$.Client.IdentityNumber') = CAST(@identityNumber AS NVARCHAR(MAX))";
            }
            else
            {
                pre += ownerIds != null && ownerIds.Length > 0 ? " AND mr.LeftMemberId IN @ownerIds" : string.Empty;

            }

            if (isTransferred.HasValue && isTransferred.Value) pre += " AND c.TransferDate IS NOT NULL";
            else pre += " AND c.TransferDate IS NULL";

            var from = "FROM Contracts c";
            if (displayStatus.HasValue)
            {
                switch (displayStatus)
                {
                    case ContractDisplayStatus.New:
                        pre += " AND c.Status = 0";
                        pre += beginDate.HasValue ? " AND c.ContractDate >= @beginDate" : string.Empty;
                        pre += endDate.HasValue ? " AND c.ContractDate <= @endDate" : string.Empty;
                        break;
                    case ContractDisplayStatus.Open:
                        pre += " AND c.Status = 30 AND c.MaturityDate >= CONVERT(DATE, dbo.GETASTANADATE()) AND c.ProlongDate IS NULL";
                        pre += beginDate.HasValue ? " AND c.ContractDate >= @beginDate" : string.Empty;
                        pre += endDate.HasValue ? " AND c.ContractDate <= @endDate" : string.Empty;
                        break;
                    case ContractDisplayStatus.Overdue:
                        pre += " AND c.Status = 30 AND c.MaturityDate < CONVERT(DATE, dbo.GETASTANADATE())";
                        pre += beginDate.HasValue ? " AND c.ContractDate >= @beginDate" : string.Empty;
                        pre += endDate.HasValue ? " AND c.ContractDate <= @endDate" : string.Empty;
                        break;
                    case ContractDisplayStatus.Prolong:
                        pre += " AND c.Status = 30 AND c.MaturityDate >= CONVERT(DATE, dbo.GETASTANADATE()) AND c.ProlongDate IS NOT NULL";
                        pre += " AND ca.ActionType = 10";
                        pre += beginDate.HasValue ? " AND ca.[Date] >= @beginDate" : string.Empty;
                        pre += endDate.HasValue ? " AND ca.[Date] <= @endDate" : string.Empty;
                        from = "FROM ContractActions ca JOIN Contracts c ON ca.ContractId = c.Id";
                        break;
                    case ContractDisplayStatus.BoughtOut:
                        pre += " AND c.Status = 40";
                        pre += " AND ca.ActionType IN (20, 30, 40)";
                        pre += beginDate.HasValue ? " AND ca.[Date] >= @beginDate" : string.Empty;
                        pre += endDate.HasValue ? " AND ca.[Date] <= @endDate" : string.Empty;
                        from = "FROM ContractActions ca JOIN Contracts c ON ca.ContractId = c.Id";
                        break;
                    case ContractDisplayStatus.SoldOut:
                        pre += " AND c.Status = 50";
                        pre += " AND ca.ActionType = 60";
                        pre += beginDate.HasValue ? " AND ca.[Date] >= @beginDate" : string.Empty;
                        pre += endDate.HasValue ? " AND ca.[Date] <= @endDate" : string.Empty;
                        from = "FROM ContractActions ca JOIN Contracts c ON ca.ContractId = c.Id";
                        break;
                    case ContractDisplayStatus.Signed:
                        pre += " AND c.Status = 30";
                        pre += beginDate.HasValue ? " AND c.ContractDate >= @beginDate" : string.Empty;
                        pre += endDate.HasValue ? " AND c.ContractDate <= @endDate" : string.Empty;
                        break;
                    default:
                        break;
                }
            }
            else
            {
                pre += beginDate.HasValue ? " AND c.ContractDate >= @beginDate" : string.Empty;
                pre += endDate.HasValue ? " AND c.ContractDate <= @endDate" : string.Empty;
            }

            var condition = listQuery.Like(pre, "c.ContractNumber", "JSON_VALUE(c.ContractData, '$.Client.Fullname')", "JSON_VALUE(c.ContractData, '$.Client.IdentityNumber')", "JSON_VALUE(c.ContractData, '$.Client.MobilePhone')");

            return UnitOfWork.Session.ExecuteScalar<int>($@"
SELECT COUNT(DISTINCT c.Id)
{from}
JOIN MemberRelations mr ON mr.RightMemberId = c.OwnerId
{condition}", new
            {
                beginDate,
                endDate,
                collateralType,
                clientId,
                ownerIds,
                identityNumber,
                listQuery.Filter
            });
        }
    }
}