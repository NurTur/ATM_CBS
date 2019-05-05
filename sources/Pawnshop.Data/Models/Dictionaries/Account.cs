using System.ComponentModel.DataAnnotations;
using Pawnshop.Core;

namespace Pawnshop.Data.Models.Dictionaries
{
    /// <summary>
    /// Счет
    /// </summary>
    public class Account : IEntity
    {
        /// <summary>
        /// Идентификатор
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// Счет
        /// </summary>
        [Required(ErrorMessage = "Поле счет обязательно для заполнения")]
        [MaxLength(10, ErrorMessage = "Поле счет не может содержать больше 10 символов")]
        [RegularExpression("^[0-9.]+$", ErrorMessage = "Поле счет может содержать только цифры и точки")]
        public string Code { get; set; }

        /// <summary>
        /// Наименование
        /// </summary>
        [Required(ErrorMessage = "Поле наименование обязательно для заполнения")]
        public string Name { get; set; }
    }
}