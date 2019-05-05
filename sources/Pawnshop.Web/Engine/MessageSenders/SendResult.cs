namespace Pawnshop.Web.Engine.MessageSenders
{
    public class SendResult
    {
        public int ReceiverId { get; set; }

        public bool Success { get; set; }

        public string StatusMessage { get; set; } = "Отправка прошла успешно";
    }
}