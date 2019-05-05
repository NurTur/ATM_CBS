namespace Pawnshop.Data.Models.CashOrders
{
    /// <summary>
    /// Тип кассового ордера
    /// </summary>
    public enum OrderType : short
    {
        /// <summary>
        /// Неизвестный
        /// </summary>
        Unknown = 0,
        /// <summary>
        /// Приход
        /// </summary>
        CashIn = 10,
        /// <summary>
        /// Расход
        /// </summary>
        CashOut = 20,
        /// <summary>
        /// Реализация
        /// </summary>
        Selling = 30
    }
}