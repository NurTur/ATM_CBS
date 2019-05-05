using Pawnshop.Core;
using Pawnshop.Core.Impl;
using Pawnshop.Data.Models.Dictionaries;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Pawnshop.Core.Queries;
using Dapper;

namespace Pawnshop.Data.Access
{
    public class BankRepository : RepositoryBase, IRepository<Bank>
    {
        public BankRepository(IUnitOfWork unitOfWork) : base(unitOfWork)
        {
        }

        public List<Bank> List(ListQuery listQuery, object query = null)
        {
            if (listQuery == null) throw new ArgumentNullException(nameof(listQuery));

            var condition = listQuery.Like(string.Empty, "Name");
            var order = listQuery.Order(string.Empty, new Sort
            {
                Name = "Name",
                Direction = SortDirection.Asc
            });
            var page = listQuery.Page();

            return UnitOfWork.Session.Query<Bank>($@"
SELECT *
  FROM Banks
{condition} {order} {page}", new
            {
                listQuery.Page?.Offset,
                listQuery.Page?.Limit,
                listQuery.Filter
            }).ToList();
        }

        public Bank Find(object query)
        {
            throw new NotImplementedException();
        }

        public int Count(ListQuery listQuery, object query = null)
        {
            throw new NotImplementedException();
        }

        public Bank Get(int id)
        {
            throw new NotImplementedException();
        }

        public void Delete(int id)
        {
            throw new NotImplementedException();
        }

        public void Insert(Bank entity)
        {
            throw new NotImplementedException();
        }

        public void Update(Bank entity)
        {
            throw new NotImplementedException();
        }
    }
}
