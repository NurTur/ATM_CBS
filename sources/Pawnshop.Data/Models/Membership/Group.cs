namespace Pawnshop.Data.Models.Membership
{
    /// <summary>
    /// Группа
    /// </summary>
    public class Group : Member
    {
        /// <summary>
        /// Системное имя группы
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// Отображаемое имя группы
        /// </summary>
        public string DisplayName { get; set; }

        /// <summary>
        /// Флаг филиала
        /// </summary>
        public GroupType Type { get; set; }

        /// <summary>
        /// Конфигурация
        /// </summary>
        public Configuration Configuration { get; set; }

        /// <summary>
        /// Идентификатор категории сделок в Bitrix24
        /// </summary>
        public int BitrixCategoryId { get; set; }
    }
}