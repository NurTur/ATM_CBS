using System;

namespace Pawnshop.Web.Models.Reports.PaymentReport
{
    public class PaymentReportQueryModel
    {
        public int BranchId { get; set; }

        public DateTime CurrentDate { get; set; }
    }
}
