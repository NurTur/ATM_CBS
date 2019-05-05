using Pawnshop.Data.CustomTypes;
using Pawnshop.Data.Models.Clients;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Pawnshop.Data.Models.Contracts
{
    public class ContractData : IJsonObject
    {
        public Client Client { get; set; }
    }
}
