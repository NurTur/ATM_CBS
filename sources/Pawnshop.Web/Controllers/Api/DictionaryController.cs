using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Pawnshop.Core;
using Pawnshop.Core.Queries;
using Pawnshop.Data.Access;
using Pawnshop.Data.Models.Dictionaries;
using Pawnshop.Data.Models.Membership;
using Pawnshop.Data.Models.Clients;
using Pawnshop.Web.Models.Dictionary;
using Pawnshop.Web.Models.List;
using System;
using Pawnshop.Data.Models.Audit;
using Pawnshop.Web.Engine;
using Pawnshop.Data.Models.InnerNotifications;

namespace Pawnshop.Web.Controllers.Api
{
    [Authorize]
    public class DictionaryController : Controller
    {
        private readonly ISessionContext _sessionContext;
        private readonly BranchContext _branchContext;
        private readonly GroupRepository _groupRepository;
        private readonly RoleRepository _roleRepository;
        private readonly BankRepository _bankRepository;
        private readonly CarRepository _carRepository;
        private readonly ClientRepository _clientRepository;
        private readonly PositionRepository _positionRepository;
        private readonly CategoryRepository _categoryRepository;
        private readonly AccountRepository _accountRepository;
        private readonly UserRepository _userRepository;
        private readonly PurityRepository _purityRepository;
        private readonly ExpenseGroupRepository _expenseGroupRepository;
        private readonly ExpenseTypeRepository _expenseTypeRepository;
        private readonly MachineryRepository _machineryRepository;
        private readonly OrganizationRepository _organizationRepository;
        private readonly ClientBlackListReasonRepository _clientBlackListReasonRepository;
        private readonly InnerNotificationRepository _innerNotificationRepository;

        public DictionaryController(ISessionContext sessionContext, BranchContext branchContext,
            GroupRepository groupRepository, RoleRepository roleRepository,
            BankRepository bankRepository, CarRepository carRepository,
            ClientRepository clientRepository, PositionRepository positionRepository,
            CategoryRepository categoryRepository, AccountRepository accountRepository,
            UserRepository userRepository, PurityRepository purityRepository,
            ExpenseGroupRepository expenseGroupRepository, ExpenseTypeRepository expenseTypeRepository,
            MachineryRepository machineryRepository, OrganizationRepository organizationRepository,
            ClientBlackListReasonRepository clientBlackListReasonRepository, InnerNotificationRepository innerNotificationRepository)
        {
            _sessionContext = sessionContext;
            _branchContext = branchContext;
            _groupRepository = groupRepository;
            _roleRepository = roleRepository;
            _bankRepository = bankRepository;
            _carRepository = carRepository;
            _clientRepository = clientRepository;
            _positionRepository = positionRepository;
            _categoryRepository = categoryRepository;
            _accountRepository = accountRepository;
            _userRepository = userRepository;
            _purityRepository = purityRepository;
            _expenseGroupRepository = expenseGroupRepository;
            _expenseTypeRepository = expenseTypeRepository;
            _machineryRepository = machineryRepository;
            _organizationRepository = organizationRepository;
            _clientBlackListReasonRepository = clientBlackListReasonRepository;
            _innerNotificationRepository = innerNotificationRepository;
        }

        [HttpPost]
        public List<Permission> Permissions()
        {
            return Core.Permissions.All.ToList();
        }

        [HttpPost]
        public List<Group> Groups()
        {
            return _groupRepository.List(new ListQuery() { Page = null });
        }

        [HttpPost]
        public List<User> Users()
        {
            return _userRepository.List(new ListQuery() { Page = null }, new { organizationId = _sessionContext.OrganizationId });
        }

        [HttpPost]
        public List<Role> Roles()
        {
            return _roleRepository.List(new ListQuery() { Page = null });
        }

        [HttpPost]
        public List<Bank> Banks()
        {
            return _bankRepository.List(new ListQuery() { Page = null });
        }

        [HttpPost]
        public ListModel<Client> Clients([FromBody] ListQuery listQuery)
        {
            return new ListModel<Client>
            {
                List = _clientRepository.List(listQuery),
                Count = _clientRepository.Count(listQuery)
            };
        }

        [HttpPost]
        public ListModel<Position> Positions([FromBody] ListQueryModel<PositionListQueryModel> listQuery)
        {
            return new ListModel<Position>
            {
                List = _positionRepository.List(listQuery, listQuery?.Model),
                Count = _positionRepository.Count(listQuery, listQuery?.Model)
            };
        }

        [HttpPost]
        public ListModel<Car> Cars([FromBody] ListQueryModel<PositionListQueryModel> listQuery)
        {
            return new ListModel<Car>
            {
                List = _carRepository.List(listQuery, listQuery?.Model),
                Count = _carRepository.Count(listQuery, listQuery?.Model)
            };
        }

        [HttpPost]
        public ListModel<Machinery> Machineries([FromBody] ListQueryModel<PositionListQueryModel> listQuery)
        {
            return new ListModel<Machinery>
            {
                List = _machineryRepository.List(listQuery, listQuery?.Model),
                Count = _machineryRepository.Count(listQuery, listQuery?.Model)
            };
        }

        [HttpPost]
        public List<Category> Categories([FromBody] ListQueryModel<CategoryListQueryModel> listQuery)
        {
            return _categoryRepository.List(new ListQuery() { Page = null }, listQuery?.Model);
        }

        [HttpPost]
        public List<Account> Accounts()
        {
            return _accountRepository.List(new ListQuery() { Page = null });
        }

        [HttpPost]
        public List<Purity> Purities()
        {
            return _purityRepository.List(new ListQuery() { Page = null });
        }

        [HttpPost]
        public List<dynamic> EventCodes()
        {
            var result = new List<dynamic>();
            foreach (EventCode item in Enum.GetValues(typeof(EventCode)))
            {
                result.Add(new
                {
                    Id = item,
                    Name = item.GetDisplayName()
                });
            }

            return result;
        }

        [HttpPost]
        public List<ExpenseGroup> ExpenseGroups()
        {
            return _expenseGroupRepository.List(new ListQuery() { Page = null });
        }

        [HttpPost]
        public ListModel<ExpenseType> ExpenseTypes()
        {
            return new ListModel<ExpenseType>
            {
                List = _expenseTypeRepository.List(new ListQuery() { Page = null }),
                Count = _expenseTypeRepository.Count(new ListQuery() { Page = null })
            };
        }

        [HttpPost]
        public ListModel<Organization> Organizations()
        {
            return new ListModel<Organization>
            {
                List = _organizationRepository.List(new ListQuery() { Page = null }),
                Count = _organizationRepository.Count(new ListQuery() { Page = null })
            };
        }

        [HttpPost]
        public ListModel<ClientBlackListReason> ClientBlackListReasons()
        {
            return new ListModel<ClientBlackListReason>
            {
                List = _clientBlackListReasonRepository.List(new ListQuery() { Page = null }),
                Count = _clientBlackListReasonRepository.Count(new ListQuery() { Page = null })
            };
        }

        [HttpPost]
        public ListModel<InnerNotification> Messages()
        {
            return new ListModel<InnerNotification>
            {
                List = _innerNotificationRepository.List(new ListQuery() { Page = null }, new { UserId = _sessionContext.UserId, BranchId = _branchContext.Branch.Id }),
                Count = _innerNotificationRepository.Count(new ListQuery() { Page = null })
            };
        }
    }
}