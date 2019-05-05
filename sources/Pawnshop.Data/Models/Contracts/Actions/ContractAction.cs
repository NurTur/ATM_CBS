using System;
using System.ComponentModel.DataAnnotations;
using Pawnshop.Core;
using Pawnshop.Data.CustomTypes;
using Pawnshop.Data.Models.Membership;
using Pawnshop.Data.Models.InnerNotifications;

namespace Pawnshop.Data.Models.Contracts.Actions
{
    public class ContractAction : IEntity, ILoggableToEntity
    {
        public int Id { get; set; }
        public int ContractId { get; set; }
        public int AuthorId { get; set; }

        public ContractActionType ActionType { get; set; }
        public DateTime Date { get; set; }
        public decimal TotalCost { get; set; }

        public string Note { get; set; }

        [Required(ErrorMessage = "Поле \"Основание\" обязательно для заполнения")]
        public string Reason { get; set; }

        public ContractActionRow[] Rows { get; set; }

        public ContractActionData Data { get; set; }

        /// <summary>
        /// Следующий договор (порожденный)
        /// </summary>
        public int? FollowedId { get; set; }

        /// <summary>
        /// Дата создания
        /// </summary>
        public DateTime CreateDate { get; set; }

        /// <summary>
        /// Дата удаления
        /// </summary>
        public DateTime? DeleteDate { get; set; }

        public int GetLinkedEntityId()
        {
            return ContractId;
        }
    }

    public class ContractActionData : IJsonObject
    {
        /// <summary>
        /// Выбранные позиции
        /// </summary>
        public ContractPosition[] Positions { get; set; }

        /// <summary>
        /// Количество дней продления
        /// </summary>
        public int ProlongPeriod { get; set; }

        /// <summary>
        /// Порожденный перевод
        /// </summary>
        public int? RemittanceId { get; set; }

        /// <summary>
        /// Филиал в котором делали
        /// </summary>
        public Group Branch { get; set; }

        public InnerNotification Notification { get; set; }
    }
}