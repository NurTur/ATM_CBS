using System.ComponentModel.DataAnnotations;

namespace Pawnshop.Data.Models.Contracts
{
    /// <summary>
    /// Вид залога
    /// </summary>
    public enum CollateralType : short
    {
        /// <summary>
        /// Золото
        /// </summary>
        [Display(Name = "Золото")]
        Gold = 10,
        /// <summary>
        /// Автомобиль
        /// </summary>
        [Display(Name = "Автомобиль")]
        Car = 20,
        /// <summary>
        /// Товар
        /// </summary>
        [Display(Name = "Товар")]
        Goods = 30,
        /// <summary>
        /// Товар
        /// </summary>
        [Display(Name = "Спецтехника")]
        Machinery = 40
    }
}
