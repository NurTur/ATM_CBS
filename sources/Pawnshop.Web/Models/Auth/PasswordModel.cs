using System.ComponentModel.DataAnnotations;

namespace Pawnshop.Web.Models.Auth
{
    public class PasswordModel
    {
        [Required(ErrorMessage = "Укажите текущий пароль.")]
        public string OldPassword { get; set; }

        [Required(ErrorMessage = "Укажите новый пароль.")]
        [MinLength(6, ErrorMessage = "Пароль должен содержать не менее 6 символов.")]
        [CustomValidation(typeof(PasswordModel), "NewPasswordValidate")]
        public string NewPassword { get; set; }

        public static ValidationResult NewPasswordValidate(string value, ValidationContext context)
        {
            var model = (PasswordModel)context.ObjectInstance;

            if (model.OldPassword == model.NewPassword)
            {
                return new ValidationResult("Старый и новый пароль не должны совпадать");
            }

            return ValidationResult.Success;
        }
    }
}