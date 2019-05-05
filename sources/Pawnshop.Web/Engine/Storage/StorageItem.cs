using System.IO;

namespace Pawnshop.Web.Engine.Storage
{
    public class StorageItem
    {
        public string Name { get; set; }

        public Stream Content { get; set; }
    }
}