using System;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Pawnshop.Core;
using Pawnshop.Core.Queries;
using Pawnshop.Data.Access;
using Pawnshop.Data.Models.Audit;
using Pawnshop.Data.Models.Membership;
using Pawnshop.Web.Engine;
using Pawnshop.Web.Engine.Middleware;
using Pawnshop.Web.Models.List;
using Pawnshop.Web.Models.Membership;

namespace Pawnshop.Web.Controllers.Api
{
    public class LoanPercentController : Controller
    {
        private readonly LoanPercentRepository _repository;
        private readonly ISessionContext _sessionContext;
        private readonly BranchContext _branchContext;

        public LoanPercentController(LoanPercentRepository repository, ISessionContext sessionContext, BranchContext branchContext)
        {
            _repository = repository;
            _sessionContext = sessionContext;
            _branchContext = branchContext;
        }

        [HttpPost]
        public ListModel<LoanPercentSetting> List([FromBody] ListQuery listQuery)
        {
            var query = new
            {
                OrganizationId = _sessionContext.OrganizationId,
            };

            return new ListModel<LoanPercentSetting>
            {
                List = _repository.List(listQuery, query),
                Count = _repository.Count(listQuery, query)
            };
        }

        [HttpPost]
        public LoanPercentSetting Card([FromBody] int id)
        {
            if (id <= 0) throw new ArgumentOutOfRangeException(nameof(id));

            var setting = _repository.Get(id);
            if (setting == null) throw new InvalidOperationException();

            return setting;
        }

        [HttpPost]
        public LoanPercentSetting Find([FromBody] LoanPercentQueryModel query)
        {
            if (query == null) throw new ArgumentNullException(nameof(query));
            query.BranchId = _branchContext.Branch.Id;

            return _repository.Find(query);
        }

        [HttpPost, Authorize(Permissions.LoanPercentSettingManage)]
        [Event(EventCode.DictLoanPercentSaved, EventMode = EventMode.Response)]
        public LoanPercentSetting Save([FromBody] LoanPercentSetting setting)
        {
            if (setting.Id == 0)
            {
                setting.OrganizationId = _sessionContext.OrganizationId;
            }

            ModelState.Clear();
            TryValidateModel(setting);
            ModelState.Validate();

            if (setting.Id > 0)
            {
                _repository.Update(setting);
            }
            else
            {
                _repository.Insert(setting);
            }

            return setting;
        }

        [HttpPost, Authorize(Permissions.LoanPercentSettingManage)]
        [Event(EventCode.DictLoanPercentDeleted, EventMode = EventMode.Request)]
        public IActionResult Delete([FromBody] int id)
        {
            if (id <= 0) throw new ArgumentOutOfRangeException(nameof(id));

            _repository.Delete(id);
            return Ok();
        }

    }
}