using System;
using Pawnshop.Core;
using Pawnshop.Data.Models.Audit;

namespace Pawnshop.Web.Models.Audit
{
    public class EventLogListQueryModel
    {
        public int? BranchId { get; set; }

        public EventCode? EventCode { get; set; }

        public DateTime? BeginDate { get; set; }

        public DateTime? EndDate { get; set; }

        public EntityType? EntityType { get; set; }

        public int? EntityId { get; set; }
    }
}