using System;
using System.Collections.Generic;
using System.Linq;
using Dapper;
using Pawnshop.Core;
using Pawnshop.Core.Impl;
using Pawnshop.Core.Queries;
using Pawnshop.Data.Models.Contracts;
using Pawnshop.Data.Models.Membership;
using Pawnshop.Data.Models.InnerNotifications;

namespace Pawnshop.Data.Access
{
    public class InnerNotificationRepository : RepositoryBase, IRepository<InnerNotification>
    {
        public InnerNotificationRepository(IUnitOfWork unitOfWork) : base(unitOfWork)
        {
        }

        public void Insert(InnerNotification entity)
        {
            using (var transaction = BeginTransaction())
            {
                entity.Id = UnitOfWork.Session.QuerySingleOrDefault<int>(@"
INSERT INTO InnerNotifications ( Message, CreatedBy, CreateDate, ReceiveBranchId, ReceiveUserId, EntityType, EntityId, DeleteDate, Status )
VALUES ( @Message, @CreatedBy, @CreateDate, @ReceiveBranchId, @ReceiveUserId, @EntityType, @EntityId, @DeleteDate, @Status )
SELECT SCOPE_IDENTITY()", entity, UnitOfWork.Transaction);

                transaction.Commit();
            }
        }

        public void Update(InnerNotification entity)
        {
            using (var transaction = BeginTransaction())
            {
                UnitOfWork.Session.Execute(@"
UPDATE InnerNotifications
SET Message = @Message, CreatedBy = @CreatedBy, CreateDate = @CreateDate, ReceiveBranchId = @ReceiveBranchId, ReceiveUserId = @ReceiveUserId, 
    EntityType = @EntityType, EntityId = @EntityId, DeleteDate = @DeleteDate, Status = @Status
WHERE Id = @Id", entity, UnitOfWork.Transaction);

                transaction.Commit();
            }
        }

//        public void Done(int id)
//        {
//            using (var transaction = BeginTransaction())
//            {
//                var count = UnitOfWork.Session.ExecuteScalar<int>(@"
//SELECT COUNT(*)
//FROM NotificationReceivers
//WHERE NotificationId = @notificationId
//    AND Status <> 20", new { notificationId = id }, UnitOfWork.Transaction);

//                if (count == 0)
//                {
//                    UnitOfWork.Session.Execute(@"
//UPDATE Notifications
//SET Status = 20
//WHERE Id = @id
//    AND Status = 10", new { id }, UnitOfWork.Transaction);
//                }

//                transaction.Commit();
//            }
//        }

        public void Delete(int id)
        {
            using (var transaction = BeginTransaction())
            {
                UnitOfWork.Session.Execute(@"UPDATE InnerNotifications SET DeleteDate = dbo.GETASTANADATE() WHERE Id = @id", new { id }, UnitOfWork.Transaction);
                transaction.Commit();
            }
        }

        public InnerNotification Get(int id)
        {
            return UnitOfWork.Session.QuerySingleOrDefault<InnerNotification>(@"
SELECT *
FROM InnerNotifications
WHERE Id = @id", new { id }, UnitOfWork.Transaction);
        }

        public InnerNotification Find(object query)
        {
            throw new NotImplementedException();
        }

        public List<InnerNotification> List(ListQuery listQuery, object query = null)
        {
            if (listQuery == null) throw new ArgumentNullException(nameof(listQuery));

            var branchId = query?.Val<int?>("BranchId");
            var userId = query?.Val<int?>("UserId");

            var pre = "n.DeleteDate IS NULL";
            if (branchId.HasValue) pre += " AND (n.ReceiveBranchId = @branchId OR n.ReceiveUserId = @userId)";

            var condition = listQuery.Like(pre, "n.Message");
            var order = listQuery.Order(string.Empty, new Sort
            {
                Name = "n.CreateDate",
                Direction = SortDirection.Desc
            });
            var page = listQuery.Page();

            return UnitOfWork.Session.Query<InnerNotification>($@"
SELECT n.*
FROM InnerNotifications n
WHERE {pre}",
                new
                {
                    branchId,
                    userId,
                    listQuery.Page?.Offset,
                    listQuery.Page?.Limit,
                    listQuery.Filter                    
                }).ToList();
        }

        public int Count(ListQuery listQuery, object query = null)
        {
            if (listQuery == null) throw new ArgumentNullException(nameof(listQuery));

            var branchId = query?.Val<int?>("BranchId");
            var userId = query?.Val<int?>("UserId");

            var pre = "n.DeleteDate IS NULL";
            if (branchId.HasValue) pre += " AND (n.ReceiveBranchId = @branchId OR n.ReceiveUserId = @userId)";

            var condition = listQuery.Like(pre);
            var page = listQuery.Page();

            return UnitOfWork.Session.ExecuteScalar<int>($@"
SELECT COUNT(*)
FROM InnerNotifications n
WHERE {pre}",
                new
                {
                    branchId,
                    userId
                });
        }
    }
}