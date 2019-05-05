using System;
using System.Collections.Generic;
using FluentScheduler;
using Pawnshop.Data.Access;
using Pawnshop.Data.Models.Notifications;
using Pawnshop.Web.Engine.MessageSenders;

namespace Pawnshop.Web.Engine.Jobs
{
    public class MessageSenderJob : IJob
    {
        private readonly NotificationRepository _notificationRepository;
        private readonly NotificationReceiverRepository _notificationReceiverRepository;
        private readonly NotificationLogRepository _notificationLogRepository;
        private readonly EmailSender _emailSender;
        private readonly SmsSender _smsSender;

        public MessageSenderJob(NotificationRepository notificationRepository,
            NotificationReceiverRepository notificationReceiverRepository, 
            NotificationLogRepository notificationLogRepository,
            EmailSender emailSender, SmsSender smsSender)
        {
            _notificationRepository = notificationRepository;
            _notificationReceiverRepository = notificationReceiverRepository;
            _notificationLogRepository = notificationLogRepository;
            _emailSender = emailSender;
            _smsSender = smsSender;
        }

        public void Execute()
        {
            while (true)
            {
                var receiver = _notificationReceiverRepository.Find();
                if (receiver == null) break;

                if (receiver.Notification.MessageType == MessageType.Email)
                {
                    if (string.IsNullOrEmpty(receiver.Client?.Email))
                    {
                        Callback(new SendResult { ReceiverId = receiver.Id, StatusMessage = "У получателя не заполнен email", Success = false });
                        continue;
                    }

                    _emailSender.Send(receiver.Notification.Subject, receiver.Notification.Message,
                        new List<MessageReceiver>
                        {
                            new MessageReceiver
                            {
                                ReceiverId = receiver.Id,
                                ReceiverName = receiver.Client.Fullname,
                                ReceiverAddress = receiver.Client.Email
                            }
                        }, Callback
                    );
                }
                else if (receiver.Notification.MessageType == MessageType.Sms)
                {
                    if (string.IsNullOrEmpty(receiver.Client?.MobilePhone))
                    {
                        Callback(new SendResult { ReceiverId = receiver.Id, StatusMessage = "У получателя не заполнен телефон", Success = false });
                        continue;
                    }

                    _smsSender.Send(receiver.Notification.Subject, receiver.Notification.Message,
                        new List<MessageReceiver>
                        {
                            new MessageReceiver
                            {
                                ReceiverId = receiver.Id,
                                ReceiverName = receiver.Client.Fullname,
                                ReceiverAddress = receiver.Client.MobilePhone
                            }
                        }, Callback
                    );
                }
            }
        }

        private void Callback(SendResult sendResult)
        {
            var receiver = _notificationReceiverRepository.Get(sendResult.ReceiverId);
            if (receiver == null) throw new InvalidOperationException();

            using (var transaction = _notificationReceiverRepository.BeginTransaction())
            {
                if (sendResult.Success) receiver.Status = NotificationStatus.Sent;
                receiver.TryCount++;
                _notificationReceiverRepository.Update(receiver);

                _notificationLogRepository.Insert(new NotificationLog
                {
                    NotificationReceiverId = sendResult.ReceiverId,
                    StatusMessage = sendResult.StatusMessage
                });

                _notificationRepository.Sent(receiver.NotificationId);

                transaction.Commit();
            }
        }
    }
}
