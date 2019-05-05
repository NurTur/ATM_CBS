using Pawnshop.Core;
using Pawnshop.Core.Validation;

namespace Pawnshop.Data.Models.Contracts.Actions
{
    public class ContractActionRow : IEntity
    {
        public int Id { get; set; }

        /// <summary>
        /// Ссылка на действие
        /// </summary>
        public int ActionId { get; set; }

        /// <summary>
        /// Тип погашения
        /// </summary>
        public PaymentType PaymentType { get; set; }

        /// <summary>
        /// Период, дн
        /// </summary>
        public int? Period { get; set; }

        /// <summary>
        /// Процент оригинальный
        /// </summary>
        public decimal? OriginalPercent { get; set; }

        /// <summary>
        /// Процент
        /// </summary>
        public decimal? Percent { get; set; }

        /// <summary>
        /// Сумма погашения
        /// </summary>
        public decimal Cost { get; set; }

        /// <summary>
        /// Ссылка на дебет
        /// </summary>
        [RequiredId(ErrorMessage = "Поле \"Дебет\" обязательно для заполнения")]
        public int DebitAccountId { get; set; }

        /// <summary>
        /// Ссылка на кредит
        /// </summary>
        [RequiredId(ErrorMessage = "Поле \"Кредит\" обязательно для заполнения")]
        public int CreditAccountId { get; set; }

        /// <summary>
        /// Ссылка на ПКО
        /// </summary>
        public int OrderId { get; set; }
    }
}