using FluentScheduler;

namespace Pawnshop.Web.Engine.Jobs
{
    public class JobRegistry : Registry
    {
        public JobRegistry()
        {
            Schedule<MessageSenderJob>().NonReentrant().ToRunNow().AndEvery(5).Minutes();
            Schedule<PaymentNotificationJob>().NonReentrant().ToRunOnceAt(9, 30).AndEvery(1).Days();
        }
    }
}
