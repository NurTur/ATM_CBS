using Autofac;
using Pawnshop.Data.Access;
using Pawnshop.Data.Access.Reports;

namespace Pawnshop.Data
{
    public class DataModule : Module
    {
        protected override void Load(ContainerBuilder builder)
        {
            CustomTypesInitializer.Init();

            builder.RegisterType<OrganizationRepository>().AsSelf();
            builder.RegisterType<UserRepository>().AsSelf();
            builder.RegisterType<MemberRepository>().AsSelf();
            builder.RegisterType<RoleRepository>().AsSelf();
            builder.RegisterType<GroupRepository>().AsSelf();
            builder.RegisterType<PersonRepository>().AsSelf();
            builder.RegisterType<CompanyRepository>().AsSelf();
            builder.RegisterType<BankRepository>().AsSelf();
            builder.RegisterType<CategoryRepository>().AsSelf();
            builder.RegisterType<GoldRepository>().AsSelf();
            builder.RegisterType<GoodsRepository>().AsSelf();
            builder.RegisterType<CarRepository>().AsSelf();
            builder.RegisterType<FileRepository>().AsSelf();
            builder.RegisterType<ContractFileRowRepository>().AsSelf();
            builder.RegisterType<ContractRepository>().AsSelf();
            builder.RegisterType<ClientRepository>().AsSelf();
            builder.RegisterType<ClientFileRowRepository>().AsSelf();
            builder.RegisterType<PositionRepository>().AsSelf();
            builder.RegisterType<ContractNumberCounterRepository>().AsSelf();
            builder.RegisterType<AccountRepository>().AsSelf();
            builder.RegisterType<CashOrderRepository>().AsSelf();
            builder.RegisterType<CashOrderNumberCounterRepository>().AsSelf();
            builder.RegisterType<ContractActionRepository>().AsSelf();
            builder.RegisterType<LoanPercentRepository>().AsSelf();
            builder.RegisterType<PurityRepository>().AsSelf();
            builder.RegisterType<SellingRepository>().AsSelf();
            builder.RegisterType<EventLogRepository>().AsSelf();
            builder.RegisterType<ContractMonitoringRepository>().AsSelf();
            builder.RegisterType<ContractNoteRepository>().AsSelf();
            builder.RegisterType<AccountAnalysisRepository>().AsSelf();
            builder.RegisterType<ExpenseGroupRepository>().AsSelf();
            builder.RegisterType<ExpenseTypeRepository>().AsSelf();
            builder.RegisterType<NotificationRepository>().AsSelf();
            builder.RegisterType<NotificationReceiverRepository>().AsSelf();
            builder.RegisterType<NotificationLogRepository>().AsSelf();
            builder.RegisterType<InvestmentRepository>().AsSelf();
            builder.RegisterType<InsuranceRepository>().AsSelf();
            builder.RegisterType<InsuranceActionRepository>().AsSelf();
            builder.RegisterType<RemittanceRepository>().AsSelf();
            builder.RegisterType<RemittanceSettingRepository>().AsSelf();
            builder.RegisterType<AssetRepository>().AsSelf();
            builder.RegisterType<MachineryRepository>().AsSelf();
            builder.RegisterType<InnerNotificationRepository>().AsSelf();
            builder.RegisterType<ClientBlackListReasonRepository>().AsSelf();
        }
    }
}