using System;
using System.Collections.Generic;
using System.Linq;
using Dapper;
using Pawnshop.Core;
using Pawnshop.Core.Impl;
using Pawnshop.Core.Queries;
using Pawnshop.Data.Models.Clients;
using Pawnshop.Data.Models.Contracts;
using Pawnshop.Data.Models.Notifications;

namespace Pawnshop.Data.Access
{
    public class NotificationReceiverRepository : RepositoryBase, IRepository<NotificationReceiver>
    {
        public NotificationReceiverRepository(IUnitOfWork unitOfWork) : base(unitOfWork)
        {
        }

        public void Insert(NotificationReceiver entity)
        {
            using (var transaction = UnitOfWork.BeginTransaction())
            {
                entity.Id = UnitOfWork.Session.QuerySingleOrDefault<int>(@"
INSERT INTO NotificationReceivers ( NotificationId, ClientId, Status, CreateDate, TryCount )
VALUES ( @NotificationId, @ClientId, @Status, @CreateDate, @TryCount )
SELECT SCOPE_IDENTITY()", entity, UnitOfWork.Transaction);
                
                transaction.Commit();
            }
        }

        public void Update(NotificationReceiver entity)
        {
            using (var transaction = UnitOfWork.BeginTransaction())
            {
                UnitOfWork.Session.Execute(@"
UPDATE NotificationReceivers
SET NotificationId = @NotificationId, ClientId = @ClientId, Status = @Status, CreateDate = @CreateDate, TryCount = @TryCount
WHERE Id = @Id", entity, UnitOfWork.Transaction);

                transaction.Commit();
            }
        }

        public void ForSend(int notificationId)
        {
            using (var transaction = UnitOfWork.BeginTransaction())
            {
                UnitOfWork.Session.Execute(@"
UPDATE NotificationReceivers
SET Status = 10
WHERE NotificationId = @notificationId
    AND Status = 0", new { notificationId }, UnitOfWork.Transaction);

                transaction.Commit();
            }
        }

        public void Delete(int id)
        {
            using (var transaction = UnitOfWork.BeginTransaction())
            {
                UnitOfWork.Session.Execute("DELETE FROM NotificationReceivers WHERE Id = @id", new { id }, UnitOfWork.Transaction);
                transaction.Commit();
            }
        }

        public NotificationReceiver Get(int id)
        {
            return UnitOfWork.Session.Query<NotificationReceiver, Notification, Client, NotificationReceiver>(@"
SELECT nr.*, n.*, c.*
FROM NotificationReceivers nr
JOIN Notifications n ON nr.NotificationId = n.Id
JOIN Clients c ON nr.ClientId = c.Id
WHERE nr.Id = @id", 
                (nr, n, c) => 
                { 
                    nr.Notification = n;
                    nr.Client = c; 
                    return nr; 
                }, new { id }).FirstOrDefault();
        }

        public NotificationReceiver Find(object query = null)
        {
            var condition = "WHERE nr.Status = 10 AND nr.TryCount < 5";
            var order = "ORDER BY nr.CreateDate";
            
            return UnitOfWork.Session.Query<NotificationReceiver, Notification, Client, NotificationReceiver>($@"
SELECT TOP 1 nr.*, n.*, c.*
FROM NotificationReceivers nr
JOIN Notifications n ON nr.NotificationId = n.Id
JOIN Clients c ON nr.ClientId = c.Id
{condition} {order}",
                (nr, n, c) =>
                {
                    nr.Notification = n;
                    nr.Client = c;
                    return nr;
                }).FirstOrDefault();
        }

        public List<NotificationReceiver> List(ListQuery listQuery, object query = null)
        {
            if (listQuery == null) throw new ArgumentNullException(nameof(listQuery));

            var notificationId = query?.Val<int>("NotificationId");

            var pre = "nr.NotificationId = @notificationId";
            var condition = listQuery.Like(pre, "cl.FullName");
            var order = listQuery.Order(string.Empty, new Sort
            {
                Name = "cl.FullName",
                Direction = SortDirection.Asc
            });
            var page = listQuery.Page();

            return UnitOfWork.Session.Query<NotificationReceiver, Notification, Client, NotificationReceiver>($@"
SELECT nr.*, n.*, cl.*
FROM NotificationReceivers nr
JOIN Notifications n ON nr.NotificationId = n.Id
JOIN Clients cl ON nr.ClientId = cl.Id
{condition} {order} {page}", (nr, n, cl) => 
            {
                nr.Notification = n;
                nr.Client = cl;
                return nr; 
            }, new
            {
                notificationId,
                listQuery.Page?.Offset,
                listQuery.Page?.Limit,
                listQuery.Filter                    
            }, UnitOfWork.Transaction).ToList();
        }

        public int Count(ListQuery listQuery, object query = null)
        {
            if (listQuery == null) throw new ArgumentNullException(nameof(listQuery));

            var notificationId = query?.Val<int>("NotificationId");

            var pre = "nr.NotificationId = @notificationId";
            var condition = listQuery.Like(pre, "cl.FullName");

            return UnitOfWork.Session.ExecuteScalar<int>($@"
SELECT COUNT(*)
FROM NotificationReceivers nr
JOIN Notifications n ON nr.NotificationId = n.Id
JOIN Clients cl ON nr.ClientId = cl.Id
{condition}", new
            {
                notificationId,
                listQuery.Filter
            }, UnitOfWork.Transaction);
        }

        public void Select(ListQuery listQuery, object query = null)
        {
            if (listQuery == null) throw new ArgumentNullException(nameof(listQuery));

            var notificationId = query?.Val<int>("NotificationId");
            var branchId = query?.Val<int>("BranchId");
            var collateralType = query?.Val<CollateralType?>("CollateralType");
            var cardType = query?.Val<CardType?>("CardType");

            if (!notificationId.HasValue) throw new ArgumentNullException(nameof(notificationId));
            if (!branchId.HasValue) throw new ArgumentNullException(nameof(branchId));

            using (var transaction = UnitOfWork.BeginTransaction())
            {
                var condition = @"
WHERE cl.DeleteDate IS NULL
    AND c.BranchId = @branchId
    AND cl.Id NOT IN (
        SELECT nr.ClientId
        FROM NotificationReceivers nr
        WHERE nr.NotificationId = @notificationId
    )";

                if (collateralType.HasValue) condition += " AND c.CollateralType = @collateralType";
                if (cardType.HasValue) condition += " AND cl.CardType = @cardType";

                UnitOfWork.Session.Execute($@"
INSERT INTO NotificationReceivers ( NotificationId, ClientId, Status, CreateDate, TryCount )
SELECT DISTINCT @notificationId, cl.Id, 0, dbo.GETASTANADATE(), 0
FROM Contracts c
JOIN Clients cl ON c.ClientId = cl.Id
{condition}", new { notificationId, branchId, collateralType, cardType }, UnitOfWork.Transaction);

                transaction.Commit();
            }
        }
   }
}