using System;
using System.Collections.Generic;
using System.Linq;
using Dapper;
using Pawnshop.Core;
using Pawnshop.Core.Impl;
using Pawnshop.Core.Queries;
using Pawnshop.Data.Models.Contracts;
using Pawnshop.Data.Models.Membership;
using Pawnshop.Data.Models.Notifications;

namespace Pawnshop.Data.Access
{
    public class NotificationRepository : RepositoryBase, IRepository<Notification>
    {
        public NotificationRepository(IUnitOfWork unitOfWork) : base(unitOfWork)
        {
        }

        public void Insert(Notification entity)
        {
            using (var transaction = BeginTransaction())
            {
                entity.Id = UnitOfWork.Session.QuerySingleOrDefault<int>(@"
INSERT INTO Notifications ( MessageType, Subject, Message, Status, CreateDate, BranchId, UserId, DeleteDate )
VALUES ( @MessageType, @Subject, @Message, @Status, @CreateDate, @BranchId, @UserId, @DeleteDate )
SELECT SCOPE_IDENTITY()", entity, UnitOfWork.Transaction);

                transaction.Commit();
            }
        }

        public void Update(Notification entity)
        {
            using (var transaction = BeginTransaction())
            {
                UnitOfWork.Session.Execute(@"
UPDATE Notifications
SET MessageType = @MessageType, Subject = @Subject, Message = @Message, Status = @Status, CreateDate = @CreateDate, 
    BranchId = @BranchId, UserId = @UserId, DeleteDate = @DeleteDate
WHERE Id = @Id", entity, UnitOfWork.Transaction);

                transaction.Commit();
            }
        }

        public void Sent(int id)
        {
            using (var transaction = BeginTransaction())
            {
                var count = UnitOfWork.Session.ExecuteScalar<int>(@"
SELECT COUNT(*)
FROM NotificationReceivers
WHERE NotificationId = @notificationId
    AND Status <> 20", new { notificationId = id }, UnitOfWork.Transaction);

                if (count == 0)
                {
                    UnitOfWork.Session.Execute(@"
UPDATE Notifications
SET Status = 20
WHERE Id = @id
    AND Status = 10", new { id }, UnitOfWork.Transaction);
                }

                transaction.Commit();
            }
        }

        public void Delete(int id)
        {
            using (var transaction = BeginTransaction())
            {
                UnitOfWork.Session.Execute(@"UPDATE Notifications SET DeleteDate = dbo.GETASTANADATE() WHERE Id = @id", new { id }, UnitOfWork.Transaction);
                transaction.Commit();
            }
        }

        public Notification Get(int id)
        {
            return UnitOfWork.Session.QuerySingleOrDefault<Notification>(@"
SELECT *
FROM Notifications
WHERE Id = @id", new { id }, UnitOfWork.Transaction);
        }

        public Notification Find(object query)
        {
            throw new NotImplementedException();
        }

        public List<Notification> List(ListQuery listQuery, object query = null)
        {
            if (listQuery == null) throw new ArgumentNullException(nameof(listQuery));

            var branchId = query?.Val<int>("BranchId");
            var beginDate = query?.Val<DateTime?>("BeginDate");
            var endDate = query?.Val<DateTime?>("EndDate");
            var messageType = query?.Val<MessageType?>("MessageType");
            var status = query?.Val<NotificationStatus?>("Status");

            var pre = "n.BranchId = @branchId AND n.DeleteDate IS NULL";
            if (beginDate.HasValue) pre += " AND n.CreateDate >= @beginDate";
            if (endDate.HasValue) pre += " AND n.CreateDate <= @endDate";
            if (messageType.HasValue) pre += " AND n.MessageType = @messageType";
            if (status.HasValue) pre += " AND n.Status = @status";

            var condition = listQuery.Like(pre, "n.Message");
            var order = listQuery.Order(string.Empty, new Sort
            {
                Name = "n.CreateDate",
                Direction = SortDirection.Desc
            });
            var page = listQuery.Page();

            return UnitOfWork.Session.Query<Notification>($@"
SELECT n.*
FROM Notifications n
{condition} {order} {page}",
                new
                {
                    branchId,
                    beginDate,
                    endDate,
                    messageType,
                    status,
                    listQuery.Page?.Offset,
                    listQuery.Page?.Limit,
                    listQuery.Filter                    
                }).ToList();
        }

        public int Count(ListQuery listQuery, object query = null)
        {
            if (listQuery == null) throw new ArgumentNullException(nameof(listQuery));

            var branchId = query?.Val<int>("BranchId");
            var beginDate = query?.Val<DateTime?>("BeginDate");
            var endDate = query?.Val<DateTime?>("EndDate");
            var messageType = query?.Val<MessageType?>("MessageType");
            var status = query?.Val<NotificationStatus?>("Status");

            var pre = "n.BranchId = @branchId AND n.DeleteDate IS NULL";
            if (beginDate.HasValue) pre += " AND n.CreateDate >= @beginDate";
            if (endDate.HasValue) pre += " AND n.CreateDate <= @endDate";
            if (messageType.HasValue) pre += " AND n.MessageType = @messageType";
            if (status.HasValue) pre += " AND n.Status = @status";

            var condition = listQuery.Like(pre, "n.Message");

            return UnitOfWork.Session.ExecuteScalar<int>($@"
SELECT COUNT(*)
FROM Notifications n
{condition}",
                new
                {
                    branchId,
                    beginDate,
                    endDate,
                    messageType,
                    status,
                    listQuery.Filter                    
                });
        }

        public void Select(Notification entity)
        {
            using (var transaction = BeginTransaction())
            {
                var groups = UnitOfWork.Session.Query<Group>(@"
SELECT g.*
FROM Groups g", transaction: UnitOfWork.Transaction).ToList();
                
                foreach (var group in groups)
                {
                    UnitOfWork.Session.Execute(@"
DECLARE @NotificationId INT
DECLARE @UserId INT

SELECT TOP 1 @UserId = u.Id
FROM Users u

INSERT INTO Notifications ( MessageType, Subject, Message, Status, CreateDate, BranchId, UserId )
VALUES ( @MessageType, @Subject, @Message, @Status, dbo.GETASTANADATE(), @BranchId, @UserId )
SELECT @NotificationId = SCOPE_IDENTITY()

INSERT INTO NotificationReceivers ( NotificationId, ClientId, Status, CreateDate, TryCount )
SELECT @NotificationId, c.ClientId, @Status, dbo.GETASTANADATE(), 0
FROM Contracts c
WHERE c.DeleteDate IS NULL
    AND c.PercentPaymentType = 20
    AND c.[Status] = 30
    AND c.MaturityDate > dbo.GETASTANADATE()
    AND DATEDIFF(DAY, dbo.GETASTANADATE(), c.MaturityDate) = 2
    AND c.BranchId = @BranchId

INSERT INTO NotificationReceivers ( NotificationId, ClientId, Status, CreateDate, TryCount )
SELECT @NotificationId, c.ClientId, @Status, dbo.GETASTANADATE(), 0
FROM Contracts c
WHERE c.DeleteDate IS NULL
    AND c.PercentPaymentType IN (30, 31)
    AND c.[Status] = 30
    AND c.MaturityDate > dbo.GETASTANADATE()
    AND DATEDIFF(DAY, dbo.GETASTANADATE(), DATEFROMPARTS(DATEPART(YEAR, dbo.GETASTANADATE()), DATEPART(MONTH, dbo.GETASTANADATE()), 
        CASE DATEPART(MONTH, dbo.GETASTANADATE()) WHEN 2 THEN IIF(DATEPART(DAY, c.ContractDate)>28,28,DATEPART(DAY, c.ContractDate)) 
		        								  WHEN 4 THEN IIF(DATEPART(DAY, c.ContractDate)>30,30,DATEPART(DAY, c.ContractDate))
				        						  WHEN 6 THEN IIF(DATEPART(DAY, c.ContractDate)>30,30,DATEPART(DAY, c.ContractDate))
						        				  WHEN 9 THEN IIF(DATEPART(DAY, c.ContractDate)>30,30,DATEPART(DAY, c.ContractDate))
								        		  WHEN 11 THEN IIF(DATEPART(DAY, c.ContractDate)>30,30,DATEPART(DAY, c.ContractDate))
										          ELSE DATEPART(DAY, c.ContractDate) END)) = 2
    AND c.BranchId = @BranchId", new
                    {
                        BranchId = group.Id,
                        entity.MessageType,
                        entity.Subject,
                        entity.Message,
                        entity.Status
                    }, UnitOfWork.Transaction);
                }

                transaction.Commit();
            }
        }

        public void SelectPeriod(object query)
        {
            if (query == null) throw new ArgumentNullException(nameof(query));

            var messageType = query.Val<MessageType?>("MessageType");
            var subject = query.Val<string>("Subject");
            var message = query.Val<string>("Message");
            var status = query.Val<NotificationStatus?>("Status");
            var branchId = query.Val<int?>("BranchId");
            var userId = query.Val<int?>("UserId");
            var collateralType = query.Val<CollateralType?>("CollateralType");
            var period = query.Val<int?>("Period");

            if (!messageType.HasValue) throw new ArgumentNullException(nameof(messageType));
            if (!string.IsNullOrWhiteSpace(subject)) throw new ArgumentNullException(nameof(subject));
            if (!string.IsNullOrWhiteSpace(message)) throw new ArgumentNullException(nameof(message));
            if (!status.HasValue) throw new ArgumentNullException(nameof(status));
            if (!branchId.HasValue) throw new ArgumentNullException(nameof(branchId));
            if (!userId.HasValue) throw new ArgumentNullException(nameof(userId));
            if (!collateralType.HasValue) throw new ArgumentNullException(nameof(collateralType));
            if (!period.HasValue) throw new ArgumentNullException(nameof(period));

            using (var transaction = UnitOfWork.BeginTransaction())
            {
                UnitOfWork.Session.Execute(@"
DECLARE @NotificationId INT

IF @BranchId > 0
DECLARE cur CURSOR FOR
    SELECT @BranchId
ELSE
DECLARE cur CURSOR FOR
    SELECT g.Id as BranchId
    FROM Groups g

OPEN cur
FETCH NEXT FROM cur INTO @BranchId
WHILE @@FETCH_STATUS = 0
BEGIN
    INSERT INTO Notifications ( MessageType, Subject, Message, Status, CreateDate, BranchId, UserId )
    VALUES ( @MessageType, @Subject, @Message, @Status, dbo.GETASTANADATE(), @BranchId, @UserId )
    SELECT @NotificationId = SCOPE_IDENTITY()

    INSERT INTO NotificationReceivers ( NotificationId, ClientId, Status, CreateDate, TryCount )
    SELECT @NotificationId, c.ClientId, @Status, dbo.GETASTANADATE(), 0
    FROM Contracts c
    WHERE c.DeleteDate IS NULL
        AND c.PercentPaymentType = 20
        AND c.[Status] = 30
        AND c.MaturityDate > dbo.GETASTANADATE()
        AND DATEDIFF(DAY, dbo.GETASTANADATE(), c.MaturityDate) = @Period
        AND c.BranchId = @BranchId
        AND (@CollateralType = 0 OR c.CollateralType = @CollateralType)

    INSERT INTO NotificationReceivers ( NotificationId, ClientId, Status, CreateDate, TryCount )
    SELECT @NotificationId, c.ClientId, @Status, dbo.GETASTANADATE(), 0
    FROM Contracts c
    WHERE c.DeleteDate IS NULL
        AND c.PercentPaymentType IN (30, 31)
        AND c.[Status] = 30
        AND c.MaturityDate > dbo.GETASTANADATE()
        AND DATEDIFF(DAY, dbo.GETASTANADATE(), DATEFROMPARTS(DATEPART(YEAR, dbo.GETASTANADATE()), DATEPART(MONTH, dbo.GETASTANADATE()), DATEPART(DAY, c.ContractDate))) = @Period
        AND c.BranchId = @BranchId
        AND (@CollateralType = 0 OR c.CollateralType = @CollateralType)

    FETCH NEXT FROM cur INTO @BranchId
END

CLOSE cur
DEALLOCATE cur", new
                {
                    messageType,
                    subject,
                    message,
                    status,
                    branchId,
                    userId,
                    collateralType,
                    period
                }, UnitOfWork.Transaction);

                transaction.Commit();
            }
        }

        public void SelectOverdue(object query)
        {
            if (query == null) throw new ArgumentNullException(nameof(query));

            var messageType = query.Val<MessageType?>("MessageType");
            var subject = query.Val<string>("Subject");
            var message = query.Val<string>("Message");
            var status = query.Val<NotificationStatus?>("Status");
            var branchId = query.Val<int?>("BranchId");
            var userId = query.Val<int?>("UserId");
            var collateralType = query.Val<CollateralType?>("CollateralType");

            if (!messageType.HasValue) throw new ArgumentNullException(nameof(messageType));
            if (!string.IsNullOrWhiteSpace(subject)) throw new ArgumentNullException(nameof(subject));
            if (!string.IsNullOrWhiteSpace(message)) throw new ArgumentNullException(nameof(message));
            if (!status.HasValue) throw new ArgumentNullException(nameof(status));
            if (!branchId.HasValue) throw new ArgumentNullException(nameof(branchId));
            if (!userId.HasValue) throw new ArgumentNullException(nameof(userId));
            if (!collateralType.HasValue) throw new ArgumentNullException(nameof(collateralType));

            using (var transaction = UnitOfWork.BeginTransaction())
            {
                UnitOfWork.Session.Execute(@"
DECLARE @NotificationId INT

IF @BranchId > 0
DECLARE cur CURSOR FOR
    SELECT @BranchId
ELSE
DECLARE cur CURSOR FOR
    SELECT g.Id as BranchId
    FROM Groups g

OPEN cur
FETCH NEXT FROM cur INTO @BranchId
WHILE @@FETCH_STATUS = 0
BEGIN
    SELECT @MessageType, @Subject, @Message, @Status, dbo.GETASTANADATE(), @BranchId, @UserId

    INSERT INTO Notifications ( MessageType, Subject, Message, Status, CreateDate, BranchId, UserId )
    VALUES ( @MessageType, @Subject, @Message, @Status, dbo.GETASTANADATE(), @BranchId, @UserId )
    SELECT @NotificationId = SCOPE_IDENTITY()

    INSERT INTO NotificationReceivers ( NotificationId, ClientId, Status, CreateDate, TryCount )
    SELECT @NotificationId, c.ClientId, @Status, dbo.GETASTANADATE(), 0
    FROM Contracts c
    WHERE c.DeleteDate IS NULL
        AND c.PercentPaymentType = 20
        AND c.[Status] = 30
        AND c.MaturityDate < CONVERT(DATE, dbo.GETASTANADATE())
        AND c.BranchId = @BranchId
        AND (@CollateralType = 0 OR c.CollateralType = @CollateralType)

    INSERT INTO NotificationReceivers ( NotificationId, ClientId, Status, CreateDate, TryCount )
    SELECT @NotificationId, c.ClientId, @Status, dbo.GETASTANADATE(), 0
    FROM Contracts c
    WHERE c.DeleteDate IS NULL
        AND c.PercentPaymentType IN (30, 31)
        AND c.[Status] = 30
        AND DATEFROMPARTS(DATEPART(YEAR, dbo.GETASTANADATE()), DATEPART(MONTH, dbo.GETASTANADATE()), DATEPART(DAY, c.ContractDate)) < CONVERT(DATE, dbo.GETASTANADATE())
        AND c.BranchId = @BranchId
        AND (@CollateralType = 0 OR c.CollateralType = @CollateralType)

    FETCH NEXT FROM cur INTO @BranchId
END

CLOSE cur
DEALLOCATE cur", new
                {
                    messageType,
                    subject,
                    message,
                    status,
                    branchId,
                    userId,
                    collateralType
                }, UnitOfWork.Transaction);

                transaction.Commit();
            }
        }
    }
}