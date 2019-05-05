using System;

namespace Pawnshop.Web.Models.Reports.CashBook
{
    public class CashBookQueryModel
    {
        public DateTime CurrentDate { get; set; }

        public int BranchId { get; set; }
    }
}