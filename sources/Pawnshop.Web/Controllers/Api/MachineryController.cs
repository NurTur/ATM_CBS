using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Pawnshop.Core;
using Pawnshop.Core.Exceptions;
using Pawnshop.Core.Queries;
using Pawnshop.Data.Access;
using Pawnshop.Data.Models.Audit;
using Pawnshop.Data.Models.Dictionaries;
using Pawnshop.Web.Engine;
using Pawnshop.Web.Engine.Middleware;
using Pawnshop.Web.Models.List;

namespace Pawnshop.Web.Controllers.Api
{
    [Authorize]
    public class MachineryController : Controller
    {
        private readonly MachineryRepository _repository;

        public MachineryController(MachineryRepository repository)
        {
            _repository = repository;
        }

        [HttpPost, Authorize(Permissions.MachineryView)]
        public ListModel<Machinery> List([FromBody] ListQuery listQuery)
        {
            return new ListModel<Machinery>
            {
                List = _repository.List(listQuery),
                Count = _repository.Count(listQuery)
            };
        }

        [HttpPost, Authorize(Permissions.MachineryView)]
        public Machinery Card([FromBody] int id)
        {
            if (id <= 0) throw new ArgumentOutOfRangeException(nameof(id));

            var model = _repository.Get(id);
            if (model == null) throw new InvalidOperationException();

            return model;
        }

        [HttpPost, Authorize(Permissions.MachineryManage)]
        [Event(EventCode.DictMachinerySaved, EventMode = EventMode.Response)]
        public Machinery Save([FromBody] Machinery entity)
        {
            ModelState.Validate();

            try
            {
                if (entity.Id > 0)
                {
                    _repository.Update(entity);
                }
                else
                {
                    _repository.Insert(entity);
                }
            }
            catch (SqlException e)
            {
                if (e.Number == 2627)
                {
                    throw new PawnshopApplicationException("Поле номер техпаспорта должно быть уникальным");
                }
                throw new PawnshopApplicationException(e.Message);
            }
            catch (Exception e)
            {
                throw new PawnshopApplicationException(e.Message);
            }

            return entity;
        }

        [HttpPost, Authorize(Permissions.MachineryManage)]
        [Event(EventCode.DictMachineryDeleted, EventMode = EventMode.Request)]
        public IActionResult Delete([FromBody] int id)
        {
            if (id <= 0) throw new ArgumentOutOfRangeException(nameof(id));
            var count = _repository.RelationCount(id);
            if (count > 0)
            {
                throw new Exception("Невозможно удалить позицию, так как она привязана к позиции договора");
            }

            _repository.Delete(id);
            return Ok();
        }

        [HttpPost]
        public List<string> Marks()
        {
            return _repository.Marks();
        }

        [HttpPost]
        public List<string> Models()
        {
            return _repository.Models();
        }

        [HttpPost]
        public List<string> Colors()
        {
            return _repository.Colors();
        }
    }
}
