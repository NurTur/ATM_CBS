using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using Pawnshop.Core;
using Pawnshop.Core.Exceptions;
using Pawnshop.Core.Options;
using Pawnshop.Data.Access;
using Pawnshop.Data.Access.Reports;
using Pawnshop.Data.Models.CashOrders;
using Pawnshop.Data.Models.Files;
using Pawnshop.Data.Models.Membership;
using Pawnshop.Web.Engine;
using Pawnshop.Web.Engine.Export.Reports;
using Pawnshop.Web.Engine.Storage;
using Pawnshop.Web.Models.List;
using Pawnshop.Web.Models.Reports;
using Pawnshop.Web.Models.Reports.AccountAnalysis;
using Pawnshop.Web.Models.Reports.AccountCard;
using Pawnshop.Web.Models.Reports.AccountCycle;
using Pawnshop.Web.Models.Reports.CashBook;
using Pawnshop.Web.Models.Reports.CashReport;
using Pawnshop.Web.Models.Reports.ConsolidateProfitReport;
using Pawnshop.Web.Models.Reports.ConsolidateReport;
using Pawnshop.Web.Models.Reports.ContractMonitoring;
using Pawnshop.Web.Models.Reports.DailyReport;
using Pawnshop.Web.Models.Reports.DelayReport;
using Pawnshop.Web.Models.Reports.DiscountReport;
using Pawnshop.Web.Models.Reports.ExpenseReports;
using Pawnshop.Web.Models.Reports.GoldPrice;
using Pawnshop.Web.Models.Reports.InsuranceReport;
using Pawnshop.Web.Models.Reports.OperationalReport;
using Pawnshop.Web.Models.Reports.OrderRegister;
using Pawnshop.Web.Models.Reports.PaymentReport;
using Pawnshop.Web.Models.Reports.ProfitReport;
using Pawnshop.Web.Models.Reports.ReconciliationReport;
using Pawnshop.Web.Models.Reports.SellingReport;
using Pawnshop.Web.Models.Reports.SplitProfits;
using Pawnshop.Web.Models.Reports.IssuanceReport;
using Pawnshop.Web.Models.Reports.ReinforceAndWithdrawReport;
using Pawnshop.Web.Models.Reports.AccountableReport;
using Pawnshop.Web.Models.Reports.NotificationReport;
using Pawnshop.Web.Models.Reports.RegionMonitoringReport;
using Pawnshop.Web.Models.Reports.StatisticsReport;
using Stimulsoft.Report;
using Stimulsoft.Report.Dictionary;
using Stimulsoft.Report.Mvc;

namespace Pawnshop.Web.Controllers.Api
{
    public class ReportController : Controller
    {
        private readonly MemberRepository _memberRepository;
        private readonly ContractMonitoringRepository _contractMonitoringRepository;
        private readonly AccountAnalysisRepository _accountAnalysisRepository;

        private readonly ContractMonitoringExcelBuilder _contractMonitoringExcelBuilder;
        private readonly AccountAnalysisExcelBuilder _accountAnalysisExcelBuilder;

        private readonly IStorage _storage;
        private readonly ISessionContext _sessionContext;
        private readonly BranchContext _branchContext;
        private readonly EnviromentAccessOptions _options;

        private readonly AccountRepository _accountRepository;

        public ReportController(MemberRepository memberRepository, 
            ContractMonitoringRepository contractMonitoringRepository,
            AccountAnalysisRepository accountAnalysisRepository,
            ContractMonitoringExcelBuilder contractMonitoringExcelBuilder,
            AccountAnalysisExcelBuilder accountAnalysisExcelBuilder,
            IStorage storage, ISessionContext sessionContext, BranchContext branchContext, IOptions<EnviromentAccessOptions> options,
            AccountRepository accountRepository)
        {
            _memberRepository = memberRepository;
            _contractMonitoringRepository = contractMonitoringRepository;
            _accountAnalysisRepository = accountAnalysisRepository;

            _contractMonitoringExcelBuilder = contractMonitoringExcelBuilder;
            _accountAnalysisExcelBuilder = accountAnalysisExcelBuilder;

            _storage = storage;
            _sessionContext = sessionContext;
            _branchContext = branchContext;
            _options = options.Value;

            _accountRepository = accountRepository;
        }

        [HttpPost]
        [Authorize(Permissions.ContractMonitoringView)]
        public ContractMonitoringModel ContractMonitoring([FromBody] ListQueryModel<ContractMonitoringQueryModel> listQuery)
        {
            if (listQuery == null) listQuery = new ListQueryModel<ContractMonitoringQueryModel>();
            if (listQuery.Model == null) listQuery.Model = new ContractMonitoringQueryModel
            {
                BranchId = _branchContext.Branch.Id
            };

            if (listQuery.Model.BeginDate == DateTime.MinValue) listQuery.Model.BeginDate = DateTime.Now.Date;
            if (listQuery.Model.EndDate == DateTime.MinValue) listQuery.Model.EndDate = DateTime.Now.Date.AddHours(23).AddMinutes(59).AddSeconds(59);
            
            listQuery.Model.BeginDate = listQuery.Model.BeginDate.Date;
            listQuery.Model.EndDate = listQuery.Model.EndDate.Date.AddHours(23).AddMinutes(59).AddSeconds(59);

            var model = new ContractMonitoringModel
            {
                BeginDate = listQuery.Model.BeginDate,
                EndDate = listQuery.Model.EndDate.Date,
                BranchName = _memberRepository.Groups(_sessionContext.UserId, null)
                    .FirstOrDefault(g => g.Type == GroupType.Branch && g.Id == listQuery.Model.BranchId)?.DisplayName,
                ProlongDayCount = listQuery.Model.ProlongDayCount,
                CollateralType = listQuery.Model.CollateralType,
                DisplayStatus = listQuery.Model.DisplayStatus,
                LoanCost = listQuery.Model.LoanCost,
                List = _contractMonitoringRepository.List(listQuery.Model).ToList(),
            };

            return model;
        }

        [HttpPost]
        [Authorize(Permissions.ContractMonitoringView)]
        public async Task<IActionResult> ExportContractMonitoring([FromBody] ListQueryModel<ContractMonitoringQueryModel> listQuery)
        {
            if (listQuery == null) listQuery = new ListQueryModel<ContractMonitoringQueryModel>();
            if (listQuery.Model == null) listQuery.Model = new ContractMonitoringQueryModel
            {
                BranchId = _branchContext.Branch.Id
            };

            if (listQuery.Model.BeginDate == DateTime.MinValue) listQuery.Model.BeginDate = DateTime.Now.Date;
            if (listQuery.Model.EndDate == DateTime.MinValue) listQuery.Model.EndDate = DateTime.Now.Date.AddHours(23).AddMinutes(59).AddSeconds(59);
            
            listQuery.Model.BeginDate = listQuery.Model.BeginDate.Date;
            listQuery.Model.EndDate = listQuery.Model.EndDate.Date.AddHours(23).AddMinutes(59).AddSeconds(59);

            var model = new ContractMonitoringModel
            {
                BeginDate = listQuery.Model.BeginDate,
                EndDate = listQuery.Model.EndDate,
                BranchName = _memberRepository.Groups(_sessionContext.UserId, null)
                    .FirstOrDefault(g => g.Type == GroupType.Branch && g.Id == listQuery.Model.BranchId)?.DisplayName,
                ProlongDayCount = listQuery.Model.ProlongDayCount,
                CollateralType = listQuery.Model.CollateralType,
                DisplayStatus = listQuery.Model.DisplayStatus,
                LoanCost = listQuery.Model.LoanCost,
                List = _contractMonitoringRepository.List(listQuery.Model).ToList(),
            };

            using (var stream = _contractMonitoringExcelBuilder.Build(model))
            {
                var fileName = await _storage.Save(stream, ContainerName.Temp, "contractMonitoring.xlsx");
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

        [HttpPost]
        [Authorize(Permissions.AccountAnalysisView)]
        public AccountAnalysisModel AccountAnalysis([FromBody] ListQueryModel<AccountAnalysisQueryModel> listQuery)
        {
            if (listQuery == null) throw new ArgumentNullException(nameof(listQuery));
            if (listQuery.Model == null) listQuery.Model = new AccountAnalysisQueryModel
            {
                Month = DateTime.Now.Month,
                Year = DateTime.Now.Year,
                BranchId = _branchContext.Branch.Id
            };

            var query = new
            {
                BeginDate = new DateTime(listQuery.Model.Year, listQuery.Model.Month, 1),
                EndDate = new DateTime(listQuery.Model.Year, listQuery.Model.Month, 1, 23, 59, 59).AddMonths(1).AddDays(-1),
                BranchId = listQuery.Model.BranchId,
                AccountId = listQuery.Model.AccountId
            };

            var model = new AccountAnalysisModel
            {
                BeginDate = query.BeginDate,
                EndDate = query.EndDate,
                BranchId = listQuery.Model.BranchId,
                BranchName = _memberRepository.Groups(_sessionContext.UserId, null)
                    .FirstOrDefault(g => g.Type == GroupType.Branch && g.Id == listQuery.Model.BranchId)?.DisplayName,
                AccountId = listQuery.Model.AccountId,
                AccountCode = _accountRepository.Get(listQuery.Model.AccountId)?.Code,
                List = _accountAnalysisRepository.List(query).ToList(),
                Group = _accountAnalysisRepository.Group(query),
            };

            return model;
        }

        public ListModel<dynamic> AccountAnalysisList([FromBody] ListQueryModel<AccountAnalysisQueryModel> listQuery)
        {
            if (listQuery == null) throw new ArgumentNullException(nameof(listQuery));
            if (listQuery.Model == null) listQuery.Model = new AccountAnalysisQueryModel
            {
                Month = DateTime.Now.Month,
                Year = DateTime.Now.Year,
                BranchId = _branchContext.Branch.Id
            };

            var query = new
            {
                BeginDate = new DateTime(listQuery.Model.Year, listQuery.Model.Month, 1),
                EndDate = new DateTime(listQuery.Model.Year, listQuery.Model.Month, 1, 23, 59, 59).AddMonths(1).AddDays(-1),
                BranchId = listQuery.Model.BranchId,
                AccountId = listQuery.Model.AccountId
            };

            return new ListModel<dynamic>
            {
                List = _accountAnalysisRepository.List(query).ToList(),
                Count = _accountAnalysisRepository.List(query).ToList().Count
            };
        }

        [HttpPost]
        public ListModel<CashOrder> CashOrders([FromBody] ListQueryModel<CashOrdersQueryModel> listQuery)
        {
            if (listQuery == null) throw new ArgumentNullException(nameof(listQuery));
            if (listQuery.Model == null) listQuery.Model = new CashOrdersQueryModel
            {
                Month = DateTime.Now.Month,
                Year = DateTime.Now.Year,
                BranchId = _branchContext.Branch.Id
            };

            var query = new
            {
                BeginDate = new DateTime(listQuery.Model.Year, listQuery.Model.Month, 1),
                EndDate = new DateTime(listQuery.Model.Year, listQuery.Model.Month, 1, 23, 59, 59).AddMonths(1).AddDays(-1),
                BranchId = listQuery.Model.BranchId,
                DebitAccountId = listQuery.Model.DebitAccountId,
                CreditAccountId = listQuery.Model.CreditAccountId
            };

            return new ListModel<CashOrder>
            {
                List = _accountAnalysisRepository.CashOrders(query).ToList(),
            };            
        }

        [HttpPost]
        [Authorize(Permissions.AccountAnalysisView)]
        public async Task<IActionResult> ExportAccountAnalysis([FromBody] ListQueryModel<AccountAnalysisQueryModel> listQuery)
        {
            if (listQuery == null) throw new ArgumentNullException(nameof(listQuery));
            if (listQuery.Model == null) listQuery.Model = new AccountAnalysisQueryModel
            {
                Month = DateTime.Now.Month,
                Year = DateTime.Now.Year,
                BranchId = _branchContext.Branch.Id
            };

            var query = new
            {
                BeginDate = new DateTime(listQuery.Model.Year, listQuery.Model.Month, 1),
                EndDate = new DateTime(listQuery.Model.Year, listQuery.Model.Month, 1, 23, 59, 59).AddMonths(1).AddDays(-1),
                BranchId = listQuery.Model.BranchId,
                AccountId = listQuery.Model.AccountId
            };

            var model = new AccountAnalysisModel
            {
                BeginDate = query.BeginDate,
                EndDate = query.EndDate,
                BranchId = listQuery.Model.BranchId,
                BranchName = _memberRepository.Groups(_sessionContext.UserId, null)
                    .FirstOrDefault(g => g.Type == GroupType.Branch && g.Id == listQuery.Model.BranchId)?.DisplayName,
                AccountId = listQuery.Model.AccountId,
                AccountCode = _accountRepository.Get(listQuery.Model.AccountId)?.Code,
                List = _accountAnalysisRepository.List(query).ToList(),
                Group = _accountAnalysisRepository.Group(query),
            };

            using (var stream = _accountAnalysisExcelBuilder.Build(model))
            {
                var fileName = await _storage.Save(stream, ContainerName.Temp, "accountAnalysis.xlsx");
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

        [HttpPost]
        [Authorize]
        public string Report([FromBody] ReportQueryModel queryModel)
        {
            if (queryModel == null) throw new ArgumentNullException(nameof(queryModel));
            if (string.IsNullOrWhiteSpace(queryModel.ReportName)) throw new ArgumentNullException(nameof(queryModel.ReportName));

            var report = new StiReport();
            if (queryModel.ReportName == "CashBookReport")
            {
                if (!_sessionContext.HasPermission(Permissions.CashBookView)) throw new PawnshopApplicationException("У вас недостаточно прав для просмотра отчета, обратитесь к администратору");

                var model = JsonConvert.DeserializeObject<CashBookQueryModel>(queryModel.ReportQuery);
                report.Load(StiNetCoreHelper.MapPath(this, "Reports/CashBookReport.mrt"));
                report["branchId"] = model.BranchId;
                report["beginDate"] = model.CurrentDate.Date;
                report["endDate"] = model.CurrentDate.Date.AddHours(23).AddMinutes(59).AddSeconds(59);
                report["accountId"] = _branchContext.Configuration.CashOrderSettings.CashAccountId;
                report["chiefAccountantName"] = _branchContext.Configuration.LegalSettings.ChiefAccountantName;
                report["cashierName"] = _branchContext.Configuration.LegalSettings.CashierName;
            }
            else if (queryModel.ReportName == "CashBalanceReport")
            {
                if (!_sessionContext.HasPermission(Permissions.CashBalanceView)) throw new PawnshopApplicationException("У вас недостаточно прав для просмотра отчета, обратитесь к администратору");

                var model = JsonConvert.DeserializeObject<CashBalanceQueryModel>(queryModel.ReportQuery);
                report.Load(StiNetCoreHelper.MapPath(this, "Reports/CashBalanceReport.mrt"));
                report["userId"] = _sessionContext.UserId;
                report["beginDate"] = model.CurrentDate.Date;
                report["endDate"] = model.CurrentDate.Date.AddHours(23).AddMinutes(59).AddSeconds(59);
                report["accountId"] = _branchContext.Configuration.CashOrderSettings.CashAccountId;
            }
            else if (queryModel.ReportName == "CashReport")
            {
                if (!_sessionContext.HasPermission(Permissions.CashReportView)) throw new PawnshopApplicationException("У вас недостаточно прав для просмотра отчета, обратитесь к администратору");

                var model = JsonConvert.DeserializeObject<CashReportQueryModel>(queryModel.ReportQuery);
                report.Load(StiNetCoreHelper.MapPath(this, "Reports/CashReport.mrt"));
                report["branchId"] = model.BranchId;
                report["beginDate"] = new DateTime(model.Year, model.Month, 1);
                report["endDate"] = new DateTime(model.Year, model.Month, 1, 23, 59, 59).AddMonths(1).AddDays(-1);
                report["cashAccountId"] = _branchContext.Configuration.CashOrderSettings.CashAccountId;
                report["goldAccountId"] = _branchContext.Configuration.CashOrderSettings.GoldCollateralSettings.SellingSettings.CreditId;
                report["autoAccountId"] = _branchContext.Configuration.CashOrderSettings.CarCollateralSettings.SellingSettings.CreditId;
                report["goodsAccountId"] = _branchContext.Configuration.CashOrderSettings.GoodCollateralSettings.SellingSettings.CreditId;
                report["machineryAccountId"] = _branchContext.Configuration.CashOrderSettings.MachineryCollateralSettings.SellingSettings.CreditId;
            }
            else if (queryModel.ReportName == "SellingReport")
            {
                if (!_sessionContext.HasPermission(Permissions.SellingReportView)) throw new PawnshopApplicationException("У вас недостаточно прав для просмотра отчета, обратитесь к администратору");

                var model = JsonConvert.DeserializeObject<SellingReportQueryModel>(queryModel.ReportQuery);
                report.Load(StiNetCoreHelper.MapPath(this, "Reports/SellingReport.mrt"));
                report["branchId"] = model.BranchId;
                report["beginDate"] = model.BeginDate.Date;
                report["endDate"] = model.EndDate.Date.AddHours(23).AddMinutes(59).AddSeconds(59);
                report["status"] = model.Status ?? 0;
            }
            else if (queryModel.ReportName == "DelayReport")
            {
                if (!_sessionContext.HasPermission(Permissions.DelayReportView)) throw new PawnshopApplicationException("У вас недостаточно прав для просмотра отчета, обратитесь к администратору");

                var model = JsonConvert.DeserializeObject<DelayReportQueryModel>(queryModel.ReportQuery);
                report.Load(StiNetCoreHelper.MapPath(this, "Reports/DelayReport.mrt"));
                report["beginDelayCount"] = model.BeginDelayCount;
                report["endDelayCount"] = model.EndDelayCount;
                report["collateralType"] = model.CollateralType;
                report["branchId"] = model.BranchId;
            }
            else if (queryModel.ReportName == "DailyReport")
            {
                if (!_sessionContext.HasPermission(Permissions.DailyReportView)) throw new PawnshopApplicationException("У вас недостаточно прав для просмотра отчета, обратитесь к администратору");

                var model = JsonConvert.DeserializeObject<DailyReportQueryModel>(queryModel.ReportQuery);
                report.Load(StiNetCoreHelper.MapPath(this, "Reports/DailyReport.mrt"));
                report["branchId"] = model.BranchId;
                report["beginDate"] = model.CurrentDate.Date;
                report["endDate"] = model.CurrentDate.Date.AddHours(23).AddMinutes(59).AddSeconds(59);
                report["accountId"] = _branchContext.Configuration.CashOrderSettings.CashAccountId;
            }
            else if (queryModel.ReportName == "ConsolidateReport")
            {
                if (!_sessionContext.HasPermission(Permissions.ConsolidateReportView)) throw new PawnshopApplicationException("У вас недостаточно прав для просмотра отчета, обратитесь к администратору");

                var model = JsonConvert.DeserializeObject<ConsolidateReportQueryModel>(queryModel.ReportQuery);
                report.Load(StiNetCoreHelper.MapPath(this, "Reports/ConsolidateReport.mrt"));
                report["branchId"] = model.BranchId;
                report["beginDate"] = model.BeginDate.Date;
                report["endDate"] = model.EndDate.Date.AddHours(23).AddMinutes(59).AddSeconds(59);
                report["cashAccountId"] = _branchContext.Configuration.CashOrderSettings.CashAccountId;
                report["goldAccountId"] = _branchContext.Configuration.CashOrderSettings.GoldCollateralSettings.SellingSettings.CreditId ?? 0;
                report["autoAccountId"] = _branchContext.Configuration.CashOrderSettings.CarCollateralSettings.SellingSettings.CreditId ?? 0;
                report["goodsAccountId"] = _branchContext.Configuration.CashOrderSettings.GoodCollateralSettings.SellingSettings.CreditId ?? 0;
                report["machineryAccountId"] = _branchContext.Configuration.CashOrderSettings.MachineryCollateralSettings.SellingSettings.CreditId ?? 0;
                report["userId"] = _sessionContext.UserId;
            }
            else if (queryModel.ReportName == "SfkConsolidateReport")
            {
                if (!_sessionContext.HasPermission(Permissions.ConsolidateReportView)) throw new PawnshopApplicationException("У вас недостаточно прав для просмотра отчета, обратитесь к администратору");

                var model = JsonConvert.DeserializeObject<ConsolidateReportQueryModel>(queryModel.ReportQuery);
                report.Load(StiNetCoreHelper.MapPath(this, "Reports/SfkConsolidateReport.mrt"));
                report["branchId"] = model.BranchId;
                if (model.IsPeriod == true)
                {
                    report["beginDate"] = model.BeginDate.Date;
                    report["endDate"] = model.EndDate.Date.AddHours(23).AddMinutes(59).AddSeconds(59);
                }
                else
                {
                    report["beginDate"] = model.BeginDate.Date.AddHours(23).AddMinutes(59).AddSeconds(59);
                }
                report["userId"] = _sessionContext.UserId;
                report["isPeriod"] = model.IsPeriod;
            }
            else if (queryModel.ReportName == "DiscountReport")
            {
                if (!_sessionContext.HasPermission(Permissions.DiscountReportView)) throw new PawnshopApplicationException("У вас недостаточно прав для просмотра отчета, обратитесь к администратору");

                var model = JsonConvert.DeserializeObject<DiscountReportQueryModel>(queryModel.ReportQuery);
                report.Load(StiNetCoreHelper.MapPath(this, "Reports/DiscountReport.mrt"));
                report["branchId"] = model.BranchId;
                if(model.Month==0)
                {
                report["beginDate"] = new DateTime(model.Year, 1, 1);
                report["endDate"] = new DateTime(model.Year,12, 31, 23, 59, 59);
                }
                else{
                report["beginDate"] = new DateTime(model.Year, model.Month, 1);
                report["endDate"] = new DateTime(model.Year, model.Month, 1, 23, 59, 59).AddMonths(1).AddDays(-1);
                }
            }
            else if (queryModel.ReportName == "AccountCardReport")
            {
                if (!_sessionContext.HasPermission(Permissions.AccountCardView)) throw new PawnshopApplicationException("У вас недостаточно прав для просмотра отчета, обратитесь к администратору");

                var model = JsonConvert.DeserializeObject<AccountCardQueryModel>(queryModel.ReportQuery);
                report.Load(StiNetCoreHelper.MapPath(this, "Reports/AccountCardReport.mrt"));
                report["branchId"] = model.BranchId;
                report["beginDate"] = model.BeginDate.Date;
                report["endDate"] = model.EndDate.Date.AddHours(23).AddMinutes(59).AddSeconds(59);
                report["accountId"] = model.AccountId;
            }
            else if (queryModel.ReportName == "AccountCycleReport")
            {
                if (!_sessionContext.HasPermission(Permissions.AccountCycleView)) throw new PawnshopApplicationException("У вас недостаточно прав для просмотра отчета, обратитесь к администратору");

                var model = JsonConvert.DeserializeObject<AccountCycleQueryModel>(queryModel.ReportQuery);
                report.Load(StiNetCoreHelper.MapPath(this, "Reports/AccountCycleReport.mrt"));
                report["branchId"] = model.BranchId;
                report["beginDate"] = model.BeginDate.Date;
                report["endDate"] = model.EndDate.Date.AddHours(23).AddMinutes(59).AddSeconds(59);
            }
            else if (queryModel.ReportName == "GoldPriceReport")
            {
                if (!_sessionContext.HasPermission(Permissions.GoldPriceView)) throw new PawnshopApplicationException("У вас недостаточно прав для просмотра отчета, обратитесь к администратору");

                var model = JsonConvert.DeserializeObject<GoldPriceQueryModel>(queryModel.ReportQuery);
                report.Load(StiNetCoreHelper.MapPath(this, "Reports/GoldPriceReport.mrt"));
                report["branchId"] = model.BranchId;
                report["beginDate"] = model.BeginDate.Date;
                report["endDate"] = model.EndDate.Date.AddHours(23).AddMinutes(59).AddSeconds(59);
                report["queryPrice"] = model.QueryPrice;
            }
            else if (queryModel.ReportName == "ExpenseMonthReport")
            {
                if (!_sessionContext.HasPermission(Permissions.ExpenseMonthReportView)) throw new PawnshopApplicationException("У вас недостаточно прав для просмотра отчета, обратитесь к администратору");

                var model = JsonConvert.DeserializeObject<ExpenseMonthReportQueryModel>(queryModel.ReportQuery);
                report.Load(StiNetCoreHelper.MapPath(this, "Reports/ExpenseMonthReport.mrt"));
                report["branchId"] = model.BranchId;
                report["beginDate"] = new DateTime(model.Year, model.Month, 1);
                report["endDate"] = new DateTime(model.Year, model.Month, 1, 23, 59, 59).AddMonths(1).AddDays(-1);
                report["userId"] = _sessionContext.UserId;
            }
            else if (queryModel.ReportName == "ExpenseYearReport")
            {
                if (!_sessionContext.HasPermission(Permissions.ExpenseYearReportView)) throw new PawnshopApplicationException("У вас недостаточно прав для просмотра отчета, обратитесь к администратору");

                var model = JsonConvert.DeserializeObject<ExpenseYearReportQueryModel>(queryModel.ReportQuery);
                report.Load(StiNetCoreHelper.MapPath(this, "Reports/ExpenseYearReport.mrt"));
                report["branchId"] = model.BranchId;
                report["beginDate"] = new DateTime(model.Year, 1, 1);
                report["endDate"] = new DateTime(model.Year, 12, 31, 23, 59, 59);
                report["userId"] = _sessionContext.UserId;
            }
            else if (queryModel.ReportName == "OperationalReport")
            {
                if (!_sessionContext.HasPermission(Permissions.OperationalReportView)) throw new PawnshopApplicationException("У вас недостаточно прав для просмотра отчета, обратитесь к администратору");

                var model = JsonConvert.DeserializeObject<OperationalReportQueryModel>(queryModel.ReportQuery);
                report.Load(StiNetCoreHelper.MapPath(this, "Reports/OperationalReport.mrt"));
                report["beginDate"] = model.BeginDate;
                report["endDate"] = model.EndDate.Date.AddHours(23).AddMinutes(59).AddSeconds(59);
                report["userId"] = _sessionContext.UserId;
                report["cashAccountId"] = _branchContext.Configuration.CashOrderSettings.CashAccountId;
                report["goldAccountId"] = _branchContext.Configuration.CashOrderSettings.GoldCollateralSettings.SellingSettings.CreditId;
                report["autoAccountId"] = _branchContext.Configuration.CashOrderSettings.CarCollateralSettings.SellingSettings.CreditId;
                report["goodsAccountId"] = _branchContext.Configuration.CashOrderSettings.GoodCollateralSettings.SellingSettings.CreditId;
                report["machineryAccountId"] = _branchContext.Configuration.CashOrderSettings.MachineryCollateralSettings.SellingSettings.CreditId;
                report["sfkTransferAccountId"] = _branchContext.Configuration.CashOrderSettings.CarTransferSettings.SupplyDebtSettings.DebitId;
                report["sfkBuyoutAccountId"] = _branchContext.Configuration.CashOrderSettings.CarTransferSettings.DebtSettings.CreditId;
            }
            else if (queryModel.ReportName == "SplitProfitReport")
            {
                if (!_sessionContext.HasPermission(Permissions.SplitProfitReportView)) throw new PawnshopApplicationException("У вас недостаточно прав для просмотра отчета, обратитесь к администратору");

                var model = JsonConvert.DeserializeObject<SplitProfitReportQueryModel>(queryModel.ReportQuery);
                report.Load(StiNetCoreHelper.MapPath(this, "Reports/SplitProfitReport.mrt"));
                report["branchId"] = model.BranchId;
                report["endDate"] = model.EndDate.Date.AddHours(23).AddMinutes(59).AddSeconds(59);
                report["userId"] = _sessionContext.UserId;
            }
            else if (queryModel.ReportName == "InsuranceReport")
            {
                if (!_sessionContext.HasPermission(Permissions.InsuranceReportView)) throw new PawnshopApplicationException("У вас недостаточно прав для просмотра отчета, обратитесь к администратору");

                var model = JsonConvert.DeserializeObject<InsuranceReportQueryModel>(queryModel.ReportQuery);
                report.Load(StiNetCoreHelper.MapPath(this, "Reports/InsuranceReport.mrt"));
                report["branchId"] = model.BranchId;
                report["beginDate"] = model.BeginDate.Date;
                report["endDate"] = model.EndDate.Date.AddHours(23).AddMinutes(59).AddSeconds(59);
                report["userId"] = _sessionContext.UserId;
                report["status"] = model.Status;
            }
            else if (queryModel.ReportName == "OrderRegisterReport")
            {
                if (!_sessionContext.HasPermission(Permissions.OrderRegisterView)) throw new PawnshopApplicationException("У вас недостаточно прав для просмотра отчета, обратитесь к администратору");

                var model = JsonConvert.DeserializeObject<OrderRegisterQueryModel>(queryModel.ReportQuery);
                report.Load(StiNetCoreHelper.MapPath(this, "Reports/OrderRegisterReport.mrt"));
                report["branchId"] = model.BranchId;
                report["beginDate"] = model.BeginDate.Date;
                report["endDate"] = model.EndDate.Date.AddHours(23).AddMinutes(59).AddSeconds(59);
                report["userId"] = _sessionContext.UserId;
                report["accountType"] = model.AccountType;
                report["accountId"] = model.AccountId;
            }
            else if (queryModel.ReportName == "ProfitReport")
            {
                if (!_sessionContext.HasPermission(Permissions.ProfitReportView)) throw new PawnshopApplicationException("У вас недостаточно прав для просмотра отчета, обратитесь к администратору");

                var model = JsonConvert.DeserializeObject<ProfitReportQueryModel>(queryModel.ReportQuery);
                report.Load(StiNetCoreHelper.MapPath(this, "Reports/ProfitReport.mrt"));
                report["branchId"] = model.BranchId;
                report["beginDate"] = model.BeginDate.Date;
                report["endDate"] = model.EndDate.Date.AddHours(23).AddMinutes(59).AddSeconds(59);
                report["userId"] = _sessionContext.UserId;
                report["collateralType"] = model.CollateralType;
            }
            else if (queryModel.ReportName == "SfkProfitReport")
            {
                if (!_sessionContext.HasPermission(Permissions.ProfitReportView)) throw new PawnshopApplicationException("У вас недостаточно прав для просмотра отчета, обратитесь к администратору");

                var model = JsonConvert.DeserializeObject<ProfitReportQueryModel>(queryModel.ReportQuery);
                report.Load(StiNetCoreHelper.MapPath(this, "Reports/SfkProfitReport.mrt"));
                report["branchId"] = model.BranchId;
                report["beginDate"] = model.BeginDate.Date;
                report["endDate"] = model.EndDate.Date.AddHours(23).AddMinutes(59).AddSeconds(59);
                report["userId"] = _sessionContext.UserId;
                report["collateralType"] = model.CollateralType;
            }
            else if (queryModel.ReportName == "ReconciliationReport")
            {
                if (!_sessionContext.HasPermission(Permissions.ReconciliationReportView)) throw new PawnshopApplicationException("У вас недостаточно прав для просмотра отчета, обратитесь к администратору");

                var model = JsonConvert.DeserializeObject<ReconciliationReportQueryModel>(queryModel.ReportQuery);
                report.Load(StiNetCoreHelper.MapPath(this, "Reports/ReconciliationReport.mrt"));
                report["beginDate"] = model.BeginDate.Date;
                report["endDate"] = model.EndDate.Date.AddHours(23).AddMinutes(59).AddSeconds(59);
            }
            else if (queryModel.ReportName == "ConsolidateProfitReport")
            {
                if (!_sessionContext.HasPermission(Permissions.ProfitReportView)) throw new PawnshopApplicationException("У вас недостаточно прав для просмотра отчета, обратитесь к администратору");

                var model = JsonConvert.DeserializeObject<ConsolidateProfitReportQueryModel>(queryModel.ReportQuery);
                report.Load(StiNetCoreHelper.MapPath(this, "Reports/ConsolidateProfitReport.mrt"));
                report["beginDate"] = model.BeginDate.Date;
                report["endDate"] = model.EndDate.Date.AddHours(23).AddMinutes(59).AddSeconds(59);
                report["collateralType"] = model.CollateralType;
            }
            else if (queryModel.ReportName == "SfkConsolidateProfitReport")
            {
                if (!_sessionContext.HasPermission(Permissions.ProfitReportView)) throw new PawnshopApplicationException("У вас недостаточно прав для просмотра отчета, обратитесь к администратору");

                var model = JsonConvert.DeserializeObject<ConsolidateProfitReportQueryModel>(queryModel.ReportQuery);
                report.Load(StiNetCoreHelper.MapPath(this, "Reports/SfkConsolidateProfitReport.mrt"));
                report["beginDate"] = model.BeginDate.Date;
                report["endDate"] = model.EndDate.Date.AddHours(23).AddMinutes(59).AddSeconds(59);
                report["collateralType"] = model.CollateralType;
            }
            else if (queryModel.ReportName == "PaymentReport")
            {
                if (!_sessionContext.HasPermission(Permissions.PaymentReportView)) throw new PawnshopApplicationException("У вас недостаточно прав для просмотра отчета, обратитесь к администратору");

                var model = JsonConvert.DeserializeObject<PaymentReportQueryModel>(queryModel.ReportQuery);
                report.Load(StiNetCoreHelper.MapPath(this, "Reports/PaymentReport.mrt"));
                report["branchId"] = model.BranchId;
                report["beginDate"] = model.CurrentDate.Date;
                report["endDate"] = model.CurrentDate.Date.AddHours(23).AddMinutes(59).AddSeconds(59);
            }
            else if (queryModel.ReportName == "IssuanceReport")
            {
                if (!_sessionContext.HasPermission(Permissions.IssuanceReportView)) throw new PawnshopApplicationException("У вас недостаточно прав для просмотра отчета, обратитесь к администратору");

                var model = JsonConvert.DeserializeObject<IssuanceReportQueryModel>(queryModel.ReportQuery);
                report.Load(StiNetCoreHelper.MapPath(this, "Reports/IssuanceReport.mrt"));
                report["branchId"] = model.BranchId;
                report["beginDate"] = model.BeginDate.Date;
                report["endDate"] = model.EndDate.Date.AddHours(23).AddMinutes(59).AddSeconds(59);
                report["userId"] = _sessionContext.UserId;
            }
            else if (queryModel.ReportName == "ReinforceAndWithdrawReport")
            {
                if (!_sessionContext.HasPermission(Permissions.ReinforceAndWithdrawReportView)) throw new PawnshopApplicationException("У вас недостаточно прав для просмотра отчета, обратитесь к администратору");

                var model = JsonConvert.DeserializeObject<ReinforceAndWithdrawReportQueryModel>(queryModel.ReportQuery);
                report.Load(StiNetCoreHelper.MapPath(this, "Reports/ReinforceAndWithdrawReport.mrt"));
                report["branchId"] = model.BranchId;
                report["beginDate"] = model.BeginDate.Date;
                report["endDate"] = model.EndDate.Date.AddHours(23).AddMinutes(59).AddSeconds(59);
            }
            else if (queryModel.ReportName == "SfkTransferedReport")
            {
                if (!_sessionContext.HasPermission(Permissions.ConsolidateReportView)) throw new PawnshopApplicationException("У вас недостаточно прав для просмотра отчета, обратитесь к администратору");

                report.Load(StiNetCoreHelper.MapPath(this, "Reports/SfkTransferedReport.mrt"));
            }
            else if (queryModel.ReportName == "AccountableReport")
            {
                if (!_sessionContext.HasPermission(Permissions.AccountableReportView)) throw new PawnshopApplicationException("У вас недостаточно прав для просмотра отчета, обратитесь к администратору");

                report.Load(StiNetCoreHelper.MapPath(this, "Reports/AccountableReport.mrt"));
                var model = JsonConvert.DeserializeObject<AccountableReportQueryModel>(queryModel.ReportQuery);
                report["accountIds"] = string.Join(",",model.AccountIds);
                report["branchIds"] = string.Join(",", model.BranchIds);
                report["beginDate"] = model.BeginDate.Date;
                report["endDate"] = model.EndDate.Date.AddHours(23).AddMinutes(59).AddSeconds(59);
                report["userId"] = _sessionContext.UserId;
            }
            else if (queryModel.ReportName == "NotificationReport")
            {
                if (!_sessionContext.HasPermission(Permissions.NotificationReportView)) throw new PawnshopApplicationException("У вас недостаточно прав для просмотра отчета, обратитесь к администратору");

                report.Load(StiNetCoreHelper.MapPath(this, "Reports/NotificationReport.mrt"));
                var model = JsonConvert.DeserializeObject<NotificationReportQueryModel>(queryModel.ReportQuery);
                report["branchId"] = model.BranchId;
                report["beginDate"] = model.BeginDate.Date;
                report["endDate"] =  model.BeginDate.Date.AddHours(23).AddMinutes(59).AddSeconds(59);
                report["userId"] = _sessionContext.UserId;
            }
            else if (queryModel.ReportName == "RegionMonitoringReport")
            {
                if (!_sessionContext.HasPermission(Permissions.RegionMonitoringReportView)) throw new PawnshopApplicationException("У вас недостаточно прав для просмотра отчета, обратитесь к администратору");

                report.Load(StiNetCoreHelper.MapPath(this, "Reports/RegionMonitoringReport.mrt"));
                var model = JsonConvert.DeserializeObject<RegionMonitoringReportQueryModel>(queryModel.ReportQuery);
                report["branchIds"] = string.Join(",",model.BranchIds);
                report["beginDate"] = model.BeginDate.Date.AddHours(23).AddMinutes(59).AddSeconds(59);
            }
            else if (queryModel.ReportName == "StatisticsReport")
            {
                if (!_sessionContext.HasPermission(Permissions.StatisticsReportView)) throw new PawnshopApplicationException("У вас недостаточно прав для просмотра отчета, обратитесь к администратору");

                report.Load(StiNetCoreHelper.MapPath(this, "Reports/StatisticsReport.mrt"));
                var model = JsonConvert.DeserializeObject<StatisticsReportQueryModel>(queryModel.ReportQuery);
                report["branchIds"] = string.Join(",",model.BranchIds);
                report["beginDate"] = model.BeginDate.Date;
                report["endDate"] = model.EndDate.Date.AddHours(23).AddMinutes(59).AddSeconds(59);
            }

            var sqlDatabase = (report.Dictionary.Databases["ReportConnection"] as StiSqlDatabase) ?? ((StiSqlDatabase)report.Dictionary.Databases[0]);
            sqlDatabase.ConnectionString = _options.DatabaseConnectionString;

            report.Render();
            return report.SaveDocumentJsonToString();
        }
    }
}