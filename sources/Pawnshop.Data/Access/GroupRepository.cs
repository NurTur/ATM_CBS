using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Dapper;
using Pawnshop.Core;
using Pawnshop.Core.Impl;
using Pawnshop.Core.Queries;
using Pawnshop.Data.Models.Membership;

namespace Pawnshop.Data.Access
{
    public class GroupRepository : RepositoryBase, IRepository<Group>
    {
        public GroupRepository(IUnitOfWork unitOfWork) : base(unitOfWork)
        {
        }

        public void Insert(Group entity)
        {
            using (var transaction = BeginTransaction())
            {
                entity.Id = UnitOfWork.Session.ExecuteScalar<int>(@"
INSERT INTO Members (OrganizationId, CreateDate, Locked)
     VALUES (@organizationId, @createDate, @locked);

DECLARE @memberId INT = @@IDENTITY;

INSERT INTO Groups (Id, Name, DisplayName, Type, Configuration, BitrixCategoryId)
     VALUES (@memberId, @name, @displayName, @type, @configuration, BitrixCategoryId);

INSERT INTO MemberRelations (LeftMemberId, RightMemberId, RelationType)
     VALUES (@memberId, @memberId, 0);

SELECT @memberId", entity, UnitOfWork.Transaction);

                transaction.Commit();
            }
        }

        public void Update(Group entity)
        {
            using (var transaction = BeginTransaction())
            {
                UnitOfWork.Session.Execute(@"
UPDATE Members SET Locked = @locked
 WHERE Id = @id;
UPDATE Groups SET Name = @name, DisplayName = @displayName, Type = @type, Configuration = @configuration, BitrixCategoryId=@bitrixCategoryId
 WHERE Id = @id", entity, UnitOfWork.Transaction);

                transaction.Commit();
            }
        }

        public void Delete(int id)
        {
            throw new System.NotImplementedException();
        }

        public Group Get(int id)
        {
            return UnitOfWork.Session.QuerySingleOrDefault<Group>(@"
SELECT *
  FROM Groups
  JOIN Members ON Members.Id = Groups.Id
 WHERE Groups.Id = @id", new { id }, UnitOfWork.Transaction);
        }

        public Group Find(object query)
        {
            throw new System.NotImplementedException();
        }

        public List<Group> List(ListQuery listQuery, object query = null)
        {
            if (listQuery == null) throw new ArgumentNullException(nameof(listQuery));

            var organizationId = query.Val<int?>("organizationId");
            var locked = query.Val<bool?>("locked");

            var condition = listQuery.Like(
                BuildCondition(organizationId, locked),
                "Name", "DisplayName");
            var order = listQuery.Order(string.Empty, new Sort
            {
                Name = "DisplayName",
                Direction = SortDirection.Asc
            });
            var page = listQuery.Page();

            return UnitOfWork.Session.Query<Group>($@"
SELECT *
  FROM Groups
  JOIN Members ON Members.Id = Groups.Id
{condition} {order} {page}", new
            {
                organizationId,
                locked,
                listQuery.Page?.Offset,
                listQuery.Page?.Limit,
                listQuery.Filter
            }, UnitOfWork.Transaction).ToList();
        }

        public int Count(ListQuery listQuery, object query = null)
        {
            if (listQuery == null) throw new ArgumentNullException(nameof(listQuery));

            var organizationId = query.Val<int?>("organizationId");
            var locked = query.Val<bool?>("locked");

            var condition = listQuery.Like(
                BuildCondition(organizationId, locked),
                "Name", "DisplayName");

            return UnitOfWork.Session.ExecuteScalar<int>($@"
SELECT COUNT(*)
  FROM Groups
  JOIN Members ON Members.Id = Groups.Id
{condition}", new
            {
                organizationId,
                locked,
                listQuery.Filter
            }, UnitOfWork.Transaction);
        }

        private string BuildCondition(int? organizationId, bool? locked)
        {
            var result = new StringBuilder();
            var wasClause = false;

            if (organizationId.HasValue)
            {
                result.Append("OrganizationId = @organizationId");
                wasClause = true;
            }
            if (locked.HasValue)
            {
                if (wasClause) result.Append(" AND ");
                result.Append("Locked = @locked");
            }

            return result.ToString();
        }
    }
}