using System;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Pawnshop.Core;
using Pawnshop.Core.Queries;
using Pawnshop.Data.Access;
using Pawnshop.Data.Models.CashOrders;
using Pawnshop.Web.Engine;
using Pawnshop.Web.Models.List;

namespace Pawnshop.Web.Controllers.Api
{
    [Authorize(Permissions.BranchConfigurationManage)]
    public class RemittanceSettingController : Controller
    {
        private readonly RemittanceSettingRepository _repository;

        public RemittanceSettingController(RemittanceSettingRepository repository)
        {
            _repository = repository;
        }

        [HttpPost]
        public ListModel<RemittanceSetting> List([FromBody] ListQuery listQuery)
        {
            return new ListModel<RemittanceSetting>
            {
                List = _repository.List(listQuery),
                Count = _repository.Count(listQuery)
            };
        }

        [HttpPost]
        public RemittanceSetting Card([FromBody] int id)
        {
            if (id <= 0) throw new ArgumentOutOfRangeException(nameof(id));

            var model = _repository.Get(id);
            if (model == null) throw new InvalidOperationException();

            return model;
        }

        [HttpPost]
        public RemittanceSetting Save([FromBody] RemittanceSetting model)
        {
            ModelState.Validate();

            if (model.Id > 0)
            {
                _repository.Update(model);
            }
            else
            {
                _repository.Insert(model);
            }
            return model;
        }

        [HttpPost]
        public IActionResult Delete([FromBody] int id)
        {
            if (id <= 0) throw new ArgumentOutOfRangeException(nameof(id));

            _repository.Delete(id);
            return Ok();
        }
    }
}
