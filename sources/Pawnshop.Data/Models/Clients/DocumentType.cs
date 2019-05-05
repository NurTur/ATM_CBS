namespace Pawnshop.Data.Models.Clients
{
    /// <summary>
    /// Тип документа удостоверяющего личность
    /// </summary>
    public enum DocumentType : short
    {
        /// <summary>
        /// Удостоверение личности
        /// </summary>
        IdentityCard = 10,
        /// <summary>
        /// Паспорт
        /// </summary>
        Passport = 20,
        /// <summary>
        /// Свидетельство о государственной регистрации юридического лица
        /// </summary>
        LegalEntityRegistration = 30,
        /// <summary>
        /// Другое
        /// </summary>
        Another = 40
    }
}