using System;
using Org.BouncyCastle.Math;
using Pawnshop.Data.Models.Contracts;

namespace Pawnshop.Web.Models.Contract
{
    public class ContractListQueryModel
    {
        public DateTime? BeginDate { get; set; }

        public DateTime? EndDate { get; set; }

        public CollateralType? CollateralType { get; set; }

        public ContractDisplayStatus? DisplayStatus { get; set; }

        public int? ClientId { get; set; }

        public int[] OwnerIds { get; set; }

        public bool IsTransferred { get; set; }

        public Int64? IdentityNumber { get; set; }
}
}