using System;
using System.ComponentModel.DataAnnotations;
using Pawnshop.Core.Validation;

namespace Pawnshop.Data.Models.Membership
{
    /// <summary>
    /// Пользователь
    /// </summary>
    public class User : Member
    {
        /// <summary>
        /// Логин
        /// </summary>
        [Required]
        public string Login { get; set; }

        /// <summary>
        /// ИИН
        /// </summary>
        [Required(ErrorMessage = "Поле ИИН обязательно для заполнения")]
        [RegularExpression("^\\d{12}$", ErrorMessage = "Поле ИИН должно содержать 12 цифр")]
        public string IdentityNumber { get; set; }

        /// <summary>
        /// Полное имя
        /// </summary>
        [Required]
        public string Fullname { get; set; }

        /// <summary>
        /// Электронная почта
        /// </summary>
        [Required, EmailAddress]
        public string Email { get; set; }

        /// <summary>
        /// Дата истечения пароля
        /// </summary>
        [RequiredDate]
        public DateTime ExpireDate { get; set; }

        /// <summary>
        /// Дней до истечения пароля
        /// </summary>
        public int ExpireDay => (ExpireDate.Date - DateTime.Now.Date).Days;

        /// <summary>
        /// True, если пользователь осуществляет техническую поддержку
        /// </summary>
        public bool ForSupport { get; set; }
    }
}