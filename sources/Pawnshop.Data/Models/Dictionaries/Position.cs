using Pawnshop.Core;
using Pawnshop.Data.Models.Contracts;
using System.ComponentModel.DataAnnotations;

namespace Pawnshop.Data.Models.Dictionaries
{
    /// <summary>
    /// Позиция
    /// </summary>
    public class Position : IEntity
    {
        /// <summary>
        /// Идентификатор
        /// </summary>
        public int Id { get; set; }

        private string _name;

        /// <summary>
        /// Наименование
        /// </summary>
        [Required(ErrorMessage = "Поле наименование обязательно для заполнения")]
        public string Name
        {
            get { return _name.ToUpper(); }
            set { _name = value.ToUpper(); }
        }

        /// <summary>
        /// Вид залога
        /// </summary>
        public CollateralType CollateralType { get; set; }
    }
}
