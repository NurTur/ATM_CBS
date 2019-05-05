using System;
using System.Data.SqlClient;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Pawnshop.Core;
using Pawnshop.Core.Exceptions;
using Pawnshop.Core.Queries;
using Pawnshop.Data.Access;
using Pawnshop.Data.Models.Audit;
using Pawnshop.Data.Models.Clients;
using Pawnshop.Web.Engine;
using Pawnshop.Web.Engine.Middleware;
using Pawnshop.Web.Models.List;

namespace Pawnshop.Web.Controllers.Api
{
    [Authorize(Permissions.PersonView)]
    public class PersonController : Controller
    {
        private readonly PersonRepository _repository;

        public PersonController(PersonRepository repository)
        {
            _repository = repository;
        }

        [HttpPost]
        public ListModel<Person> List([FromBody] ListQuery listQuery)
        {
            return new ListModel<Person>
            {
                List = _repository.List(listQuery),
                Count = _repository.Count(listQuery)
            };
        }

        [HttpPost]
        public Person Card([FromBody] int id)
        {
            if (id <= 0) throw new ArgumentOutOfRangeException(nameof(id));

            var result = _repository.Get(id);
            if (result == null) throw new InvalidOperationException();

            return result;
        }

        [HttpPost, Authorize(Permissions.PersonManage)]
        [Event(EventCode.ClientSaved, EventMode = EventMode.Response, EntityType = EntityType.Client)]
        public Person Save([FromBody] Person person)
        {
            ModelState.Validate();

            try
            {
                if (person.Id > 0)
                {
                    _repository.Update(person);
                }
                else
                {
                    _repository.Insert(person);
                }
            }
            catch (SqlException e)
            {
                if (e.Number == 2627)
                {
                    throw new PawnshopApplicationException("Поле ИИН/БИН должно быть уникальным");
                }
                throw new PawnshopApplicationException(e.Message);
            }
            catch (Exception e)
            {
                throw new PawnshopApplicationException(e.Message);
            }

            return person;
        }

        [HttpPost, Authorize(Permissions.PersonManage)]
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