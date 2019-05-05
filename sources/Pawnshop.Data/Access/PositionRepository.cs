using System;
using System.Collections.Generic;
using Pawnshop.Core;
using Pawnshop.Core.Impl;
using Pawnshop.Core.Queries;
using Pawnshop.Data.Models.Dictionaries;
using Dapper;
using System.Linq;
using Pawnshop.Data.Models.Contracts;

namespace Pawnshop.Data.Access
{
    public class PositionRepository : RepositoryBase, IRepository<Position>
    {
        public PositionRepository(IUnitOfWork unitOfWork) : base(unitOfWork)
        {
        }

        public void Insert(Position entity)
        {
            throw new NotImplementedException();
        }

        public void Update(Position entity)
        {
            throw new NotImplementedException();
        }

        public void Delete(int id)
        {
            throw new NotImplementedException();
        }

        public Position Get(int id)
        {
            return UnitOfWork.Session.QuerySingleOrDefault<Position>(@"
SELECT *
FROM Positions
WHERE Id = @id", new { id });
        }

        public Position Find(object query)
        {
            throw new NotImplementedException();
        }

        public List<Position> List(ListQuery listQuery, object query = null)
        {
            if (listQuery == null) throw new ArgumentNullException(nameof(listQuery));

            var collateralType = query?.Val<CollateralType?>("CollateralType");
            var pre = collateralType.HasValue ? "CollateralType = @collateralType" : string.Empty;

            var condition = listQuery.Like(pre, "name");
            var order = listQuery.Order(string.Empty, new Sort
            {
                Name = "name",
                Direction = SortDirection.Asc
            });
            var page = listQuery.Page();

            return UnitOfWork.Session.Query<Position>($@"
SELECT *
FROM Positions
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

            var collateralType = query?.Val<CollateralType?>("CollateralType");
            var pre = collateralType.HasValue ? "CollateralType = @collateralType" : string.Empty;

            var condition = listQuery.Like(pre, "name");

            return UnitOfWork.Session.ExecuteScalar<int>($@"
SELECT COUNT(*)
FROM Positions
{condition}", new
            {
                collateralType,
                listQuery.Filter
            });
        }
    }
}