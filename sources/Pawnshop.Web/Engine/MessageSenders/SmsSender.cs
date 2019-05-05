using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using Newtonsoft.Json;
using Pawnshop.Core.Exceptions;

namespace Pawnshop.Web.Engine.MessageSenders
{
    public class SmsSender : IMessageSender
    {
        public void Send(string subject, string message, List<MessageReceiver> receivers, Action<SendResult> callback)
        {
            foreach (var receiver in receivers)
            {
                try
                {
                    var statusMessage = SendSms(message, receiver);
                    callback(new SendResult { ReceiverId = receiver.ReceiverId, StatusMessage = statusMessage, Success = true });
                }
                catch (Exception e)
                {
                    callback(new SendResult { ReceiverId = receiver.ReceiverId, StatusMessage = e.Message, Success = false });
                }
            }
        }

        public string SendSms(string message, MessageReceiver receiver)
        {
            if (string.IsNullOrWhiteSpace(receiver.ReceiverAddress)) throw new PawnshopApplicationException("Не заполнен телефонный номер");

            var encodeValue = UTF8Encoding.UTF8.GetBytes("TASCREDIT:Rbvfkbyf0202");
            var hash = Convert.ToBase64String(encodeValue);
            var url = "https://api.infobip.com/sms/1/text/single";
            var request = new
            {
                from = "TasCredit",
                to = receiver.ReceiverAddress,
                text = message
            };

            using (var httpClient = new HttpClient())
            {
                httpClient.Timeout = TimeSpan.FromMinutes(1);
                httpClient.MaxResponseContentBufferSize = 10000000;
                httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", hash);

                var response = httpClient.PostAsync(url, new StringContent(JsonConvert.SerializeObject(request), Encoding.UTF8, "application/json")).Result;
                if (response.IsSuccessStatusCode)
                {
                    return response.Content.ReadAsStringAsync().Result;
                }
                else
                {
                    var error = response.Content.ReadAsStringAsync().Result;
                    throw new Exception(error);
                }
            }
        }
    }
}
