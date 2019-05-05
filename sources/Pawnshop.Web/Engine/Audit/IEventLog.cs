using Pawnshop.Core;
using Pawnshop.Data.Models.Audit;

namespace Pawnshop.Web.Engine.Audit
{
    public interface IEventLog
    {
        void Log(EventCode code, EventStatus status, EntityType? entityType, int? entityId, string requestData, string responseData);
    }
}