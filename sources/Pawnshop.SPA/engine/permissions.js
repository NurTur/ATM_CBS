const _permissions = {
    /* Безопасность */
    UserView                        : "UserView",
    UserManage                      : "UserManage",
    GroupView                       : "GroupView",
    GroupManage                     : "GroupManage",
    RoleView                        : "RoleView",
    RoleManage                      : "RoleManage",
    OrganizationView                : "OrganizationView",
    OrganizationManage              : "OrganizationManage",
    OrganizationConfigurationManage : "OrganizationConfigurationManage",
    BranchConfigurationManage       : "BranchConfigurationManage",
    LoanPercentSettingView          : "LoanPercentSettingView",
    LoanPercentSettingManage        : "LoanPercentSettingManage",
    EventLogView                    : "EventLogView",
    EventLogFullView                : "EventLogFullView",

    /* Справочники */
    CategoryView                    : "CategoryView",
    CategoryManage                  : "CategoryManager",
    GoldView                        : "GoldView",
    GoldManage                      : "GoldManager",
    GoodsView                       : "GoodsView",
    GoodsManage                     : "GoodsManager",
    CarView                         : "CarView",
    CarManage                       : "CarManager",
    MachineryView                   : "MachineryView",
    MachineryManage                 : "MachineryManager",
    AccountView                     : "AccountView",
    AccountManage                   : "AccountManager",
    PurityView                      : "PurityView",
    PurityManage                    : "PurityManage",
    ExpenseGroupView                : "ExpenseGroupView",
    ExpenseGroupManage              : "ExpenseGroupManage",
    ExpenseTypeView                 : "ExpenseTypeView",
    ExpenseTypeManage               : "ExpenseTypeManage",
    ClientBlackListReasonView       : "ClientBlackListReasonView",
    ClientBlackListReasonManage     : "ClientBlackListReasonManage",

    /* Бизнес */
    PersonView                      : "PersonView",
    PersonManage                    : "PersonManager",
    CompanyView                     : "CompanyView",
    CompanyManage                   : "CompanyManager",
    ContractView                    : "ContractView",
    ContractManage                  : "ContractManager",
    ContractDiscount                : "ContractDiscount",
    ContractTransfer                : "ContractTransfer",
    CashOrderView                   : "CashOrderView",
    CashOrderManage                 : "CashOrderManager",
    CashOrderApprove                : "CashOrderApprove",
    ClientCardTypeManage            : "ClientCardTypeManage",
    SellingView                     : "SellingView",
    SellingManage                   : "SellingManage",
    InsuranceView                   : "InsuranceView",
    InsuranceManage                 : "InsuranceManage",
    InsuranceActionManage           : "InsuranceActionManage",
    AssetView                       : "AssetView",
    AssetManage                     : "AssetManage",

    /* Отчеты */
    CashBookView                    : "CashBookView",
    CashBalanceView                 : "CashBalanceView",
    ContractMonitoringView          : "ContractMonitoringView",
    CashReportView                  : "CashReportView",
    SellingReportView               : "SellingReportView",
    DelayReportView                 : "DelayReportView",
    DailyReportView                 : "DailyReportView",
    ConsolidateReportView           : "ConsolidateReportView",
    DiscountReportView              : "DiscountReportView",
    AccountCardView                 : "AccountCardView",
    OrderRegisterView               : "OrderRegisterView",
    AccountAnalysisView             : "AccountAnalysisView",
    AccountCycleView                : "AccountCycleView",
    GoldPriceView                   : "GoldPriceView",
    ExpenseMonthReportView          : "ExpenseMonthReportView",
    ExpenseYearReportView           : "ExpenseYearReportView",
    OperationalReportView           : "OperationalReportView",
    ProfitReportView                : "ProfitReportView",
    InsuranceReportView             : "InsuranceReportView",
    SplitProfitReportView           : "SplitProfitReportView",
    ReconciliationReportView        : "ReconciliationReportView",
    PaymentReportView               : "PaymentReportView",
    IssuanceReportView              : "IssuanceReportView",
    ReinforceAndWithdrawReportView  : "ReinforceAndWithdrawReportView",
    AccountableReportView           : "AccountableReportView",
    NotificationReportView          : "NotificationReportView",
    RegionMonitoringReportView      : "RegionMonitoringReportView",
    StatisticsReportView            : "StatisticsReportView",

    /* Уведомления */
    NotificationView                : "NotificationView",
    NotificationManage              : "NotificationManage",
};

const defineGroup = (name, props, ...items) => {
    return {
        name: name,
        props: props,
        items: items
    }
};

const defineItem = (name, link, ...permissions) => {
    return {
        name: name,
        link: link,
        permissions: permissions
    }
};

const buildNavigationMap = () => {
    let map = [];
    map.push(
        defineGroup('Работа с клиентами', {},
            defineItem('Клиенты', '/persons', _permissions.PersonView),
            defineItem('Компании', '/companies', _permissions.CompanyView)
        ),
        defineGroup('Договоры', { branchDepended: true },
            defineItem('Договоры', '/contracts', _permissions.ContractView),
            defineItem('Реализация', '/sellings', _permissions.SellingView),
            defineItem('Страховые договоры', '/insurances', _permissions.InsuranceView)
        ),
        defineGroup('Кассовые ордера', { branchDepended: true },
            defineItem('Кассовые ордера', '/cashOrders', _permissions.CashOrderView),
            defineItem('Переводы', '/remittances', _permissions.CashOrderView)
        ),
        defineGroup('Администрирование', {},
            defineItem('Пользователи', '/users', _permissions.UserView),
            defineItem('Группы', '/groups', _permissions.GroupView),
            defineItem('Организации', '/organizations', _permissions.OrganizationView),
            defineItem('Роли', '/roles', _permissions.RoleView),
            defineItem('Настройки процентов', '/loanPercents', _permissions.LoanPercentSettingView),
            defineItem('Журнал событий', '/eventLogs', _permissions.EventLogView),
            defineItem('Настройки переводов', '/remittanceSettings', _permissions.BranchConfigurationManage),
            defineItem('Рассылка', '/notifications', _permissions.NotificationView),
            defineItem('Основные средства', '/assets', _permissions.AssetView),
            defineItem('Причины добавления клиентов в ЧС', '/clientBlackListReasons', _permissions.ClientBlackListReasonView),
        ),
        defineGroup('Справочники', {},
            defineItem('Категории аналитики', '/categories', _permissions.CategoryView),
            defineItem('Золото', '/golds', _permissions.GoldView),
            defineItem('Товары', '/goods', _permissions.GoodsView),
            defineItem('Автотранспорт', '/cars', _permissions.CarView),
            defineItem('Спецтехника', '/machineries', _permissions.MachineryView),
            defineItem('Счета', '/accounts', _permissions.AccountView),
            defineItem('Пробы', '/purities', _permissions.PurityView),
            defineItem('Группы расходов', '/expenseGroups', _permissions.ExpenseGroupView),
            defineItem('Виды расходов', '/expenseTypes', _permissions.ExpenseTypeView)
        ),
        defineGroup('Dashboard', { ignore: true, branchDepended: true },
            defineItem('Новый договор', '/contracts/0', _permissions.ContractManage),
            defineItem('Новый кассовый ордер', '/cashOrders/0', _permissions.CashOrderManage)
        ),
        defineGroup('Отчеты', {},
            defineItem('Кассовая книга', '/cashBooks', _permissions.CashBookView),
            defineItem('Остаток в кассе', '/cashBalance', _permissions.CashBalanceView),
            defineItem('Мониторинг по билетам', '/contractMonitoring', _permissions.ContractMonitoringView),
            defineItem('Кассовый отчет', '/cashReport', _permissions.CashReportView),
            defineItem('Отчет по реализации', '/sellingReport', _permissions.SellingReportView),
            defineItem('Просрочки', '/delayReport', _permissions.DelayReportView),
            defineItem('Ежедневная сводка', '/dailyReport', _permissions.DailyReportView),
            defineItem('Сводный отчет', '/consolidateReport', _permissions.ConsolidateReportView),
            defineItem('Отчет о произведенных скидках', '/discountReport', _permissions.DiscountReportView),
            defineItem('Карточка счета', '/accountCard', _permissions.AccountCardView),
            defineItem('Журнал ордер', '/orderRegister', _permissions.OrderRegisterView),
            defineItem('Анализ счета', '/accountAnalysis', _permissions.AccountAnalysisView),
            defineItem('Оборотная ведомость по счетам', '/accountCycle', _permissions.AccountCycleView),
            defineItem('Контроль стоимости золота', '/goldPrice', _permissions.GoldPriceView),
            defineItem('Отслеживание расходов за месяц', '/expenseMonthReport', _permissions.ExpenseMonthReportView),
            defineItem('Отслеживание расходов за год', '/expenseYearReport', _permissions.ExpenseYearReportView),
            defineItem('Оперативный отчет', '/operationalReport', _permissions.OperationalReportView),
            defineItem('Начисленные доходы', '/profitReport', _permissions.ProfitReportView),
            defineItem('Сводные начисленные доходы', '/consolidateProfitReport', _permissions.ProfitReportView),
            defineItem('Отчет по страховкам', '/insuranceReport', _permissions.InsuranceReportView),
            defineItem('Отчет по фактическому разделению доходов', '/splitProfitReport', _permissions.SplitProfitReportView),
            defineItem('Акт сверки', '/reconciliationReport', _permissions.ReconciliationReportView),
            defineItem('Отчет о предстоящей оплате', '/paymentReport', _permissions.PaymentReportView),
            defineItem('Форма для выдачи свыше 3 000 000', '/issuanceReport', _permissions.IssuanceReportView),
            defineItem('Подкрепление и снятие', '/reinforceAndWithdrawReport', _permissions.ReinforceAndWithdrawReportView),
            defineItem('Подотчетные суммы', '/accountableReport', _permissions.AccountableReportView),
            defineItem('Отчёт по уведомлениям', '/notificationReport', _permissions.NotificationReportView),
            defineItem('Региональный мониторинг по дате', '/regionMonitoringReport', _permissions.RegionMonitoringReportView),
            defineItem('Анализ статистики по филиалам', '/statisticsReport', _permissions.StatisticsReportView),
        ),
        defineGroup('Отчеты СФК', {},
            defineItem('Переданные договора', '/sfktransferedReport', _permissions.ConsolidateReportView),
            defineItem('Сводный отчет', '/sfkconsolidateReport', _permissions.ConsolidateReportView),
            defineItem('Начисленные доходы', '/sfkprofitReport', _permissions.ProfitReportView),
            defineItem('Сводные начисленные доходы', '/sfkconsolidateProfitReport', _permissions.ProfitReportView)
        )
    );
    return map;
};

const _map = buildNavigationMap();
const _findMapItem = link => {
    let found = null;
    for (let group of _map) {
        for (let item of group.items) {
            if (link.indexOf(item.link) >= 0 && (!found || found.link.length < item.link.length)) {
                found = item;
            }
        }
    }
    return found;
};

export const navigation = {
    map: _map,
    find: _findMapItem
};
export default _permissions;