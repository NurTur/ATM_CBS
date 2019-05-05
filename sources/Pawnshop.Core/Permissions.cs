using System.Collections.Generic;

namespace Pawnshop.Core
{
    public static class Permissions
    {
        public static readonly IEnumerable<Permission> All = new List<Permission>();

        public const string UserView = "UserView";
        public const string UserManage = "UserManage";
        public const string GroupView = "GroupView";
        public const string GroupManage = "GroupManage";
        public const string RoleView = "RoleView";
        public const string RoleManage = "RoleManage";
        public const string PersonView = "PersonView";
        public const string PersonManage = "PersonManager";
        public const string CompanyView = "CompanyView";
        public const string CompanyManage = "CompanyManager";
        public const string CategoryView = "CategoryView";
        public const string CategoryManage = "CategoryManager";
        public const string GoldView = "GoldView";
        public const string GoldManage = "GoldManager";
        public const string GoodsView = "GoodsView";
        public const string GoodsManage = "GoodsManager";
        public const string CarView = "CarView";
        public const string CarManage = "CarManager";
        public const string ContractView = "ContractView";
        public const string ContractManage = "ContractManager";
        public const string ContractDiscount = "ContractDiscount";
        public const string ContractTransfer = "ContractTransfer";
        public const string AccountView = "AccountView";
        public const string AccountManage = "AccountManager";
        public const string CashOrderView = "CashOrderView";
        public const string CashOrderManage = "CashOrderManager";
        public const string CashOrderApprove = "CashOrderApprove";
        public const string MachineryView = "MachineryView";
        public const string MachineryManage = "MachineryManage";
        public const string ClientBlackListReasonView = "ClientBlackListReasonView";
        public const string ClientBlackListReasonManage = "ClientBlackListReasonManage";

        public const string OrganizationConfigurationManage = "OrganizationConfigurationManage";
        public const string BranchConfigurationManage = "BranchConfigurationManage";

        public const string ClientCardTypeManage = "ClientCardTypeManage";

        public const string LoanPercentSettingView = "LoanPercentSettingView";
        public const string LoanPercentSettingManage = "LoanPercentSettingManage";

        public const string PurityView = "PurityView";
        public const string PurityManage = "PurityManage";

        public const string SellingView = "SellingView";
        public const string SellingManage = "SellingManage";

        public const string EventLogView = "EventLogView";
        public const string EventLogFullView = "EventLogFullView";

        public const string ExpenseGroupView = "ExpenseGroupView";
        public const string ExpenseGroupManage = "ExpenseGroupManage";
        public const string ExpenseTypeView = "ExpenseTypeView";
        public const string ExpenseTypeManage = "ExpenseTypeManage";

        public const string NotificationView = "NotificationView";
        public const string NotificationManage = "NotificationManage";

        public const string InvestmentView = "InvestmentView";
        public const string InvestmentManage = "InvestmentManage";

        public const string InsuranceView = "InsuranceView";
        public const string InsuranceManage = "InsuranceManage";
        public const string InsuranceActionManage = "InsuranceActionManage";

        public const string AssetView = "AssetView";
        public const string AssetManage = "AssetManage";

        public const string CashBookView = "CashBookView";
        public const string CashBalanceView = "CashBalanceView";
        public const string ContractMonitoringView = "ContractMonitoringView";
        public const string CashReportView = "CashReportView";
        public const string SellingReportView = "SellingReportView";
        public const string DelayReportView = "DelayReportView";
        public const string DailyReportView = "DailyReportView";
        public const string ConsolidateReportView = "ConsolidateReportView";
        public const string DiscountReportView = "DiscountReportView";
        public const string AccountCardView = "AccountCardView";
        public const string OrderRegisterView = "OrderRegisterView";
        public const string AccountAnalysisView = "AccountAnalysisView";
        public const string AccountCycleView = "AccountCycleView";
        public const string GoldPriceView = "GoldPriceView";
        public const string ExpenseMonthReportView = "ExpenseMonthReportView";
        public const string ExpenseYearReportView = "ExpenseYearReportView";
        public const string OperationalReportView = "OperationalReportView";
        public const string ProfitReportView = "ProfitReportView";
        public const string InsuranceReportView = "InsuranceReportView";
        public const string SplitProfitReportView = "SplitProfitReportView";
        public const string ReconciliationReportView = "ReconciliationReportView";
        public const string PaymentReportView = "PaymentReportView";
        public const string IssuanceReportView = "IssuanceReportView";

        public const string ContractOuterView = "ContractOuterView";
        public const string ReinforceAndWithdrawReportView = "ReinforceAndWithdrawReportView";
        public const string AccountableReportView = "AccountableReportView";
        public const string NotificationReportView = "NotificationReportView";
        public const string RegionMonitoringReportView = "RegionMonitoringReportView";
        public const string StatisticsReportView = "StatisticsReportView";

        static Permissions()
        {
            Register(UserView, "Просмотр списка пользователей");
            Register(UserManage, "Управление пользователями");
            Register(GroupView, "Просмотр списка групп");
            Register(GroupManage, "Управление группами");
            Register(RoleView, "Просмотр списка ролей");
            Register(RoleManage, "Управление ролями");
            Register(PersonView, "Просмотр списка клиентов");
            Register(PersonManage, "Управление клиентами");
            Register(CompanyView, "Просмотр списка клиентов-компаний");
            Register(CompanyManage, "Управление клиентами-компаниями");
            Register(CategoryView, "Просмотр списка категорий аналитики");
            Register(CategoryManage, "Управление категориями аналитики");
            Register(GoldView, "Просмотр списка позиций золота");
            Register(GoldManage, "Управление позициями золота");
            Register(GoodsView, "Просмотр списка позиций товара");
            Register(GoodsManage, "Управление позициями товара");
            Register(CarView, "Просмотр списка позиций автотранспорта");
            Register(CarManage, "Управление позициями автотранспорта");
            Register(ContractView, "Просмотр списка договоров");
            Register(ContractManage, "Управление договорами");
            Register(ContractDiscount, "Управление скидками договора");
            Register(ContractTransfer, "Управление передачей договора");
            Register(AccountView, "Просмотр списка счетов");
            Register(AccountManage, "Управление счетами");
            Register(CashOrderView, "Просмотр списка кассовых ордеров");
            Register(CashOrderManage, "Управление кассовыми ордерами");
            Register(CashOrderApprove, "Подтверждение кассового ордера");
            Register(OrganizationConfigurationManage, "Управление конфигурацией организации");
            Register(BranchConfigurationManage, "Управление конфигурацией филиала");
            Register(ClientCardTypeManage, "Изменение типа карты клиента");
            Register(LoanPercentSettingView, "Просмотр настроек процентов кредита");
            Register(LoanPercentSettingManage, "Управление настройками процентов кредита");
            Register(PurityView, "Просмотр списка проб");
            Register(PurityManage, "Управление пробами");
            Register(SellingView, "Просмотр списка реализации");
            Register(SellingManage, "Управление реализацией");
            Register(EventLogView, "Просмотр журнала событий по филиалу");
            Register(EventLogFullView, "Просмотр журнала событий по системе");
            Register(ExpenseGroupView, "Просмотр групп расходов");
            Register(ExpenseGroupManage, "Управление группами расходов");
            Register(ExpenseTypeView, "Просмотр видов расходов");
            Register(ExpenseTypeManage, "Управление видами расходов");
            Register(NotificationView, "Просмотр уведомлений");
            Register(NotificationManage, "Управление уведомлениями");
            Register(InvestmentView, "Просмотр инвестиций");
            Register(InvestmentManage, "Управление инвестициями");
            Register(InsuranceView, "Просмотр страховых договоров");
            Register(InsuranceManage, "Управление страховыми договорами");
            Register(InsuranceActionManage, "Управление действиями страховых договоров");
            Register(AssetView, "Просмотр основных средств");
            Register(AssetManage, "Управление основными средствами");
            Register(MachineryView, "Просмотр списка позиций спецтехники");
            Register(MachineryManage, "Управление позициями спецтехники");
            Register(ClientBlackListReasonView, "Просмотр списка причин добавления в черный список клиента");
            Register(ClientBlackListReasonManage, "Управление списком причин добавления в черный список клиента");

            Register(CashBookView, "Просмотр отчета \"Кассовая книга\"");
            Register(CashBalanceView, "Просмотр отчета \"Остаток в кассе\"");
            Register(ContractMonitoringView, "Просмотр отчета \"Мониторинг билетов\"");
            Register(CashReportView, "Просмотр отчета \"Кассовый отчет\"");
            Register(SellingReportView, "Просмотр отчета \"Отчет по реализации\"");
            Register(DelayReportView, "Просмотр отчета \"Просрочки\"");
            Register(DailyReportView, "Просмотр отчета \"Ежедневная сводка\"");
            Register(ConsolidateReportView, "Просмотр отчета \"Сводный отчет\"");
            Register(DiscountReportView, "Просмотр отчета о произведенных скидках");
            Register(AccountCardView, "Просмотр отчета \"Карточка счета\"");
            Register(OrderRegisterView, "Просмотр отчета \"Журнал ордер\"");
            Register(AccountAnalysisView, "Просмотр отчета \"Анализ счета\"");
            Register(AccountCycleView, "Просмотр отчета \"Обортная ведомость по счетам\"");
            Register(GoldPriceView, "Просмотр отчета \"Контроль оценки золота\"");
            Register(ExpenseMonthReportView, "Просмотр отчета \"Отслеживание расходов за месяц\"");
            Register(ExpenseYearReportView, "Просмотр отчета \"Отслеживание расходов за год\"");
            Register(OperationalReportView, "Просмотр оперативного отчета");
            Register(ProfitReportView, "Просмотр отчета \"Начисленные доходы\"");
            Register(InsuranceReportView, "Просмотр отчета по страховкам");
            Register(SplitProfitReportView, "Просмотр отчета по фактическому разделению доходов");
            Register(ReconciliationReportView, "Просмотр акта сверки");
            Register(PaymentReportView, "Просмотр отчета о предстоящей оплате");
            Register(IssuanceReportView, "Просмотр отчета \"Форма для выдачи свыше 3 000 000\"");
            Register(ReinforceAndWithdrawReportView, "Просмотр отчета подкрепления и снятия");
            Register(AccountableReportView, "Просмотр отчета \"Подотчетные платежи\"");
            Register(NotificationReportView, "Просмотр отчета \"Отчёт по уведомлениям\"");
            Register(RegionMonitoringReportView, "Просмотр отчета \"Региональный мониторинг по дате\"");
            Register(StatisticsReportView, "Просмотр отчета \"Анализ статистики по филиалам\"");
            Register(ContractOuterView, "Внешний просмотр информации о договоре");
        }

        private static void Register(string name, string displayName, string description = null)
        {
            var all = (List<Permission>) All;
            all.Add(new Permission
            {
                Name = name,
                DisplayName = displayName,
                Description = description
            });
        }
    }
}