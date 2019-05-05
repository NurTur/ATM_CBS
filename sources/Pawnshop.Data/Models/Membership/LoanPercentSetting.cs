using Pawnshop.Core;
using Pawnshop.Core.Validation;
using Pawnshop.Data.Models.Clients;
using Pawnshop.Data.Models.Contracts;

namespace Pawnshop.Data.Models.Membership
{
    /// <summary>
    /// Настройка процентов кредита
    /// </summary>
    public class LoanPercentSetting : IEntity
    {
        /// <summary>
        /// Идентификатор
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// Организация
        /// </summary>
        [RequiredId(ErrorMessage = "Поле организация обязательно для заполнения")]
        public int OrganizationId { get; set; }

        /// <summary>
        /// Филиал, в котором создан договор
        /// </summary>
        [RequiredId(ErrorMessage = "Поле филиал обязательно для заполнения")]
        public int BranchId { get; set; }

        /// <summary>
        /// Филиал, в котором создан договор
        /// </summary>
        public Group Branch { get; set; }

        /// <summary>
        /// Вид залога
        /// </summary>
        public CollateralType CollateralType { get; set; }

        /// <summary>
        /// Тип карты
        /// </summary>
        public CardType CardType { get; set; }

        /// <summary>
        /// Ссуда от
        /// </summary>
        public int LoanCostFrom { get; set; }

        /// <summary>
        /// Ссуда до
        /// </summary>
        public int LoanCostTo { get; set; }

        /// <summary>
        /// Срок залога (дней)
        /// </summary>
        public int LoanPeriod { get; set; }

        /// <summary>
        /// Мин срок залога (дней)
        /// </summary>
        public int MinLoanPeriod { get; set; }

        /// <summary>
        /// Процент кредита
        /// </summary>
        public decimal LoanPercent { get; set; }

        /// <summary>
        /// Процент штрафа за просрочку кредита
        /// </summary>
        public decimal PenaltyPercent { get; set; }
    }
}