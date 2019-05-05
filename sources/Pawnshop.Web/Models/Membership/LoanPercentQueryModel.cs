using Pawnshop.Data.Models.Clients;
using Pawnshop.Data.Models.Contracts;

namespace Pawnshop.Web.Models.Membership
{
    public class LoanPercentQueryModel
    {
        public int BranchId { get; set; }

        public CollateralType CollateralType { get; set; }

        public CardType CardType { get; set; }

        public int LoanCost { get; set; }

        public int LoanPeriod { get; set; }
    }
}