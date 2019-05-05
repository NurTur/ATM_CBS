using Pawnshop.Core.Queries;

namespace Pawnshop.Web.Models.List
{
    public class ListQueryModel<T> : ListQuery
    {
        public T Model { get; set; }
    }
}