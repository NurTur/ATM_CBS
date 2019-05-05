using System.IO;
using System.Threading.Tasks;

namespace Pawnshop.Web.Engine.Storage
{
    public interface IStorage
    {
        Task<string> Save(Stream stream);

        Task<string> Save(Stream stream, ContainerName containerName, string fileName);

        Task<Stream> Load(string name);

        Task<Stream> Load(string name, ContainerName containerName);
    }
}