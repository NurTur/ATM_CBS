using System;
using System.Linq;
using System.Reflection;
using Pawnshop.Core;
using Pawnshop.Data.Access;
using Pawnshop.Data.Models.Membership;

namespace Pawnshop.Web.Engine
{
    public class BranchContext
    {
        private readonly object _lock = new object();
        private readonly ISessionContext _sessionContext;
        private readonly OrganizationRepository _organizationRepository;
        private readonly MemberRepository _memberRepository;
        private Configuration _configuration;
        private Organization _organization;
        private Group _branch;
        private int _branchId;

        public BranchContext(ISessionContext sessionContext,
            OrganizationRepository organizationRepository,
            MemberRepository memberRepository)
        {
            _sessionContext = sessionContext;
            _organizationRepository = organizationRepository;
            _memberRepository = memberRepository;
            _configuration = null;
            IsInitialized = false;
        }

        public void Init(int branchId)
        {
            lock (_lock)
            {
                _branchId = branchId;
                IsInitialized = false;
            }
        }

        public bool IsInitialized { get; private set; }

        public Organization Organization
        {
            get
            {
                CheckIfInitialized();
                if (_organization == null) throw new InvalidOperationException();
                return _organization;
            }
        }

        public bool InBranch
        {
            get
            {
                CheckIfInitialized();
                return _branch != null;
            }
        }

        public Group Branch
        {
            get
            {
                CheckIfInitialized();
                if (_branch == null) throw new InvalidOperationException();
                return _branch;
            }
        }

        public Configuration Configuration
        {
            get
            {
                CheckIfInitialized();
                if (_configuration == null) throw new InvalidOperationException();
                return _configuration;
            }
        }

        private void CheckIfInitialized()
        {
            if (!IsInitialized)
            {
                lock (_lock)
                {
                    if (!IsInitialized && _sessionContext.IsInitialized)
                    {
                        Load();
                    }
                }
            }
        }

        private void Load()
        {
            _organization = _organizationRepository.Get(_sessionContext.OrganizationId);
            _branch = _branchId > 0 ? _memberRepository.FindBranch(_sessionContext.UserId, _branchId) : null;
            _configuration = Process(typeof(Configuration),
                _organization?.Configuration,
                _branch?.Configuration) as Configuration;
            IsInitialized = true;
        }

        private object Process(Type type, params object[] sources)
        {
            var properties = type.GetProperties();
            var result = Activator.CreateInstance(type);

            foreach (var property in properties)
            {
                var propertyType = property.PropertyType;
                var sourceValues = sources.Select(s => s != null ? property.GetValue(s) : null).ToArray();
                var resultValue = propertyType != typeof(string) && propertyType.GetTypeInfo().IsClass
                    ? Process(propertyType, sourceValues)
                    : sourceValues.LastOrDefault(v => !string.IsNullOrWhiteSpace(v?.ToString()));

                if (resultValue != null)
                    property.SetValue(result, resultValue);
            }
            return result;
        }
    }
}