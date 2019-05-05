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
    public class CarController : Controller
    {
        private readonly CarRepository _repository;

        public CarController(CarRepository repository)
        {
            _repository = repository;
        }

        [HttpPost, Authorize(Permissions.CarView)]
        public ListModel<Car> List([FromBody] ListQuery listQuery)
        {
            return new ListModel<Car>
            {
                List = _repository.List(listQuery),
                Count = _repository.Count(listQuery)
            };
        }

        [HttpPost, Authorize(Permissions.CarView)]
        public Car Card([FromBody] int id)
        {
            if (id <= 0) throw new ArgumentOutOfRangeException(nameof(id));

            var car = _repository.Get(id);
            if (car == null) throw new InvalidOperationException();

            return car;
        }

        [HttpPost, Authorize(Permissions.CarManage)]
        [Event(EventCode.DictCarSaved, EventMode = EventMode.Response)]
        public Car Save([FromBody] Car car)
        {
            ModelState.Validate();

            try
            {
                if (car.Id > 0)
                {
                    _repository.Update(car);
                }
                else
                {
                    _repository.Insert(car);
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

            return car;
        }

        [HttpPost, Authorize(Permissions.CarManage)]
        [Event(EventCode.DictCarDeleted, EventMode = EventMode.Request)]
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