﻿using System;
using System.Collections.Generic;
using System.Linq;
using Dapper;
using Pawnshop.Core;
using Pawnshop.Core.Impl;
using Pawnshop.Data.Models.Dictionaries;
using Pawnshop.Data.Models.Membership;

namespace Pawnshop.Data.Access
{
    public class MemberRepository : RepositoryBase
    {
        public MemberRepository(IUnitOfWork unitOfWork) : base(unitOfWork)
        {
        }

        public List<Role> Roles(int memberId, bool all)
        {
            if (memberId <= 0) throw new ArgumentOutOfRangeException(nameof(memberId));

            if (!all)
            {
                return UnitOfWork.Session.Query<Role>(@"
   SELECT Roles.*
     FROM MemberRoles
     JOIN Roles ON Roles.Id = MemberRoles.RoleId
    WHERE MemberRoles.MemberId = @memberId",
                    new { memberId }, UnitOfWork.Transaction).ToList();
            }

            return UnitOfWork.Session.Query<Role>(@"
   SELECT DISTINCT Roles.*
     FROM MemberRelations as relation

     JOIN Members AS rightMember            ON rightMember.Id = relation.RightMemberId
LEFT JOIN MemberRelations AS sourceRelation ON sourceRelation.Id = relation.SourceId
LEFT JOIN Members AS sourceMember           ON sourceMember.Id = sourceRelation.RightMemberId

     JOIN MemberRoles ON MemberRoles.MemberId = relation.RightMemberId
     JOIN Roles       ON Roles.Id = MemberRoles.RoleId

    WHERE relation.LeftMemberId = @memberId AND
          rightMember.Locked = @locked AND
          (sourceMember.Locked = @locked OR sourceMember.Locked IS NULL)",
                new { memberId, locked = false }, UnitOfWork.Transaction).ToList();
        }

        public List<Group> Groups(int memberId, MemberRelationType? relationType)
        {
            if (memberId <= 0) throw new ArgumentOutOfRangeException(nameof(memberId));

            var relationCondition = string.Empty;
            if (relationType.HasValue)
            {
                relationCondition = "AND relation.RelationType = @relationType";
            }

            var order = "ORDER BY DisplayName";
            return UnitOfWork.Session.Query<Group>($@"
   SELECT DISTINCT rightGroup.*, rightMember.*
     FROM MemberRelations as relation

     JOIN Members AS rightMember            ON rightMember.Id = relation.RightMemberId
LEFT JOIN MemberRelations AS sourceRelation ON sourceRelation.Id = relation.SourceId
LEFT JOIN Members AS sourceMember           ON sourceMember.Id = sourceRelation.RightMemberId

     JOIN Groups AS rightGroup ON rightGroup.Id = rightMember.Id

    WHERE relation.LeftMemberId = @memberId AND
          rightMember.Locked = @locked AND
          (sourceMember.Locked = @locked OR sourceMember.Locked IS NULL) {relationCondition} {order}",
                new { memberId, locked = false, relationType }, UnitOfWork.Transaction).ToList();
        }

        public void InsertRoles(int memberId, List<Role> roles)
        {
            if (roles == null) throw new ArgumentNullException(nameof(roles));
            if (memberId <= 0) throw new ArgumentOutOfRangeException(nameof(memberId));

            UnitOfWork.Session.Execute(@"
INSERT INTO MemberRoles (MemberId, RoleId)
     VALUES (@memberId, @roleId)",
                roles.Select(r => new { memberId, roleId = r.Id }).ToArray(), UnitOfWork.Transaction);
        }


        public void DeleteRoles(int memberId, List<Role> roles)
        {
            if (roles == null) throw new ArgumentNullException(nameof(roles));
            if (memberId <= 0) throw new ArgumentOutOfRangeException(nameof(memberId));

            UnitOfWork.Session.Execute(@"
DELETE FROM MemberRoles
      WHERE MemberId = @memberId AND RoleId IN @roles",
                new { memberId, roles = roles.Select(r => r.Id).ToArray() }, UnitOfWork.Transaction);
        }

        public void InsertGroups(int memberId, List<Group> groups)
        {
            if (groups == null) throw new ArgumentNullException(nameof(groups));
            if (memberId <= 0) throw new ArgumentOutOfRangeException(nameof(memberId));

            using (var transaction = UnitOfWork.BeginTransaction())
            {
                UnitOfWork.Session.Execute(@"
INSERT INTO MemberRelations (LeftMemberId, RightMemberId, RelationType, SourceId)
     VALUES (@memberId, @groupId, 10, null);

    DECLARE @relationId INT = @@IDENTITY;

INSERT INTO MemberRelations (LeftMemberId, RightMemberId, RelationType, SourceId)
     SELECT @memberId, groupRelations.RightMemberId, 20, groupRelations.Id
       FROM MemberRelations groupRelations
      WHERE groupRelations.LeftMemberId = @groupId AND RelationType = 10;

INSERT INTO MemberRelations (LeftMemberId, RightMemberId, RelationType, SourceId)
     SELECT @memberId, groupRelations.RightMemberId, 20, groupRelations.SourceId
       FROM MemberRelations groupRelations
      WHERE groupRelations.LeftMemberId = @groupId AND RelationType = 20;

INSERT INTO MemberRelations (LeftMemberId, RightMemberId, RelationType, SourceId)
     SELECT subRelations.LeftMemberId, @groupId, 20, @relationId
       FROM MemberRelations subRelations
      WHERE subRelations.RightMemberId = @memberId AND (subRelations.RelationType = 10 OR subRelations.RelationType = 20);",
                    groups.Select(g => new { memberId, groupId = g.Id }).ToArray(),
                    UnitOfWork.Transaction);

                transaction.Commit();
            }
        }

        public void DeleteGroups(int memberId, List<Group> groups)
        {
            if (groups == null) throw new ArgumentNullException(nameof(groups));
            if (memberId <= 0) throw new ArgumentOutOfRangeException(nameof(memberId));

            using (var transaction = UnitOfWork.BeginTransaction())
            {
                UnitOfWork.Session.Execute(@"
DECLARE @relationId INT;

 SELECT @relationId = Id
   FROM MemberRelations
  WHERE LeftMemberId = @memberId AND RightMemberId = @groupId AND RelationType = 10;

 DELETE FROM MemberRelations WHERE SourceId = @relationId;

 DELETE FROM MemberRelations WHERE Id = @relationId;",
                    groups.Select(g => new { memberId, groupId = g.Id }).ToArray(),
                    UnitOfWork.Transaction);

                transaction.Commit();
            }
        }

        public Group FindBranch(int memberId, int branchId)
        {
            if (memberId <= 0) throw new ArgumentOutOfRangeException(nameof(memberId));
            if (branchId <= 0) throw new ArgumentOutOfRangeException(nameof(branchId));

            return UnitOfWork.Session.QueryFirstOrDefault<Group>(@"
SELECT m.*, g.*
  FROM MemberRelations mr
  JOIN Members m ON m.Id = mr.RightMemberId
  JOIN Groups g ON g.Id = m.Id
 WHERE LeftMemberId = @memberId AND RightMemberId = @branchId", new {memberId, branchId}, UnitOfWork.Transaction);
        }
    }
}