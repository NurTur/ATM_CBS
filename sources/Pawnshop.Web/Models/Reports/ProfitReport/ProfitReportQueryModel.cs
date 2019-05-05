using System;
using Pawnshop.Data.Models.Contracts;

namespace Pawnshop.Web.Models.Reports.ProfitReport
{
    public class ProfitReportQueryModel
    {
        public DateTime BeginDate { get; set; }

        public DateTime EndDate { get; set; }

        public int BranchId { get; set; }

        public CollateralType? CollateralType { get; set; }
    }
}
