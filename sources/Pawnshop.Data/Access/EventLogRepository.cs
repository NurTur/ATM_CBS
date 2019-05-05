using System;
using System.Collections.Generic;
using System.Linq;
using Dapper;
using Pawnshop.Core;
using Pawnshop.Core.Impl;
using Pawnshop.Core.Queries;
using Pawnshop.Data.Models.Audit;

namespace Pawnshop.Data.Access
{
    public class EventLogRepository : RepositoryBase, IRepository<EventLogItem>
    {
        public EventLogRepository(IUnitOfWork unitOfWork) : base(unitOfWork)
        {
        }

        public void Insert(EventLogItem entity)
        {
            using (var transaction = BeginTransaction())
            {
                entity.Id = UnitOfWork.Session.QuerySingleOrDefault<int>(@"
INSERT INTO EventLogItems ( EventCode, EventStatus, UserId, UserName, BranchId, BranchName, Uri, Address, EntityType, EntityId, RequestData, ResponseData, CreateDate )
VALUES ( @EventCode, @EventStatus, @UserId, @UserName, @BranchId, @BranchName, @Uri, @Address, @EntityType, @EntityId, @RequestData, @ResponseData, @CreateDate )
SELECT SCOPE_IDENTITY()", entity, UnitOfWork.Transaction);

                transaction.Commit();
            }
        }

        public void Update(EventLogItem entity)
        {
            throw new System.NotImplementedException();
        }

        public void Delete(int id)
        {
            throw new System.NotImplementedException();
        }

        public EventLogItem Get(int id)
        {
            throw new System.NotImplementedException();
        }

        public EventLogItem Find(object query)
        {
            throw new System.NotImplementedException();
        }

        public List<EventLogItem> List(ListQuery listQuery, object query = null)
        {
            if (listQuery == null) throw new ArgumentNullException(nameof(listQuery));

            var branchId = query?.Val<int?>("BranchId");
            var eventCode = query?.Val<EventCode?>("EventCode");
            var beginDate = query?.Val<DateTime?>("BeginDate");
            var endDate = query?.Val<DateTime?>("EndDate");
            var entityType = query?.Val<EntityType?>("EntityType");
            var entityId = query?.Val<int?>("EntityId");

            var pre = "Id <> 0";
            pre += branchId.HasValue ? " AND BranchId = @branchId" : string.Empty;
            pre += eventCode.HasValue ? " AND EventCode = @eventCode" : string.Empty;
            pre += beginDate.HasValue ? " AND CreateDate >= @beginDate" : string.Empty;
            pre += endDate.HasValue ? " AND CreateDate <= @endDate" : string.Empty;
            pre += entityType.HasValue ? " AND EntityType = @entityType" : string.Empty;
            pre += entityId.HasValue ? " AND EntityId = @entityId" : string.Empty;

            var condition = listQuery.Like(pre, "EventCode", "UserName", "BranchName");
            var order = listQuery.Order(string.Empty, new Sort
            {
                Name = "CreateDate",
                Direction = SortDirection.Desc
            });
            var page = listQuery.Page();

            return UnitOfWork.Session.Query<EventLogItem>($@"
SELECT *
FROM EventLogItems
{condition} {order} {page}", new 
                {
                    branchId,
                    eventCode,
                    beginDate,
                    endDate,
                    entityType,
                    entityId,
                    listQuery.Page?.Offset,
                    listQuery.Page?.Limit,
                    listQuery.Filter                    
                }).ToList();
        }

        public int Count(ListQuery listQuery, object query = null)
        {
            if (listQuery == null) throw new ArgumentNullException(nameof(listQuery));

            var branchId = query?.Val<int?>("BranchId");
            var eventCode = query?.Val<EventCode?>("EventCode");
            var beginDate = query?.Val<DateTime?>("BeginDate");
            var endDate = query?.Val<DateTime?>("EndDate");
            var entityType = query?.Val<EntityType?>("EntityType");
            var entityId = query?.Val<int?>("EntityId");

            var pre = "Id <> 0";
            pre += branchId.HasValue ? " AND BranchId = @branchId" : string.Empty;
            pre += eventCode.HasValue ? " AND EventCode = @eventCode" : string.Empty;
            pre += beginDate.HasValue ? " AND CreateDate >= @beginDate" : string.Empty;
            pre += endDate.HasValue ? " AND CreateDate <= @endDate" : string.Empty;
            pre += entityType.HasValue ? " AND EntityType = @entityType" : string.Empty;
            pre += entityId.HasValue ? " AND EntityId = @entityId" : string.Empty;
            var condition = listQuery.Like(pre, "EventCode", "UserName", "BranchName");

            return UnitOfWork.Session.ExecuteScalar<int>($@"
SELECT COUNT(*)
FROM EventLogItems
{condition}", new
            {
                branchId,
                eventCode,
                beginDate,
                endDate,
                entityType,
                entityId,
                listQuery.Filter
            });
        }
    }
}