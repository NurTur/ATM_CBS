using Pawnshop.Core;
using Pawnshop.Core.Validation;
using Pawnshop.Data.Models.Clients;
using Pawnshop.Data.Models.Files;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Pawnshop.Data.Models.Contracts.Actions;
using Pawnshop.Data.Models.Membership;

namespace Pawnshop.Data.Models.Contracts
{
    /// <summary>
    /// Договор займа
    /// </summary>
    public class Contract : IEntity, IOwnable
    {
        /// <summary>
        /// Идентификатор
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// Клиент
        /// </summary>
        [RequiredId(ErrorMessage = "Поле клиент обязательно для заполнения")]
        public int ClientId { get; set; }

        public Client Client { get; set; }

        /// <summary>
        /// Номер договора
        /// </summary>
        public string ContractNumber { get; set; }

        /// <summary>
        /// Дата договора
        /// </summary>
        [RequiredDate(ErrorMessage = "Поле дата договора обязательно для заполнения")]
        public DateTime ContractDate { get; set; }

        /// <summary>
        /// Вид залога
        /// </summary>
        public CollateralType CollateralType { get; set; }

        /// <summary>
        /// Вид удержания процентов
        /// </summary>
        public PercentPaymentType PercentPaymentType { get; set; }

        /// <summary>
        /// Дата возврата
        /// </summary>
        [RequiredDate(ErrorMessage = "Поле дата возврата обязательно для заполнения")]
        public DateTime MaturityDate { get; set; }

        /// <summary>
        /// Первоначальная дата возврата
        /// </summary>
        [RequiredDate(ErrorMessage = "Поле первоначальная дата возврата обязательно для заполнения")]
        public DateTime OriginalMaturityDate { get; set; }

        /// <summary>
        /// Оценочная стоимость
        /// </summary>
        public int EstimatedCost { get; set; }

        /// <summary>
        /// Ссуда
        /// </summary>
        public int LoanCost { get; set; }

        /// <summary>
        /// Срок залога (дней)
        /// </summary>
        public int LoanPeriod { get; set; }

        /// <summary>
        /// Процент кредита
        /// </summary>
        [Range(0, 100, ErrorMessage = "Поле процент кредита должно иметь значение от 0 до 100")]
        public decimal LoanPercent { get; set; }

        /// <summary>
        /// Стоимость процента кредита
        /// </summary>
        public decimal LoanPercentCost { get; set; }

        /// <summary>
        /// Процент штрафа
        /// </summary>
        [Range(0, 100, ErrorMessage = "Поле процент штрафа должно иметь значение от 0 до 100")]
        public decimal PenaltyPercent { get; set; }

        /// <summary>
        /// Стоимость процента штрафа
        /// </summary>
        public decimal PenaltyPercentCost { get; set; }

        /// <summary>
        /// Примечание
        /// </summary>
        public string Note { get; set; }

        /// <summary>
        /// Данные договора
        /// </summary>
        [Required(ErrorMessage = "Поле данные договора обязательно для заполнения")]
        public ContractData ContractData { get; set; }

        /// <summary>
        /// Специфичные поля договора
        /// </summary>
        public GoldContractSpecific ContractSpecific { get; set; }

        /// <summary>
        /// Идентификатор владельца
        /// </summary>
        [RequiredId(ErrorMessage = "Поле владелец обязательно для заполнения")]
        public int OwnerId { get; set; }

        /// <summary>
        /// Дата удаления
        /// </summary>
        public DateTime? DeleteDate { get; set; }

        /// <summary>
        /// Позиции договора
        /// </summary>
        public List<ContractPosition> Positions { get; set; } = new List<ContractPosition>();

        /// <summary>
        /// Файлы договора
        /// </summary>
        public List<FileRow> Files { get; set; } = new List<FileRow>();

        /// <summary>
        /// Статус договора
        /// </summary>
        public ContractStatus Status { get; set; } = ContractStatus.Draft;

        /// <summary>
        /// Бизнес статус договора
        /// </summary>
        public ContractDisplayStatus DisplayStatus { get; set; }

        /// <summary>
        /// Дата продления
        /// </summary>
        public DateTime? ProlongDate { get; set; }

        /// <summary>
        /// Дата передачи
        /// </summary>
        public DateTime? TransferDate { get; set; }

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
        /// Автор договора
        /// </summary>
        [RequiredId(ErrorMessage = "Поле автор обязательно для заполнения")]
        public int AuthorId { get; set; }

        /// <summary>
        /// Автор договора
        /// </summary>
        public User Author { get; set; }

        /// <summary>
        /// Договор должен быть подписан
        /// </summary>
        public bool Locked { get; set; } = false;

        /// <summary>
        /// True, если договор создан сегодня
        /// </summary>
        public bool CreatedToday => ContractDate.Date == DateTime.Now.Date;

        /// <summary>
        /// Журнал действий
        /// </summary>
        public List<ContractAction> Actions { get; set; } = new List<ContractAction>();

        /// <summary>
        /// Примечания
        /// </summary>
        public List<ContractNote> Notes { get; set; } = new List<ContractNote>();
    }
}