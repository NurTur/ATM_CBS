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
    public class UserRepository : RepositoryBase, IRepository<User>
    {
        public UserRepository(IUnitOfWork unitOfWork) : base(unitOfWork)
        {
        }

        public void Insert(User entity)
        {
            using (var transaction = BeginTransaction())
            {
                entity.Id = UnitOfWork.Session.ExecuteScalar<int>(@"
INSERT INTO Members (OrganizationId, CreateDate, Locked)
     VALUES (@organizationId, @createDate, @locked);

DECLARE @memberId INT;
    SET @memberId = SCOPE_IDENTITY();

INSERT INTO Users (Id, Login, IdentityNumber, Fullname, Email, Password, Salt, ExpireDate)
     VALUES (@memberId, @login, @identitynumber, @fullname, @email, '', '', @expireDate);

INSERT INTO MemberRelations (LeftMemberId, RightMemberId, RelationType)
     VALUES (@memberId, @memberId, 0);

SELECT @memberId", entity, UnitOfWork.Transaction);

                transaction.Commit();
            }
        }

        public void Update(User entity)
        {
            using (var transaction = BeginTransaction())
            {
                UnitOfWork.Session.Execute(@"
UPDATE Members SET Locked = @locked, OrganizationId = @organizationid
 WHERE Id = @id;
UPDATE Users SET Login = @login, IdentityNumber = @identitynumber, Fullname = @fullname, Email = @email, ExpireDate = @expireDate
 WHERE Id = @id", entity, UnitOfWork.Transaction);

                transaction.Commit();
            }
        }

        public void Delete(int id)
        {
            throw new System.NotImplementedException();
        }

        public User Get(int id)
        {
            return UnitOfWork.Session.QuerySingleOrDefault<User>(@"
SELECT *
  FROM Users
  JOIN Members ON Members.Id = Users.Id
 WHERE Users.Id = @id", new { id });
        }

        public User Find(object query)
        {
            if (query == null) throw new ArgumentNullException(nameof(query));

            var login = query.Val<string>("login");
            if (string.IsNullOrWhiteSpace(login))
                throw new InvalidOperationException();

            return UnitOfWork.Session.QueryFirstOrDefault<User>(@"
SELECT *
  FROM Users
  JOIN Members ON Members.Id = Users.Id
 WHERE Login LIKE @login OR IdentityNumber LIKE @login", new { login });
        }

        public List<User> List(ListQuery listQuery, object query = null)
        {
            if (listQuery == null) throw new ArgumentNullException(nameof(listQuery));

            var organizationId = query.Val<int?>("OrganizationId");
            var locked = query.Val<bool?>("Locked");

            var condition = listQuery.Like(
                BuildCondition(organizationId, locked),
                "Fullname", "Login");
            var order = listQuery.Order(string.Empty, new Sort
            {
                Name = "Fullname",
                Direction = SortDirection.Asc
            });
            var page = listQuery.Page();

            return UnitOfWork.Session.Query<User>($@"
SELECT *
  FROM Users
  JOIN Members ON Members.Id = Users.Id
{condition} {order} {page}", new
            {
                organizationId,
                locked,
                listQuery.Page?.Offset,
                listQuery.Page?.Limit,
                listQuery.Filter
            }).ToList();
        }

        public int Count(ListQuery listQuery, object query = null)
        {
            if (listQuery == null) throw new ArgumentNullException(nameof(listQuery));

            var organizationId = query.Val<int?>("OrganizationId");
            var locked = query.Val<bool?>("Locked");

            var condition = listQuery.Like(
                BuildCondition(organizationId, locked),
                "Fullname", "Login");

            return UnitOfWork.Session.ExecuteScalar<int>($@"
SELECT COUNT(*)
  FROM Users
  JOIN Members ON Members.Id = Users.Id
{condition}", new
            {
                organizationId,
                locked,
                listQuery.Filter
            });
        }

        public void GetPasswordAndSalt(int id, out string password, out string salt)
        {
            if (id <= 0) throw new ArgumentOutOfRangeException(nameof(id));

            var result = UnitOfWork.Session.QuerySingle(@"SELECT Password, Salt FROM Users where Id = @id", new { id });

            password = result.Password;
            salt = result.Salt;
        }

        public void SetPasswordAndSalt(int id, string password, string salt, int expireDay)
        {
            if (id <= 0) throw new ArgumentOutOfRangeException(nameof(id));
            if (string.IsNullOrEmpty(password))
                throw new ArgumentException("Value cannot be null or empty.", nameof(password));
            if (string.IsNullOrEmpty(salt))
                throw new ArgumentException("Value cannot be null or empty.", nameof(salt));

            var expireDate = DateTime.Now.Date.AddDays(expireDay);

            UnitOfWork.Session.Execute(@"
UPDATE Users SET Password = @password, Salt = @salt, ExpireDate = @expireDate
WHERE Id = @id", new { id, password, salt, expireDate }, UnitOfWork.Transaction);
        }

        private string BuildCondition(int? organizationId, bool? locked)
        {
            var result = new StringBuilder();
            var wasClause = false;

            if (organizationId.HasValue && organizationId>0)
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