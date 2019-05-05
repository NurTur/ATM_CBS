import React from 'react';
import { Route, IndexRoute } from 'react-router';

import Layout from '../shared/layout';
import Container from '../controls/container';
import WorkspaceContainer from '../controls/workspaceContainer';
import Dashboard from '../shared/dashboard';

import * as Administration from '../administration';
import * as Client from '../client';
import * as Dictionary from '../dictionary';
import * as Profile from '../profile';
import * as Contract from '../contract';
import * as CashOrder from '../cashOrder';
import * as Selling from '../selling';
import * as Report from '../report';
import * as Notification from '../notification';
import * as Insurance from '../insurance';
import * as Remittance from '../remittance';
import * as RemittanceSetting from '../remittanceSetting';
import * as Asset from '../asset';

export default () => (
    <Route path='/' component={Layout}>
        <IndexRoute component={Dashboard} />
        <Route path='profile' component={Container}>
            <IndexRoute component={Profile.Card} />
            <Route path='password' component={Profile.Password} />
        </Route>
        <Route path='configuration' component={Container}>
            <Route path='organization' component={Profile.OrganizationConfigCard} />
            <Route path='branch' component={Profile.BranchConfigCard} />
        </Route>
        <Route path='users' component={WorkspaceContainer}>
            <IndexRoute component={Administration.Users} />
            <Route path=':id' component={Administration.UserCard} />
        </Route>
        <Route path='roles' component={WorkspaceContainer}>
            <IndexRoute component={Administration.Roles} />
            <Route path=':id' component={Administration.RoleCard} />
        </Route>
        <Route path='groups' component={WorkspaceContainer}>
            <IndexRoute component={Administration.Groups} />
            <Route path=':id' component={Administration.GroupCard} />
        </Route>
        <Route path='persons' component={WorkspaceContainer}>
            <IndexRoute component={Client.Persons} />
            <Route path=':id' component={Client.PersonCard} />
        </Route>
        <Route path='companies' component={WorkspaceContainer}>
            <IndexRoute component={Client.Companies} />
            <Route path=':id' component={Client.CompanyCard} />
        </Route>
        <Route path='categories' component={WorkspaceContainer}>
            <IndexRoute component={Dictionary.Categories} />
            <Route path=':id' component={Dictionary.CategoryCard} />
        </Route>
        <Route path='golds' component={WorkspaceContainer}>
            <IndexRoute component={Dictionary.Golds} />
            <Route path=':id' component={Dictionary.GoldCard} />
        </Route>
        <Route path='goods' component={WorkspaceContainer}>
            <IndexRoute component={Dictionary.Goods} />
            <Route path=':id' component={Dictionary.GoodsCard} />
        </Route>
        <Route path='cars' component={WorkspaceContainer}>
            <IndexRoute component={Dictionary.Cars} />
            <Route path=':id' component={Dictionary.CarCard} />
        </Route>
        <Route path='machineries' component={WorkspaceContainer}>
            <IndexRoute component={Dictionary.Machineries} />
            <Route path=':id' component={Dictionary.MachineryCard} />
        </Route>
        <Route path='contracts' component={WorkspaceContainer}>
            <IndexRoute component={Contract.Contracts} />
            <Route path=':id' component={Contract.ContractCard} />
            <Route path=':id/:isCopy' component={Contract.ContractCard} />
        </Route>
        <Route path='accounts' component={WorkspaceContainer}>
            <IndexRoute component={Dictionary.Accounts} />
            <Route path=':id' component={Dictionary.AccountCard} />
        </Route>
        <Route path='clientBlackListReasons' component={WorkspaceContainer}>
            <IndexRoute component={Administration.СlientBlackListReasons} />
            <Route path=':id' component={Administration.СlientBlackListReasonCard} />
        </Route>
        <Route path='cashOrders' component={WorkspaceContainer}>
            <IndexRoute component={CashOrder.CashOrders} />
            <Route path=':id' component={CashOrder.CashOrderCard} />
            <Route path=':id/:isCopy' component={CashOrder.CashOrderCard} />
        </Route>
        <Route path='loanPercents' component={WorkspaceContainer}>
            <IndexRoute component={Administration.LoanPercents} />
            <Route path=':id' component={Administration.LoanPercentCard} />
        </Route>
        <Route path='purities' component={WorkspaceContainer}>
            <IndexRoute component={Dictionary.Purities} />
            <Route path=':id' component={Dictionary.PurityCard} />
        </Route>
        <Route path='sellings' component={WorkspaceContainer}>
            <IndexRoute component={Selling.Sellings} />
            <Route path=':id' component={Selling.SellingCard} />
        </Route>
        <Route path='eventLogs' component={WorkspaceContainer}>
            <IndexRoute component={Administration.EventLogs} />
        </Route>
        <Route path='cashBooks' component={WorkspaceContainer}>
            <IndexRoute component={Report.CashBooks} />
        </Route>
        <Route path='cashBalance' component={WorkspaceContainer}>
            <IndexRoute component={Report.CashBalance} />
        </Route>
        <Route path='contractMonitoring' component={WorkspaceContainer}>
            <IndexRoute component={Report.ContractMonitoring} />
        </Route>
        <Route path='cashReport' component={WorkspaceContainer}>
            <IndexRoute component={Report.CashReport} />
        </Route>
        <Route path='sellingReport' component={WorkspaceContainer}>
            <IndexRoute component={Report.SellingReport} />
        </Route>
        <Route path='delayReport' component={WorkspaceContainer}>
            <IndexRoute component={Report.DelayReport} />
        </Route>
        <Route path='dailyReport' component={WorkspaceContainer}>
            <IndexRoute component={Report.DailyReport} />
        </Route>
        <Route path='consolidateReport' component={WorkspaceContainer}>
            <IndexRoute component={Report.ConsolidateReport} />
        </Route>
        <Route path='sfkconsolidateReport' component={WorkspaceContainer}>
            <IndexRoute component={Report.SfkConsolidateReport} />
        </Route>
        <Route path='discountReport' component={WorkspaceContainer}>
            <IndexRoute component={Report.DiscountReport} />
        </Route>
        <Route path='accountCard' component={WorkspaceContainer}>
            <IndexRoute component={Report.AccountCard} />
        </Route>
        <Route path='orderRegister' component={WorkspaceContainer}>
            <IndexRoute component={Report.OrderRegister} />
        </Route>
        <Route path='accountAnalysis' component={WorkspaceContainer}>
            <IndexRoute component={Report.AccountAnalysis} />
        </Route>
        <Route path='accountCycle' component={WorkspaceContainer}>
            <IndexRoute component={Report.AccountCycle} />
        </Route>
        <Route path='goldPrice' component={WorkspaceContainer}>
            <IndexRoute component={Report.GoldPrice} />
        </Route>
        <Route path='expenseGroups' component={WorkspaceContainer}>
            <IndexRoute component={Dictionary.ExpenseGroups} />
            <Route path=':id' component={Dictionary.ExpenseGroupCard} />
        </Route>
        <Route path='expenseTypes' component={WorkspaceContainer}>
            <IndexRoute component={Dictionary.ExpenseTypes} />
            <Route path=':id' component={Dictionary.ExpenseTypeCard} />
        </Route>
        <Route path='expenseMonthReport' component={WorkspaceContainer}>
            <IndexRoute component={Report.ExpenseMonthReport} />
        </Route>
        <Route path='expenseYearReport' component={WorkspaceContainer}>
            <IndexRoute component={Report.ExpenseYearReport} />
        </Route>
        <Route path='operationalReport' component={WorkspaceContainer}>
            <IndexRoute component={Report.OperationalReport} />
        </Route>
        <Route path='notifications' component={WorkspaceContainer}>
            <IndexRoute component={Notification.Notifications} />
            <Route path=':id' component={Notification.NotificationCard} />
        </Route>
        <Route path='profitReport' component={WorkspaceContainer}>
            <IndexRoute component={Report.ProfitReport} />
        </Route>
        <Route path='sfkprofitReport' component={WorkspaceContainer}>
            <IndexRoute component={Report.SfkProfitReport} />
        </Route>
        <Route path='insurances' component={WorkspaceContainer}>
            <IndexRoute component={Insurance.Insurances} />
            <Route path=':id' component={Insurance.InsuranceCard} />
        </Route>
        <Route path='insuranceReport' component={WorkspaceContainer}>
            <IndexRoute component={Report.InsuranceReport} />
        </Route>
        <Route path='remittances' component={WorkspaceContainer}>
            <IndexRoute component={Remittance.Remittances} />
            <Route path=':id' component={Remittance.RemittanceCard} />
        </Route>
        <Route path='remittanceSettings' component={WorkspaceContainer}>
            <IndexRoute component={RemittanceSetting.RemittanceSettings} />
            <Route path=':id' component={RemittanceSetting.RemittanceSettingCard} />
        </Route>
        <Route path='splitProfitReport' component={WorkspaceContainer}>
            <IndexRoute component={Report.SplitProfitReport} />
        </Route>
        <Route path='assets' component={WorkspaceContainer}>
            <IndexRoute component={Asset.Assets} />
            <Route path=':id' component={Asset.AssetCard} />
        </Route>
        <Route path='reconciliationReport' component={WorkspaceContainer}>
            <IndexRoute component={Report.ReconciliationReport} />
        </Route>
        <Route path='consolidateProfitReport' component={WorkspaceContainer}>
            <IndexRoute component={Report.ConsolidateProfitReport} />
        </Route>
        <Route path='sfkConsolidateProfitReport' component={WorkspaceContainer}>
            <IndexRoute component={Report.SfkConsolidateProfitReport} />
        </Route>
        <Route path='paymentReport' component={WorkspaceContainer}>
            <IndexRoute component={Report.PaymentReport} />
        </Route>
        <Route path='issuanceReport' component={WorkspaceContainer}>
            <IndexRoute component={Report.IssuanceReport} />
        </Route>
        <Route path='reinforceAndWithdrawReport' component={WorkspaceContainer}>
            <IndexRoute component={Report.ReinforceAndWithdrawReport} />
        </Route>
        <Route path='sfktransferedReport' component={WorkspaceContainer}>
            <IndexRoute component={Report.SfkTransferedReport} />
        </Route>
        <Route path='accountableReport' component={WorkspaceContainer}>
            <IndexRoute component={Report.AccountableReport} />
        </Route>
        <Route path='notificationReport' component={WorkspaceContainer}>
            <IndexRoute component={Report.NotificationReport} />
        </Route>
        <Route path='regionMonitoringReport' component={WorkspaceContainer}>
            <IndexRoute component={Report.RegionMonitoringReport} />
        </Route>
        <Route path='statisticsReport' component={WorkspaceContainer}>
            <IndexRoute component={Report.StatisticsReport} />
        </Route>
    </Route>
);