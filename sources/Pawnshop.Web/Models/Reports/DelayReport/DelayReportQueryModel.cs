using System;
using Pawnshop.Data.Models.Contracts;

namespace Pawnshop.Web.Models.Reports.DelayReport
{
    public class DelayReportQueryModel
    {
        public int BeginDelayCount { get; set; }

        public int EndDelayCount { get; set; }

        public int BranchId { get; set; }

        public CollateralType CollateralType { get; set; }
    }
}