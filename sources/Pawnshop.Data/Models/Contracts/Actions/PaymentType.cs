namespace Pawnshop.Data.Models.Contracts.Actions
{
    public enum PaymentType : short
    {
        /// <summary>
        /// Погашение основного долга
        /// </summary>
        Debt = 10,
        /// <summary>
        /// Погашения вознаграждения
        /// </summary>
        Loan = 20,
        /// <summary>
        /// Погашение штрафа
        /// </summary>
        Penalty = 30
    }
}