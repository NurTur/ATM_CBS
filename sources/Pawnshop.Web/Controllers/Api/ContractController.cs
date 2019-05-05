using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.StaticFiles;
using Pawnshop.Core;
using Pawnshop.Core.Exceptions;
using Pawnshop.Data.Access;
using Pawnshop.Data.Models.Audit;
using Pawnshop.Data.Models.Clients;
using Pawnshop.Data.Models.Contracts;
using Pawnshop.Data.Models.Contracts.Actions;
using Pawnshop.Data.Models.Files;
using Pawnshop.Data.Models.Membership;
using Pawnshop.Web.Engine;
using Pawnshop.Web.Engine.Export;
using Pawnshop.Web.Engine.Middleware;
using Pawnshop.Web.Engine.Storage;
using Pawnshop.Web.Models.Contract;
using Pawnshop.Web.Models.List;

namespace Pawnshop.Web.Controllers.Api
{
    [Authorize(Permissions.ContractView)]
    public class ContractController : Controller
    {
        private readonly ContractRepository _repository;
        private readonly PersonRepository _personRepository;
        private readonly ContractNumberCounterRepository _counterRepository;
        private readonly ContractsExcelBuilder _excelBuilder;
        private readonly IStorage _storage;
        private readonly BranchContext _branchContext;
        private readonly ISessionContext _sessionContext;
        private readonly ClientRepository _clientRepository;
        private readonly MemberRepository _memberRepository;
        private readonly ContractWordBuilder _wordBuilder;
        private readonly AnnuityContractWordBuilder _annuityWordBuilder;

        public ContractController(ContractRepository repository, PersonRepository personRepository,
            ContractNumberCounterRepository counterRepository, ContractsExcelBuilder excelBuilder,
            ClientRepository clientRepository, MemberRepository memberRepository, IStorage storage, BranchContext branchContext,
            ISessionContext sessionContext, ContractWordBuilder wordBuilder, AnnuityContractWordBuilder annuityWordBuilder)
        {
            _repository = repository;
            _personRepository = personRepository;
            _counterRepository = counterRepository;
            _clientRepository = clientRepository;
            _memberRepository = memberRepository;
            _excelBuilder = excelBuilder;
            _storage = storage;
            _branchContext = branchContext;
            _sessionContext = sessionContext;
            _wordBuilder = wordBuilder;
            _annuityWordBuilder = annuityWordBuilder;
        }

        [HttpPost]
        public ListModel<Contract> List([FromBody] ListQueryModel<ContractListQueryModel> listQuery)
        {
            if (listQuery == null) listQuery = new ListQueryModel<ContractListQueryModel>();
            if (listQuery.Model == null) listQuery.Model = new ContractListQueryModel();

            listQuery.Model.OwnerIds = listQuery.Model.ClientId.HasValue 
                ? _memberRepository.Groups(_sessionContext.UserId, null).Where(g => g.Type == GroupType.Branch).Select(b => b.Id).ToArray()
                : new int[] { _branchContext.Branch.Id };

            if (listQuery.Model.EndDate.HasValue)
            {
                listQuery.Model.EndDate = listQuery.Model.EndDate.Value.Date.AddHours(23).AddMinutes(59).AddSeconds(59);
            }

            return new ListModel<Contract>
            {
                List = _repository.List(listQuery, listQuery.Model),
                Count = _repository.Count(listQuery, listQuery.Model)
            };
        }

        [HttpPost]
        public Contract Card([FromBody] int id)
        {
            if (id <= 0) throw new ArgumentOutOfRangeException(nameof(id));

            var contract = _repository.Get(id);
            if (contract == null) throw new InvalidOperationException();
            if (contract.Status == ContractStatus.Draft && contract.ClientId > 0)
            {
                var cardType = CardType.Standard;
                if (contract.ContractData == null)
                {
                    contract.ContractData = new ContractData();
                }
                else
                {
                    cardType = contract.ContractData.Client.CardType;
                }
                var client = _clientRepository.Get(contract.ClientId);
                contract.ContractData.Client = client;
                contract.ContractData.Client.CardType = cardType;
            }
            return contract;
        }

        [HttpPost, Authorize(Permissions.ContractManage)]
        public Contract Copy([FromBody] int id)
        {
            if (id <= 0) throw new ArgumentOutOfRangeException(nameof(id));

            var contract = _repository.Get(id);
            if (contract == null) throw new InvalidOperationException();

            contract.Id = 0;
            contract.ContractNumber = null;
            contract.ContractDate = DateTime.Now;
            contract.MaturityDate = contract.ContractDate.AddDays(contract.LoanPeriod - 1);
            contract.OriginalMaturityDate = contract.ContractDate.AddDays(contract.LoanPeriod - 1);
            contract.DeleteDate = null;
            contract.Status = ContractStatus.Draft;
            contract.ProlongDate = null;
            contract.Locked = false;
            contract.Actions = new List<ContractAction>();
            foreach (var position in contract.Positions)
            {
                position.Id = 0;
                position.ContractId = 0;
                position.Status = ContractPositionStatus.Active;
            }
            if (contract.ContractData != null && contract.ContractData.Client != null)
            {
                contract.ContractData.Client.CardType = CardType.Standard;
            }
            return contract;
        }

        [HttpPost, Authorize(Permissions.ContractManage)]
        [Event(EventCode.ContractSaved, EventMode = EventMode.Response, EntityType = EntityType.Contract)]
        public Contract Save([FromBody] Contract contract)
        {
            using (var transaction = _repository.BeginTransaction())
            {
                if (contract.ContractData.Client.DocumentDateExpire < DateTime.Now.Date)
                {
                    throw new PawnshopApplicationException("Срок действия вашего документа истёк");
                }
                if (contract.Id == 0)
                {
                    if (contract.ContractData != null && contract.ContractData.Client != null)
                    {
                        ModelState.Clear();
                        TryValidateModel(contract.ContractData.Client);
                        ModelState.Validate();

                        if (contract.ContractData.Client.Id == 0)
                        {
                            try
                            {
                                var person = new Person(contract.ContractData.Client);
                                _personRepository.Insert(person);
                                contract.ContractData.Client.Id = person.Id;
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
                        }
                        else
                        {
                            var person = new Person(contract.ContractData.Client);
                            _personRepository.Update(person);
                        }

                        contract.ClientId = contract.ContractData.Client.Id;
                    }
                }

                if (contract.Id == 0)
                {
                    contract.OwnerId = _branchContext.Branch.Id;
                    contract.BranchId = _branchContext.Branch.Id;
                    contract.AuthorId = _sessionContext.UserId;
                }

                ModelState.Clear();
                TryValidateModel(contract);
                ModelState.Validate();

                if (contract.CollateralType == CollateralType.Car || contract.CollateralType == CollateralType.Machinery)
                {
                    foreach (var position in contract.Positions)
                    {
                        var exist = _repository.Find(new ContractQueryModel
                        {
                            PositionId = position.PositionId,
                            CollateralType = contract.CollateralType,
                            Status = ContractStatus.Signed
                        });

                        if (exist != null) throw new PawnshopApplicationException("По выбранной позиции существует открытый договор");
                    }
                }

                if (contract.Id > 0)
                {
                    _repository.Update(contract);
                }
                else
                {
                    contract.ContractNumber = _counterRepository.Next(
                        contract.ContractDate.Year, _branchContext.Branch.Id,
                        _branchContext.Configuration.ContractSettings.NumberCode);
                    _repository.Insert(contract);
                }

                transaction.Commit();
            }

            return contract;
        }

        [HttpPost, Authorize(Permissions.ContractManage)]
        [Event(EventCode.ContractDeleted, EventMode = EventMode.Request, EntityType = EntityType.Contract)]
        public IActionResult Delete([FromBody] int id)
        {
            if (id <= 0) throw new ArgumentOutOfRangeException(nameof(id));

            var contract = _repository.Get(id);
            if (contract == null) throw new InvalidOperationException();
            if (contract.Locked) throw new PawnshopApplicationException("Запрещено удалять автоматически порожденные договора.");
            if (!contract.CreatedToday && !_sessionContext.ForSupport) throw new PawnshopApplicationException("Удалять можно только договоры за сегодняшний день");

            _repository.Delete(id);
            return Ok();
        }

        [HttpPost, Authorize(Permissions.ContractManage)]
        [Event(EventCode.ContractRecovery, EventMode = EventMode.Request, EntityType = EntityType.Contract)]
        public IActionResult UndoDelete([FromBody] int id)
        {
            if (id <= 0) throw new ArgumentOutOfRangeException(nameof(id));

            var contract = _repository.Get(id);
            if (contract == null) throw new InvalidOperationException();
            if (!contract.CreatedToday) throw new PawnshopApplicationException("Восстанавливать можно только договоры за сегодняшний день");

            _repository.UndoDelete(id);
            return Ok();
        }

        [HttpPost]
        public async Task<IActionResult> Export([FromBody] List<Contract> contracts)
        {
            using (var stream = _excelBuilder.Build(contracts))
            {
                var fileName = await _storage.Save(stream, ContainerName.Temp, "export.xlsx");
                string contentType;
                new FileExtensionContentTypeProvider().TryGetContentType(fileName, out contentType);

                var fileRow = new FileRow
                {
                    CreateDate = DateTime.Now,
                    ContentType = contentType ?? "application/octet-stream",
                    FileName = fileName,
                    FilePath = fileName
                };
                return Ok(fileRow);
            }
        }

        public async Task<IActionResult> Print([FromBody] int id)
        {
            if (id <= 0) throw new ArgumentOutOfRangeException(nameof(id));

            var contract = _repository.Get(id);
            if (contract == null) throw new InvalidOperationException();
            if (contract.Status == ContractStatus.Draft && contract.ClientId > 0)
            {
                if (contract.ContractData == null)
                {
                    contract.ContractData = new ContractData();
                }
                var client = _clientRepository.Get(contract.ClientId);
                contract.ContractData.Client = client;
            }

            var stream = await _wordBuilder.Build(contract);
            stream.Position = 0;
            
            var fileName = await _storage.Save(stream, ContainerName.Temp, "contract.docx");
            string contentType;
            new FileExtensionContentTypeProvider().TryGetContentType(fileName, out contentType);

            var fileRow = new FileRow
            {
                CreateDate = DateTime.Now,
                ContentType = contentType ?? "application/octet-stream",
                FileName = fileName,
                FilePath = fileName
            };
            return Ok(fileRow);                
        }

        public async Task<IActionResult> PrintAnnuity([FromBody] int id)
        {
            if (id <= 0) throw new ArgumentOutOfRangeException(nameof(id));

            var contract = _repository.Get(id);
            if (contract == null) throw new InvalidOperationException();
            if (contract.Status == ContractStatus.Draft && contract.ClientId > 0)
            {
                if (contract.ContractData == null)
                {
                    contract.ContractData = new ContractData();
                }
                var client = _clientRepository.Get(contract.ClientId);
                contract.ContractData.Client = client;
            }

            var stream = await _annuityWordBuilder.Build(contract);
            stream.Position = 0;

            var fileName = await _storage.Save(stream, ContainerName.Temp, "contract.docx");
            string contentType;
            new FileExtensionContentTypeProvider().TryGetContentType(fileName, out contentType);

            var fileRow = new FileRow
            {
                CreateDate = DateTime.Now,
                ContentType = contentType ?? "application/octet-stream",
                FileName = fileName,
                FilePath = fileName
            };
            return Ok(fileRow);
        }
    }
}