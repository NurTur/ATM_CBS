using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Pawnshop.Core;
using Pawnshop.Core.Exceptions;
using Pawnshop.Data.Access;
using Pawnshop.Web.Engine;
using Pawnshop.Web.Models.Contract;

namespace Pawnshop.Web.Controllers.Api
{
    [Authorize(Permissions.ContractOuterView)]
    public class ContractOuterController : Controller
    {
        private readonly ContractRepository _repository;

        public ContractOuterController(ContractRepository repository)
        {
            _repository = repository;
        }

        public ContractOuterModel Find([FromBody] ContractOuterQueryModel query)
        {
            ModelState.Validate();

            var entity = _repository.Find(query.ContractNumber, query.IdentityNumber);
            if (entity == null) throw new PawnshopApplicationException("Договор не найден");

            return new ContractOuterModel
            {
                ContractNumber = entity.ContractNumber,
                ContractDate = entity.ContractDate,
                MaturityDate = entity.MaturityDate,
                LoanCost = entity.LoanCost,
                BalanceCost = entity.BalanceCost
            };
        }
    }
}
