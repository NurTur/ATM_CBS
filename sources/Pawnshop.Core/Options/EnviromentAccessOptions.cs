namespace Pawnshop.Core.Options
{
    public class EnviromentAccessOptions
    {
        public string DatabaseConnectionString { get; set; }
        public string StorageConnectionString { get; set; }
        public int ExpireDay { get; set; }
        public bool PaymentNotification { get; set; }
        public string NskEmailAddress { get; set; }
        public string NskEmailName { get; set; }
        public string NskEmailCopyAddress { get; set; }
        public string NskEmailCopyName { get; set; }
        public string InsuranseManagerAddress { get; set; }
        public string InsuranseManagerName { get; set; }
    }
}