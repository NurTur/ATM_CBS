using System.ComponentModel.DataAnnotations;

namespace Pawnshop.Data.Models.Contracts
{
    public enum ContractDisplayStatus : short
    {
        /// <summary>
        /// Новый
        /// </summary>
        [Display(Name = "Новый")]
        New = 0,

        /// <summary>
        /// Открыт
        /// </summary>
        [Display(Name = "Открыт")]
        Open = 10,

        /// <summary>
        /// Просрочен
        /// </summary>
        [Display(Name = "Просрочен")]
        Overdue = 20,

        /// <summary>
        /// Продлен
        /// </summary>
        [Display(Name = "Продлен")]
        Prolong = 30,

        /// <summary>
        /// Выкуплен
        /// </summary>
        [Display(Name = "Выкуплен")]
        BoughtOut = 40,

        /// <summary>
        /// Отправлен на реализацию
        /// </summary>
        [Display(Name = "Отправлен на реализацию")]
        SoldOut = 50,

        /// <summary>
        /// Удален
        /// </summary>
        [Display(Name = "Удален")]
        Deleted = 60,

        /// <summary>
        /// Действующие
        /// </summary>
        [Display(Name = "Действующие")]
        Signed = 70,

        /// <summary>
        /// Передано
        /// </summary>
        [Display(Name = "Передано")]
        Transfered = 80
    }
}