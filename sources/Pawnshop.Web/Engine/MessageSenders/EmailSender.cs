using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MailKit.Net.Smtp;
using MimeKit;
using Pawnshop.Core.Exceptions;

namespace Pawnshop.Web.Engine.MessageSenders
{
    public class EmailSender : IMessageSender
    {
        public void Send(string subject, string message, List<MessageReceiver> receivers, Action<SendResult> callback)
        {
            foreach (var receiver in receivers)
            {
                try
                {
                    SendEmail(subject, message, receiver);
                    callback(new SendResult { ReceiverId = receiver.ReceiverId, Success = true });
                }
                catch (Exception e)
                {
                    callback(new SendResult { ReceiverId = receiver.ReceiverId, StatusMessage = e.Message, Success = false });
                }
            }
        }

        public void SendEmail(string subject, string message, MessageReceiver receiver)
        {
            if (string.IsNullOrWhiteSpace(receiver.ReceiverAddress)) throw new PawnshopApplicationException("Не заполнен адрес электронной почты");

            var emailMessage = new MimeMessage();
            emailMessage.From.Add(new MailboxAddress("ТАС КРЕДИТ Компания", "no-reply@tascredit.kz"));
            emailMessage.To.Add(new MailboxAddress(receiver.ReceiverName, receiver.ReceiverAddress));
            emailMessage.Cc.AddRange(receiver.CopyAddresses.Select(a => new MailboxAddress(a.ReceiverName, a.ReceiverAddress)).ToList());

            emailMessage.Subject = subject;
            emailMessage.Body = new TextPart(MimeKit.Text.TextFormat.Html)
            {
                Text = message
            };

            using (var client = new SmtpClient())
            {
                client.ServerCertificateValidationCallback = (s, c, h, e) => true;
                client.Connect("smtp.mail.ru", 465, true);
                client.Authenticate("no-reply@tascredit.kz", "Arike2018");
                client.Send(emailMessage);
                client.Disconnect(true);
            }
        }
    }
}