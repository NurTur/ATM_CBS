using System;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Extensions;
using Pawnshop.Core;
using Pawnshop.Data.Access;
using Pawnshop.Data.Models.Audit;

namespace Pawnshop.Web.Engine.Audit
{
    public class EventLog : IEventLog
    {
        private readonly ISessionContext _sessionContext;
        private readonly BranchContext _branchContext;
        private readonly IHttpContextAccessor _accessor;
        private readonly EventLogRepository _repository;

        public EventLog(ISessionContext sessionContext, BranchContext branchContext, IHttpContextAccessor accessor, EventLogRepository repository)
        {
            _sessionContext = sessionContext;
            _branchContext = branchContext;
            _accessor = accessor;
            _repository = repository;
        }

        public void Log(EventCode code, EventStatus status, EntityType? entityType, int? entityId, string requestData, string responseData)
        {
            var item = new EventLogItem
            {
                EventCode = code,
                EventStatus = status,

                UserId = _sessionContext.IsInitialized ? (int?) _sessionContext.UserId : null,
                UserName = _sessionContext.IsInitialized ? _sessionContext.UserName : null,
                BranchId = _branchContext.InBranch ? (int?) _branchContext.Branch.Id : null,
                BranchName = _branchContext.InBranch ? _branchContext.Branch.Name : null,

                Uri = _accessor.HttpContext.Request.GetDisplayUrl(),
                Address = _accessor.HttpContext.Connection.RemoteIpAddress.ToString(),

                EntityType = entityType,
                EntityId = entityId,
                RequestData = requestData,
                ResponseData = responseData,

                CreateDate = DateTime.Now
            };
            _repository.Insert(item);
        }
    }
}