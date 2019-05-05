using System;
using System.Collections.Generic;
using System.Linq;
using Pawnshop.Core;
using Pawnshop.Core.Impl;
using Pawnshop.Data.Models.Dictionaries;
using Dapper;
using Pawnshop.Core.Queries;
using Pawnshop.Data.Models.Contracts;

namespace Pawnshop.Data.Access
{
    public class CategoryRepository : RepositoryBase, IRepository<Category>
    {
        public CategoryRepository(IUnitOfWork unitOfWork) : base(unitOfWork)
        {
        }

        public void Insert(Category entity)
        {
            using (var transaction = BeginTransaction())
            {
                entity.Id = UnitOfWork.Session.QuerySingleOrDefault<int>(@"
INSERT INTO Categories ( Name, CollateralType ) VALUES ( @Name, @CollateralType )
SELECT SCOPE_IDENTITY()",
                    entity, UnitOfWork.Transaction);

                transaction.Commit();
            }
        }

        public void Update(Category entity)
        {
            using (var transaction = BeginTransaction())
            {
                UnitOfWork.Session.Execute(@"UPDATE Categories SET Name = @Name, CollateralType = @CollateralType WHERE Id = @Id", entity, UnitOfWork.Transaction);

                transaction.Commit();
            }
        }

        public void Delete(int id)
        {
            using (var transaction = BeginTransaction())
            {
                UnitOfWork.Session.Execute("DELETE FROM Categories WHERE Id = @id", new { id = id }, UnitOfWork.Transaction);
                transaction.Commit();
            }
        }

        public Category Get(int id)
        {
            return UnitOfWork.Session.QuerySingleOrDefault<Category>(@"
SELECT *
FROM Categories
WHERE Id = @id", new { id = id });
        }

        public Category Find(object query)
        {
            throw new NotImplementedException();
        }

        public List<Category> List(ListQuery listQuery, object query = null)
        {
            if (listQuery == null) throw new ArgumentNullException(nameof(listQuery));

            var collateralType = query?.Val<CollateralType?>("CollateralType");
            var pre = collateralType.HasValue ? "CollateralType = @collateralType" : string.Empty;

            var condition = listQuery.Like(pre, "Name");
            var order = listQuery.Order(string.Empty, new Sort
            {
                Name = "Name",
                Direction = SortDirection.Asc
            });
            var page = listQuery.Page();

            return UnitOfWork.Session.Query<Category>($@"
SELECT *
  FROM Categories
{condition} {order} {page}", new
            {
                collateralType,
                listQuery.Page?.Offset,
                listQuery.Page?.Limit,
                listQuery.Filter
            }).ToList();
        }

        public int Count(ListQuery listQuery, object query = null)
        {
            if (listQuery == null) throw new ArgumentNullException(nameof(listQuery));

            var collateralType = query.Val<short?>("collateralType");
            var pre = collateralType.HasValue ? "CollateralType = @collateralType" : string.Empty;

            var condition = listQuery.Like(pre, "Name");

            return UnitOfWork.Session.ExecuteScalar<int>($@"
SELECT COUNT(*)
  FROM Categories
{condition}", new
            {
                collateralType,
                listQuery.Filter
            });
        }

        public int RelationCount(int categoryId)
        {
            return UnitOfWork.Session.ExecuteScalar<int>(@"
SELECT COUNT(*)
FROM ContractPositions
WHERE CategoryId = @categoryId", new { categoryId = categoryId });
        }
    }
}