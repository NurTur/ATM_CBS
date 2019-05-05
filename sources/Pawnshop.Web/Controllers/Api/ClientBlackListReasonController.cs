using Microsoft.AspNetCore.Mvc;
using Pawnshop.Data.Models.Dictionaries;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Pawnshop.Core.Queries;
using Pawnshop.Data.Access;
using Microsoft.AspNetCore.Authorization;
using Pawnshop.Core;
using Pawnshop.Web.Models.List;
using Pawnshop.Web.Engine.Middleware;
using Pawnshop.Data.Models.Audit;
using Pawnshop.Web.Engine;

namespace Pawnshop.Web.Controllers.Api
{
    [Authorize]
    public class ClientBlackListReasonController : Controller
    {
        private readonly ClientBlackListReasonRepository _repository;
        public ClientBlackListReasonController(ClientBlackListReasonRepository repository)
        {
            _repository = repository;
        }

        [HttpPost]
        public ListModel<ClientBlackListReason> List([FromBody]ListQuery listQuery)
        {
            return new ListModel<ClientBlackListReason>
            {
                Count = _repository.Count(listQuery),
                List = _repository.List(listQuery)
            };
        }

        [HttpPost]
        public ClientBlackListReason Card([FromBody]int id)
        {
            if (id <= 0) throw new ArgumentOutOfRangeException(nameof(id));

            var reason = _repository.Get(id);
            if(reason==null) throw new InvalidOperationException();

            return reason;
        }

        [HttpPost, Authorize(Permissions.ClientBlackListReasonManage)]
        [Event(EventCode.DictClientBlackListReasonSaved, EventMode = EventMode.Response)]
        public ClientBlackListReason Save([FromBody] ClientBlackListReason reason)
        {
            ModelState.Validate();

            if (reason.Id > 0)
            {
                _repository.Update(reason);
            }
            else
            {
                _repository.Insert(reason);
            }
            return reason;
        }
    }
}
