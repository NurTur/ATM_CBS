using System;
using Pawnshop.Data.Models.Sellings;

namespace Pawnshop.Web.Models.Reports.SellingReport
{
    public class SellingReportQueryModel
    {
        public DateTime BeginDate { get; set; }

        public DateTime EndDate { get; set; }

        public int BranchId { get; set; }

        public SellingStatus? Status { get; set; }
    }
}