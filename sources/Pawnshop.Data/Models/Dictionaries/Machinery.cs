using System;
using System.ComponentModel.DataAnnotations;

namespace Pawnshop.Data.Models.Dictionaries
{
    /// <summary>
    /// Спецтехника
    /// </summary>
    public class Machinery : Position
    {
        private string _mark;

        /// <summary>
        /// Марка
        /// </summary>
        [Required(ErrorMessage = "Поле марка обязательно для заполнения")]
        public string Mark
        {
            get { return _mark.ToUpper(); }
            set { _mark = value.ToUpper(); }
        }

        private string _model;

        /// <summary>
        /// Модель
        /// </summary>
        [Required(ErrorMessage = "Поле модель обязательно для заполнения")]
        public string Model
        {
            get { return _model.ToUpper(); }
            set { _model = value.ToUpper(); }
        }

        /// <summary>
        /// Год выпуска
        /// </summary>
        [Range(1950, 2020, ErrorMessage = "Поле год выпуска должно иметь значение от 1950 до 2020")]
        public int ReleaseYear { get; set; }

        private string _transportNumber;

        /// <summary>
        /// Гос номер
        /// </summary>
        [Required(ErrorMessage = "Поле гос номер обязательно для заполнения")]
        public string TransportNumber
        {
            get { return _transportNumber.ToUpper(); }
            set { _transportNumber = value.ToUpper(); }
        }

        /// <summary>
        /// Номер двигателя
        /// </summary>
        public string MotorNumber { get; set; }

        /// <summary>
        /// Номер кузова
        /// </summary>
        public string BodyNumber { get; set; }

        /// <summary>
        /// Номер техпаспорта
        /// </summary>
        [Required(ErrorMessage = "Поле номер техпаспорта обязательно для заполнения")]
        public string TechPassportNumber { get; set; }

        /// <summary>
        /// Дата техпаспорта
        /// </summary>
        public DateTime? TechPassportDate { get; set; }

        private string _color;

        /// <summary>
        /// Цвет
        /// </summary>
        [Required(ErrorMessage = "Поле цвет обязательно для заполнения")]
        public string Color
        {
            get { return _color.ToUpper(); }
            set { _color = value.ToUpper(); }
        }
    }
}
