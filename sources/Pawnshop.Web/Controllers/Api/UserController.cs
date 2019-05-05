using System;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Pawnshop.Core;
using Pawnshop.Core.Exceptions;
using Pawnshop.Core.Queries;
using Pawnshop.Data.Access;
using Pawnshop.Data.Models.Audit;
using Pawnshop.Data.Models.Membership;
using Pawnshop.Web.Engine.Middleware;
using Pawnshop.Web.Engine.Security;
using Pawnshop.Web.Models.List;
using Pawnshop.Web.Models.Membership;

namespace Pawnshop.Web.Controllers.Api
{
    [Authorize(Permissions.UserView)]
    public class UserController : Controller
    {
        private readonly UserRepository _repository;
        private readonly MemberRepository _memberRepository;
        private readonly ISessionContext _sessionContext;
        private readonly SaltedHash _saltedHash;

        public UserController(
            UserRepository repository,
            MemberRepository memberRepository,
            ISessionContext sessionContext, SaltedHash saltedHash)
        {
            _repository = repository;
            _memberRepository = memberRepository;
            _sessionContext = sessionContext;
            _saltedHash = saltedHash;
        }

        [HttpPost]
        public ListModel<User> List([FromBody] ListQueryModel<UserListQueryModel> listQuery)
        {
            if (listQuery == null) listQuery = new ListQueryModel<UserListQueryModel>();
            if (listQuery.Model == null) listQuery.Model = new UserListQueryModel();

            if (!_sessionContext.ForSupport)
            {
                listQuery.Model.OrganizationId = _sessionContext.OrganizationId;
            }

            return new ListModel<User>
            {
                List = _repository.List(listQuery, listQuery.Model),
                Count = _repository.Count(listQuery, listQuery.Model)
            };
        }

        [HttpPost]
        public CardModel<User> Card([FromBody] int id)
        {
            if (id <= 0) throw new ArgumentOutOfRangeException(nameof(id));

            var user = _repository.Get(id);
            if (user == null) throw new InvalidOperationException();

            return new CardModel<User>
            {
                Member = user,
                Groups = _memberRepository.Groups(user.Id, MemberRelationType.Direct),
                Roles = _memberRepository.Roles(user.Id, false)
            };
        }

        [HttpPost, Authorize(Permissions.UserManage)]
        [Event(EventCode.UserSaved, EventMode = EventMode.Response)]
        public CardModel<User> Save([FromBody] CardModel<User> card)
        {
            if (card?.Member == null) throw new ArgumentNullException(nameof(card));

            var existUser = _repository.Find(new {login = card.Member.Login});
            if (existUser != null && existUser.Id != card.Member.Id)
            {
                throw new PawnshopApplicationException("Пользователь с выбранным именем уже существует.");
            }

            var existIdentityNumber = _repository.Find(new { login = card.Member.IdentityNumber });
            if (existIdentityNumber != null && existIdentityNumber.Id != card.Member.Id)
            {
                var error = String.Concat("Пользователь с таким ИИН уже существует: ",existIdentityNumber.Fullname);
                throw new PawnshopApplicationException(error);
            }

            using (var transaction = _repository.BeginTransaction())
            {
                if (card.Member.Id > 0)
                    _repository.Update(card.Member);
                else
                {
                    card.Member.OrganizationId = _sessionContext.OrganizationId;
                    card.Member.CreateDate = DateTime.Now;
                    card.Member.ExpireDate = DateTime.Now.Date;
                    _repository.Insert(card.Member);

                    /*** TODO Нормальный механизм активации пользователя через электронную почту ***/
                    string hash;
                    string salt;
                    _saltedHash.GetHashAndSaltString("123456", out hash, out salt);
                    _repository.SetPasswordAndSalt(card.Member.Id, hash, salt, 0);
                }

                var dbRoles = _memberRepository.Roles(card.Member.Id, false);
                var rolesAdd = card.Roles.Diff(dbRoles);
                var rolesDel = dbRoles.Diff(card.Roles);

                var dbGroups = _memberRepository.Groups(card.Member.Id, MemberRelationType.Direct);
                var groupsAdd = card.Groups.Diff(dbGroups);
                var groupsDel = dbGroups.Diff(card.Groups);

                _memberRepository.InsertRoles(card.Member.Id, rolesAdd);
                _memberRepository.DeleteRoles(card.Member.Id, rolesDel);
                _memberRepository.InsertGroups(card.Member.Id, groupsAdd);
                _memberRepository.DeleteGroups(card.Member.Id, groupsDel);

                transaction.Commit();
            }

            return card;
        }

        [HttpPost, Authorize(Permissions.UserManage)]
        [Event(EventCode.UserSaved, EventMode = EventMode.Response)]
        public User Reset([FromBody] int id)
        {
            if (id <= 0) throw new ArgumentOutOfRangeException(nameof(id));

            var user = _repository.Get(id);
            if (user == null) throw new InvalidOperationException();

            using (var transaction = _repository.BeginTransaction())
            {
                /*** TODO Нормальный механизм активации пользователя через электронную почту ***/
                string hash;
                string salt;
                _saltedHash.GetHashAndSaltString("123456", out hash, out salt);
                _repository.SetPasswordAndSalt(user.Id, hash, salt, 0);

                transaction.Commit();
            }

            return user;
        }
    }
}