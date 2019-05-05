using System;
using System.Collections.Generic;
using System.Linq;
using Dapper;
using Pawnshop.Core;
using Pawnshop.Core.Impl;
using Pawnshop.Core.Queries;
using Pawnshop.Data.Models.Clients;

namespace Pawnshop.Data.Access
{
    public class ClientRepository : RepositoryBase, IRepository<Client>
    {
        public ClientRepository(IUnitOfWork unitOfWork) : base(unitOfWork)
        {
        }

        public void Insert(Client entity)
        {
            throw new NotImplementedException();
        }

        public void Update(Client entity)
        {
            throw new NotImplementedException();
        }

        public void Delete(int id)
        {
            throw new NotImplementedException();
        }

        public Client Get(int id)
        {
            return UnitOfWork.Session.QuerySingleOrDefault<Client>(@"
SELECT *
  FROM Clients
WHERE Id = @id", new { id });
        }

        public Client Find(object query)
        {
            throw new NotImplementedException();
        }

        public List<Client> List(ListQuery listQuery, object query = null)
        {
            if (listQuery == null) throw new ArgumentNullException(nameof(listQuery));

            var condition = listQuery.Like("DeleteDate IS NULL", "Fullname", "IdentityNumber");
            var order = listQuery.Order(string.Empty, new Sort
            {
                Name = "Fullname",
                Direction = SortDirection.Asc
            });
            var page = listQuery.Page();

            return UnitOfWork.Session.Query<Client>($@"
SELECT *
  FROM Clients
{condition} {order} {page}", new
            {
                listQuery.Page?.Offset,
                listQuery.Page?.Limit,
                listQuery.Filter
            }).ToList();
        }

        public int Count(ListQuery listQuery, object query = null)
        {
            if (listQuery == null) throw new ArgumentNullException(nameof(listQuery));

            var condition = listQuery.Like("DeleteDate IS NULL", "Fullname", "IdentityNumber");

            return UnitOfWork.Session.ExecuteScalar<int>($@"
SELECT COUNT(*)
  FROM Clients
{condition}", new
            {
                listQuery.Filter
            });
        }
    }
}