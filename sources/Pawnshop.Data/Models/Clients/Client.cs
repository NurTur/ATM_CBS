using System;
using System.Collections.Generic;
using Pawnshop.Core;
using Pawnshop.Data.Models.Files;
using System.ComponentModel.DataAnnotations;
using System.Text.RegularExpressions;
using Pawnshop.Core.Validation;

namespace Pawnshop.Data.Models.Clients
{
    /// <summary>
    /// Клиент
    /// </summary>
    public class Client : IEntity
    {
        /// <summary>
        /// Идентификатор
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// Тип карты
        /// </summary>
        public CardType CardType { get; set; }

        /// <summary>
        /// Номер карты
        /// </summary>
        public string CardNumber { get; set; }

        /// <summary>
        /// ИИН/БИН
        /// </summary>
        [Required(ErrorMessage = "Поле ИИН/БИН обязательно для заполнения")]
        [RegularExpression("^\\d{12}$", ErrorMessage = "Поле ИИН/БИН должно содержать 12 цифр")]
        public string IdentityNumber { get; set; }

        /// <summary>
        /// Полное имя
        /// </summary>
        [Required(ErrorMessage = "Поле полное имя обязательно для заполнения")]
        public string Fullname { get; set; }

        /// <summary>
        /// Адрес
        /// </summary>
        [Required(ErrorMessage = "Поле адрес обязательно для заполнения")]
        public string Address { get; set; }

        /// <summary>
        /// Мобильный телефон
        /// </summary>
        [Required(ErrorMessage = "Поле мобильный телефон обязательно для заполнения")]
        public string MobilePhone { get; set; }

        /// <summary>
        /// Городской телефон
        /// </summary>
        public string StaticPhone { get; set; }

        /// <summary>
        /// Электронная почта
        /// </summary>
        [EmailAddress]
        public string Email { get; set; }

        /// <summary>
        /// Тип документа удостоверяющего личность
        /// </summary>
        public DocumentType DocumentType { get; set; }

        /// <summary>
        /// Номер документа удостоверяющего личность
        /// </summary>
        [Required(ErrorMessage = "Поле номер документа обязательно для заполнения")]
        [CustomValidation(typeof(Client), "DocumentNumberValidate")]
        public string DocumentNumber { get; set; }

        /// <summary>
        /// Серия документа удостоверяющего личность
        /// </summary>
        public string DocumentSeries { get; set; }

        /// <summary>
        /// Дата выдачи документа удостоверяющего личность
        /// </summary>
        [RequiredDate(ErrorMessage = "Поле дата выдачи документа обязательно для заполнения")]
        public DateTime DocumentDate { get; set; }

        /// <summary>
        /// Кем выдан документ удостоверяющий личность
        /// </summary>
        [Required(ErrorMessage = "Поле кем выдан документ обязательно для заполнения")]
        public string DocumentProvider { get; set; }

        /// <summary>
        /// Примечание
        /// </summary>
        public string Note { get; set; }

        /// <summary>
        /// Дата удаления
        /// </summary>
        public DateTime? DeleteDate { get; set; }

        /// <summary>
        /// Файлы клиента
        /// </summary>
        public List<FileRow> Files { get; set; } = new List<FileRow>();

        /// <summary>
        /// Адрес регистрации
        /// </summary>
        [Required(ErrorMessage = "Поле адрес регистрации обязательно для заполнения")]
        public string RegistrationAddress { get; set; }

        /// <summary>
        /// Срок действия документа
        /// </summary>
        [RequiredDate(ErrorMessage = "Поле cрок действия документа обязательно для заполнения")]
        public DateTime DocumentDateExpire { get; set; }

        /// <summary>
        /// Адрес регистрации
        /// </summary>
        [Required(ErrorMessage = "Поле место рождения обязательно для заполнения")]
        public string BirthPlace { get; set; }



        public static ValidationResult DocumentNumberValidate(string value, ValidationContext context)
        {
            var client = (Client)context.ObjectInstance;

            if (string.IsNullOrEmpty(value))
{
                return ValidationResult.Success;
            }

            switch (client.DocumentType)
            {
                case DocumentType.IdentityCard:
                    return Regex.IsMatch(value, "^\\d{9}$") ?
                        ValidationResult.Success :
                        new ValidationResult("Поле номер документа должно содержать 9 цифр");
                case DocumentType.Passport:
                    return Regex.IsMatch(value, "^N\\d{7,8}$") ?
                        ValidationResult.Success :
                        new ValidationResult("Поле номер документа должно содержать N и 7 цифр");
                case DocumentType.LegalEntityRegistration:
                default:
                    return ValidationResult.Success;
            }
        }
    }
}