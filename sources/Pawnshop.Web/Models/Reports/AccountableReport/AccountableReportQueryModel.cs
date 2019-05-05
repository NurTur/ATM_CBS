using System;
using System.Collections.Generic;

namespace Pawnshop.Web.Models.Reports.AccountableReport
{
    public class AccountableReportQueryModel
    {
        public DateTime BeginDate { get; set; }

        public DateTime EndDate { get; set; }

        public List<int> BranchIds { get; set; }

        public List<int> AccountIds { get; set; }
    }
}