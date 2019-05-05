using Pawnshop.Core;
using Pawnshop.Core.Validation;
using Pawnshop.Data.Models.Dictionaries;
using System;
using Pawnshop.Data.Models.Contracts.Actions;

namespace Pawnshop.Data.Models.Contracts
{
    /// <summary>
    /// Позиция договора
    /// </summary>
    public class ContractPosition : IEntity
    {
        /// <summary>
        /// Идентификатор
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// Идентификатор договора
        /// </summary>
        public int ContractId { get; set; }

        /// <summary>
        /// Позиция
        /// </summary>
        [RequiredId(ErrorMessage = "Поле позиция обязательно для заполнения")]
        public int PositionId { get; set; }

        /// <summary>
        /// Позиция
        /// </summary>
        public Position Position { get; set; }

        /// <summary>
        /// Количество
        /// </summary>
        public int PositionCount { get; set; }

        /// <summary>
        /// Оценка
        /// </summary>
        public int EstimatedCost { get; set; }

        /// <summary>
        /// Ссуда
        /// </summary>
        public int LoanCost { get; set; }

        /// <summary>
        /// Категория аналитики
        /// </summary>
        [RequiredId(ErrorMessage = "Поле категория аналитики обязательно для заполнения")]
        public int CategoryId { get; set; }

        /// <summary>
        /// Категория аналитики
        /// </summary>
        public Category Category { get; set; }

        /// <summary>
        /// Примечание
        /// </summary>
        public string Note { get; set; }

        /// <summary>
        /// Специфичные поля позиции договора
        /// </summary>
        public GoldContractSpecific PositionSpecific { get; set; }

        /// <summary>
        /// Дата удаления
        /// </summary>
        public DateTime? DeleteDate { get; set; }

        /// <summary>
        /// Статус позиции
        /// </summary>
        public ContractPositionStatus Status { get; set; }
    }
}
