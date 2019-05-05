using System.ComponentModel.DataAnnotations;

namespace Pawnshop.Data.Models.Notifications
{
    public enum NotificationStatus : short
    {
        /// <summary>
        /// Черновик
        /// </summary>
        [Display(Name = "Черновик")]
        Draft = 0,
        
        /// <summary>
        /// Для отправки
        /// </summary>
        [Display(Name = "Для отправки")]
        ForSend = 10,

        /// <summary>
        /// Отправлено
        /// </summary>
        [Display(Name = "Отправлено")]
        Sent = 20
    }
}