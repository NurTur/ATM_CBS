namespace Pawnshop.Data.Models.CashOrders
{
    /// <summary>
    /// Статус кассового ордера
    /// </summary>
    public enum OrderStatus : short
    {
        /// <summary>
        /// Ожидает
        /// </summary>
        Waiting = 0,
        /// <summary>
        /// Согласован
        /// </summary>
        Approved = 10,
        /// <summary>
        /// Отклонен
        /// </summary>
        Prohibited = 20
    }
}