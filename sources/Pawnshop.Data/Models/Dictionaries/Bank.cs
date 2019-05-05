namespace Pawnshop.Data.Models.Dictionaries
{
    /// <summary>
    /// Банк
    /// </summary>            
    public class Bank : IDictionary
    {
        /// <summary>
        /// Идентификатор
        /// </summary>            
        public int Id { get; set; }

        /// <summary>
        /// Наименование
        /// </summary>            
        public string Name { get; set; }
    }
}