using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Dapper;
using Pawnshop.Core;
using Pawnshop.Core.Impl;
using Pawnshop.Core.Queries;
using Pawnshop.Data.Models.Dictionaries;

namespace Pawnshop.Data.Access
{
    public class ClientBlackListReasonRepository : RepositoryBase, IRepository<ClientBlackListReason>
    {
        public ClientBlackListReasonRepository(IUnitOfWork unitOfWork) : base(unitOfWork)
        {
        }

        public void Insert(ClientBlackListReason entity)
        {
            using (var transaction = BeginTransaction())
            {
                entity.Id = UnitOfWork.Session.ExecuteScalar<int>(@"
INSERT INTO ClientBlackListReasons(Name, AllowNewContracts)
VALUES(@Name, @AllowNewContracts)
SELECT SCOPE_IDENTITY()", entity,UnitOfWork.Transaction);
                transaction.Commit();
            }
        }

        public void Update(ClientBlackListReason entity)
        {
            using (var transaction = BeginTransaction())
            {
                UnitOfWork.Session.Execute(@"
UPDATE ClientBlackListReasons SET Name=@Name,AllowNewContracts=@AllowNewContracts
WHERE Id=@id", entity,UnitOfWork.Transaction);
                transaction.Commit();
            }
        }
        public void Delete(int id)
        {
            throw new NotImplementedException();
        }

        public ClientBlackListReason Get(int id)
        {
            return UnitOfWork.Session.QuerySingleOrDefault<ClientBlackListReason>(@"
SELECT * 
FROM ClientBlackListReasons
WHERE Id=@id", new { id });
        }

        public ClientBlackListReason Find(object query)
        {
            throw new NotImplementedException();
        }

        public List<ClientBlackListReason> List(ListQuery listQuery, object query = null)
        {
            return UnitOfWork.Session.Query<ClientBlackListReason>(@"SELECT * FROM ClientBlackListReasons").ToList();
        }

        public int Count(ListQuery listQuery, object query = null)
        {
            return UnitOfWork.Session.ExecuteScalar<int>(@"SELECT COUNT(*) FROM ClientBlackListReasons");
        }






    }
}
