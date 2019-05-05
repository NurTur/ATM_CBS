using System.Collections.Generic;
using Pawnshop.Data.Models.Dictionaries;
using Pawnshop.Data.Models.Files;

namespace Pawnshop.Data.Models.Clients
{
    /// <summary>
    /// Компания (клиент)
    /// </summary>
    public class Company : Client
    {
        /// <summary>
        /// Кбе
        /// </summary>
        public string Kbe { get; set; }

        /// <summary>
        /// Идентификатор банка
        /// </summary>
        public int? BankId { get; set; }

        /// <summary>
        /// Банк
        /// </summary>
        public Bank Bank { get; set; }
    }
}