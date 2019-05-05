using System;
using System.Linq;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Pawnshop.Core;
using Pawnshop.Core.Exceptions;
using Pawnshop.Core.Options;
using Pawnshop.Data.Access;
using Pawnshop.Data.Models.Audit;
using Pawnshop.Data.Models.Membership;
using Pawnshop.Web.Engine;
using Pawnshop.Web.Engine.Middleware;
using Pawnshop.Web.Engine.Security;
using Pawnshop.Web.Models.Auth;

namespace Pawnshop.Web.Controllers.Api
{
    public class AuthController : Controller
    {
        private readonly TokenProvider _tokenProvider;
        private readonly SaltedHash _saltedHash;
        private readonly ISessionContext _sessionContext;
        private readonly UserRepository _userRepository;
        private readonly MemberRepository _memberRepository;
        private readonly OrganizationRepository _organizationRepository;
        private readonly GroupRepository _groupRepository;
        private readonly BranchContext _branchContext;
        private readonly EnviromentAccessOptions _options;

        public AuthController(
            TokenProvider tokenProvider, SaltedHash saltedHash, ISessionContext sessionContext,
            UserRepository userRepository, MemberRepository memberRepository,
            OrganizationRepository organizationRepository, GroupRepository groupRepository, BranchContext branchContext,
            IOptions<EnviromentAccessOptions> options)
        {
            _tokenProvider = tokenProvider;
            _saltedHash = saltedHash;
            _sessionContext = sessionContext;
            _userRepository = userRepository;
            _memberRepository = memberRepository;
            _organizationRepository = organizationRepository;
            _groupRepository = groupRepository;
            _branchContext = branchContext;
            _options = options.Value;
        }

        [HttpPost, AllowAnonymous]
        [Event(EventCode.UserAuthentication, EventMode = EventMode.Request, IncludeFails = true)]
        public string SignIn([FromBody] SignInModel model)
        {
            if (model == null) throw new ArgumentNullException(nameof(model));
            ModelState.Validate();

            var user = _userRepository.Find(new { login = model.Username });
            if (user != null && !user.Locked)
            {
                string password, salt;
                _userRepository.GetPasswordAndSalt(user.Id, out password, out salt);
                var verified = _saltedHash.VerifyHashString(model.Password, password, salt);
                if (verified)
                {
                    var organization = _organizationRepository.Get(user.OrganizationId);
                    if (organization != null && !organization.Locked)
                    {
                        var roles = _memberRepository.Roles(user.Id, true);
                        return _tokenProvider.CreateToken(user, organization, roles.ToArray());
                    }
                }
            }

            throw new PawnshopApplicationException("Имя пользователя или пароль указан не верно");
        }

        [HttpPost, Authorize]
        public ProfileModel Profile()
        {
            return new ProfileModel
            {
                User = _userRepository.Get(_sessionContext.UserId),
                Organization = _organizationRepository.Get(_sessionContext.OrganizationId),
                Branches = _memberRepository.Groups(_sessionContext.UserId, null)
                    .Where(g => g.Type == GroupType.Branch).ToArray()
            };
        }

        [HttpPost, Authorize]
        [Event(EventCode.UserProfileSaved)]
        public ProfileModel UpdateProfile([FromBody] User user)
        {
            if (user == null) throw new ArgumentNullException(nameof(user));
            ModelState.Validate();

            var existUser = _userRepository.Find(new { login = user.Login });
            if (existUser != null && existUser.Id != _sessionContext.UserId)
            {
                throw new PawnshopApplicationException("Пользователь с выбранным именем уже существует.");
            }
            if (existUser == null)
            {
                existUser = _userRepository.Get(_sessionContext.UserId);
            }
            existUser.Login = user.Login;
            existUser.Email = user.Email;
            existUser.Fullname = user.Fullname;

            _userRepository.Update(existUser);

            return Profile();
        }

        [HttpPost, Authorize(Permissions.OrganizationConfigurationManage)]
        [Event(EventCode.OrganizationConfigSaved)]
        public void UpdateOrganizationConfiguration([FromBody] Configuration model)
        {
            if (model == null) throw new ArgumentNullException(nameof(model));
            ModelState.Validate();

            _branchContext.Organization.Configuration = model;

            _organizationRepository.Update(_branchContext.Organization);
        }

        [HttpPost, Authorize(Permissions.BranchConfigurationManage)]
        [Event(EventCode.BranchConfigSaved)]
        public void UpdateBranchConfiguration([FromBody] Configuration model)
        {
            if (model == null) throw new ArgumentNullException(nameof(model));
            ModelState.Validate();

            _branchContext.Branch.Configuration = model;

            _groupRepository.Update(_branchContext.Branch);
        }

        [HttpPost, Authorize]
        [Event(EventCode.UserPasswordSaved)]
        public void UpdatePassword([FromBody] PasswordModel model)
        {
            if (model == null) throw new ArgumentNullException(nameof(model));
            ModelState.Validate();

            string password, salt;
            _userRepository.GetPasswordAndSalt(_sessionContext.UserId, out password, out salt);
            var verified = _saltedHash.VerifyHashString(model.OldPassword, password, salt);
            if (!verified)
            {
                throw new PawnshopApplicationException("Пароль указан не верно.");
            }

            _saltedHash.GetHashAndSaltString(model.NewPassword, out password, out salt);
            _userRepository.SetPasswordAndSalt(_sessionContext.UserId, password, salt, _options.ExpireDay);
        }
    }
}
