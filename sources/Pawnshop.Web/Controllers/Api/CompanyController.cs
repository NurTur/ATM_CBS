using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Pawnshop.Core;
using Pawnshop.Core.Queries;
using Pawnshop.Data.Access;
using Pawnshop.Data.Models.Clients;
using Pawnshop.Web.Engine;
using Pawnshop.Web.Models.List;
using System;
using Pawnshop.Data.Models.Audit;
using Pawnshop.Web.Engine.Middleware;

namespace Pawnshop.Web.Controllers.Api
{
    [Authorize(Permissions.CompanyView)]
    public class CompanyController : Controller
    {
        private readonly CompanyRepository _repository;

        public CompanyController(CompanyRepository repository)
        {
            _repository = repository;
        }

        [HttpPost]
        public ListModel<Company> List([FromBody] ListQuery listQuery)
        {
            return new ListModel<Company>
            {
                List = _repository.List(listQuery),
                Count = _repository.Count(listQuery)
            };
        }

        [HttpPost]
        public Company Card([FromBody] int id)
        {
            if (id <= 0) throw new ArgumentOutOfRangeException(nameof(id));

            var result = _repository.Get(id);
            if (result == null) throw new InvalidOperationException();

            return result;
        }

        [HttpPost, Authorize(Permissions.CompanyManage)]
        [Event(EventCode.ClientSaved, EventMode = EventMode.Response, EntityType = EntityType.Client)]
        public Company Save([FromBody] Company company)
        {
            ModelState.Validate();

            if (company.Id > 0)
            {
                _repository.Update(company);
            }
            else
            {
                _repository.Insert(company);
            }
            return company;
        }

        [HttpPost, Authorize(Permissions.CompanyManage)]
        [Event(EventCode.ClientDeleted, EventMode = EventMode.Request, EntityType = EntityType.Client)]
        public IActionResult Delete([FromBody] int id)
        {
            if (id <= 0) throw new ArgumentOutOfRangeException(nameof(id));
            var count = _repository.RelationCount(id);
            if (count > 0)
            {
                throw new Exception("Невозможно удалить клиента, так как он привязан к договору");
            }

            _repository.Delete(id);
            return Ok();
        }
    }
}
