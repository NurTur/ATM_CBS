using System.ComponentModel.DataAnnotations;

namespace Pawnshop.Data.Models.Contracts
{
    public enum ContractStatus : short
    {
        /// <summary>
        /// Черновик
        /// </summary>
        [Display(Name = "Черновик")]
        Draft = 0,

        /// <summary>
        /// Подписан
        /// </summary>
        [Display(Name = "Подписан")]
        Signed = 30,

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
        /// Реализован
        /// </summary>
        [Display(Name = "Реализован")]
        Disposed = 60
    }
}