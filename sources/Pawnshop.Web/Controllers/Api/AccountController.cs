using System;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Pawnshop.Core;
using Pawnshop.Core.Queries;
using Pawnshop.Data.Access;
using Pawnshop.Data.Models.Audit;
using Pawnshop.Data.Models.Dictionaries;
using Pawnshop.Web.Engine;
using Pawnshop.Web.Engine.Middleware;
using Pawnshop.Web.Models.List;

namespace Pawnshop.Web.Controllers.Api
{
    [Authorize(Permissions.AccountView)]
    public class AccountController : Controller
    {
        private readonly AccountRepository _repository;

        public AccountController(AccountRepository repository)
        {
            _repository = repository;
        }

        [HttpPost]
        public ListModel<Account> List([FromBody] ListQuery listQuery)
        {
            return new ListModel<Account>
            {
                List = _repository.List(listQuery),
                Count = _repository.Count(listQuery)
            };
        }

        [HttpPost]
        public Account Card([FromBody] int id)
        {
            if (id <= 0) throw new ArgumentOutOfRangeException(nameof(id));

            var account = _repository.Get(id);
            if (account == null) throw new InvalidOperationException();

            return account;
        }

        [HttpPost, Authorize(Permissions.AccountManage)]
        [Event(EventCode.DictAccountSaved, EventMode = EventMode.Response)]
        public Account Save([FromBody] Account account)
        {
            ModelState.Validate();

            if (account.Id > 0)
            {
                _repository.Update(account);
            }
            else
            {
                _repository.Insert(account);
            }
            return account;
        }

        [HttpPost, Authorize(Permissions.AccountManage)]
        [Event(EventCode.DictAccountDeleted, EventMode = EventMode.Request)]
        public IActionResult Delete([FromBody] int id)
        {
            if (id <= 0) throw new ArgumentOutOfRangeException(nameof(id));
            var count = _repository.RelationCount(id);
            if (count > 0)
            {
                throw new Exception("Невозможно удалить счет, так как он привязан к кассовым ордерам");
            }

            _repository.Delete(id);
            return Ok();
        }
    }
}