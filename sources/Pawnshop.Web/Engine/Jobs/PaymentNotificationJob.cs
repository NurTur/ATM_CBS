using System;
using FluentScheduler;
using Microsoft.Extensions.Options;
using Pawnshop.Core.Options;
using Pawnshop.Data.Access;
using Pawnshop.Data.Models.Notifications;

namespace Pawnshop.Web.Engine.Jobs
{
    public class PaymentNotificationJob : IJob
    {
        private readonly EnviromentAccessOptions _options;
        private readonly NotificationRepository _notificationRepository;

        public PaymentNotificationJob(IOptions<EnviromentAccessOptions> options, NotificationRepository notificationRepository)
        {
            _options = options.Value;
            _notificationRepository = notificationRepository;
        }

        public void Execute()
        {
            if (!_options.PaymentNotification) return;

            //Изменение текста на Наурыз
            var NewYear = new DateTime(DateTime.Now.Year, 3, 20);
            var notification = new Notification();

            if (DateTime.Now.Date == NewYear.Date)
            {
                notification.MessageType = MessageType.Sms;
                notification.Subject = "Оплата кредита";
                notification.Message = $"Uvazhaemiy klient, v svyazi s prazdnikami {DateTime.Now.AddDays(2).ToString("dd.MM.yyyy")} ne rabotaem.Vam neobhodimo oplatit’ kredit {DateTime.Now.AddDays(1).ToString("dd.MM.yyyy")}. V budni 9:00 - 19:00, vyhodnye 10:00 - 15:00 Info: 7788";
                notification.Status = NotificationStatus.ForSend;
            }
            else
            {
                notification.MessageType = MessageType.Sms;
                notification.Subject = "Оплата кредита";
                notification.Message = $"Uvazhaemiy klient, napominaem, chto {DateTime.Now.AddDays(2).ToString("dd.MM.yyyy")} Vam neobhodimo oplatit’ kredit. V budni 9:00 - 19:00, vyhodnye 10:00 - 15:00 Info: 7788";
                notification.Status = NotificationStatus.ForSend;
            }
            

            _notificationRepository.Select(notification);
        }
    }
}
