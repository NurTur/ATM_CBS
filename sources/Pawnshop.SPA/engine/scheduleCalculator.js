import moment from 'moment';

class ScheduleCalculator {
    buildSchedule(contractDate, maturityDate, loanCost, loanPercent) {
        contractDate = moment(contractDate).startOf('day');
        maturityDate = moment(maturityDate).startOf('day');

        let monthCount = Math.round(maturityDate.diff(contractDate, 'months', true));
        let debtCost = parseFloat((loanCost / monthCount).toFixed(2));
        let percentCost = loanCost * parseFloat((loanPercent * 30 / 100).toFixed(4));
        let balanceCost = loanCost;

        let schedule = [];
        for (let i = 0; i < monthCount; i++) {
            let currentDate = contractDate.clone().add(i + 1, 'months').startOf('day');
            balanceCost = balanceCost - debtCost;

            schedule.push({
                date: currentDate,
                cost: Math.round(debtCost + percentCost),
                percent: parseFloat(percentCost.toFixed(2)),
                debt: parseFloat(debtCost.toFixed(2)),
                loan: parseFloat(balanceCost.toFixed(2))
            });
        }

        return schedule;
    }

    totalSchedule(contractDate, maturityDate, loanCost, loanPercent) {
        let schedule = this.buildSchedule(contractDate, maturityDate, loanCost, loanPercent);
        let total = {
            cost: 0,
            percent: 0,
            debt: 0
        };

        schedule.map((item) => {
            total.cost += (item.debt + item.percent);
            total.percent += item.percent;
            total.debt += item.debt;
        });

        total.cost = Math.round(total.cost);
        total.percent = Math.round(total.percent);
        total.debt = Math.round(total.debt);

        return total;
    }

    getMonthlyDate(contract) {
        let schedule = this.buildSchedule(contract.contractDate, contract.maturityDate, contract.loanCost, contract.loanPercent);
        let index = contract.actions && contract.actions.filter((item) => item.actionType == 80).length || 0;

        return schedule.length > 0 && index < schedule.length && schedule[index].date || moment().startOf('day');
    }

    getMonthlyCost(contractDate, maturityDate, loanCost, loanPercent) {
        contractDate = moment(contractDate).startOf('day');
        maturityDate = moment(maturityDate).startOf('day');

        let monthCount = Math.round(maturityDate.diff(contractDate, 'months', true));
        let debtCost = parseFloat((loanCost / monthCount).toFixed(2));
        let percentCost = loanCost * parseFloat((loanPercent * 30 / 100).toFixed(4));
        return Math.round(debtCost + percentCost);
    }

    getMonthlyDebtCost(contractDate, maturityDate, loanCost) {
        contractDate = moment(contractDate).startOf('day');
        maturityDate = moment(maturityDate).startOf('day');

        let monthCount = Math.round(maturityDate.diff(contractDate, 'months', true));
        let debtCost = parseFloat((loanCost / monthCount).toFixed(2));
        return debtCost;
    }

    getMonthlyPercentCost(loanCost, loanPercent) {
        let percentCost = loanCost * parseFloat((loanPercent * 30 / 100).toFixed(4));
        return parseFloat(percentCost.toFixed(2));
    }

    getSettings(options, collateralType) {
        let settings = options.configuration.cashOrderSettings;
        collateralType = parseInt(collateralType);

        switch (collateralType) {
            case 10:
                return settings.goldCollateralSettings;
            case 20:
                return settings.carCollateralSettings;
            case 30:
                return settings.goodCollateralSettings;
            case 40:
                return settings.machineryCollateralSettings;
        }

        return null;
    }

    buildRow(rows, code, settings) {
        let row = null;
        if (rows)
            row = rows.find(e => e.paymentType == code);
        if (!row) {
            row = { paymentType: code };
        }
        row.debitAccountId = settings.debitId;
        row.creditAccountId = settings.creditId;
        return row;
    }

    penalty(rows, contract, options, date) {
        let { penaltySettings } = this.getSettings(options, contract.collateralType);
        date = moment(date).startOf('day');
        let monthlyDate = this.getMonthlyDate(contract);
        if (date.isAfter(monthlyDate)) {
            let penaltyPeriod = date.diff(monthlyDate, 'days');
            let monthlyCost = this.getMonthlyCost(contract.contractDate, contract.maturityDate, contract.loanCost, contract.loanPercent);
            let row = this.buildRow(rows, 30, penaltySettings);
            row.originalPercent = contract.penaltyPercent;
            row.percent = contract.penaltyPercent;
            row.period = penaltyPeriod;
            row.cost = parseFloat((monthlyCost * parseFloat((contract.penaltyPercent * penaltyPeriod / 100).toFixed(4))).toFixed(2));
            return row;
        }

        return null;
    }

    monthlyPaymentDebt(rows, contract, options) {
        let { debtSettings } = this.getSettings(options, contract.collateralType);
        let row = this.buildRow(rows, 10, debtSettings);
        row.originalPercent = null;
        row.percent = null;
        row.period = null;
        row.cost = this.getMonthlyDebtCost(contract.contractDate, contract.maturityDate, contract.loanCost);
        return row;
    }

    monthlyPaymentPercent(rows, contract, options) {
        let { loanSettings } = this.getSettings(options, contract.collateralType);
        let row = this.buildRow(rows, 20, loanSettings);
        row.originalPercent = contract.loanPercent;
        row.percent = contract.loanPercent;
        row.period = 30;
        row.cost = this.getMonthlyPercentCost(contract.loanCost, contract.loanPercent);
        return row;
    }

    buyoutDebt(rows, contract, options) {
        let { debtSettings } = this.getSettings(options, contract.collateralType);
        let row = this.buildRow(rows, 10, debtSettings);
        row.originalPercent = null;
        row.percent = null;
        row.period = null;

        let balanceCost = 0;
        contract.actions.filter((action) => action.actionType == 80).map((action) => {
            action.rows.filter((item) => item.paymentType == 10).map((item) => {
                balanceCost += item.cost;
            });
        });

        row.cost = contract.loanCost - balanceCost;
        return row;
    }

    buyoutPercent(rows, contract, options, date, minCount) {
        let { loanSettings } = this.getSettings(options, contract.collateralType);
        let { profile } = options;

        date = moment(date).startOf('day');
        let monthlyDate = this.getMonthlyDate(contract);
        let monthlyPercentCost = this.getMonthlyPercentCost(contract.loanCost, contract.loanPercent);

        let actions = contract.actions.filter((action) => action.actionType == 80);
        let actionCount = actions.length;
        let lastActionDate = actions.length > 0 ? actions[actions.length - 1].date : contract.contractDate;
        let period = date.diff(lastActionDate, 'days');

        let row = this.buildRow(rows, 20, loanSettings);
        row.originalPercent = contract.loanPercent;
        row.percent = contract.loanPercent;
        if (actionCount >= minCount || contract.locked) {
            row.period = date.isAfter(monthlyDate) ? 30 : period;
            row.cost = date.isAfter(monthlyDate) ? monthlyPercentCost : ((contract.loanCost * row.percent / 100).toFixed(2) * row.period).toFixed();
        } else {
            row.period = profile && profile.minLoanPeriod || period;
            row.cost = monthlyPercentCost * (minCount - actionCount);
        }
        return row;
    }

    partialPaymentDebt(rows, contract, options, cost) {
        let { debtSettings } = this.getSettings(options, contract.collateralType);
        let row = this.buildRow(rows, 10, debtSettings);
        row.originalPercent = null;
        row.percent = null;
        row.period = null;

        let balanceCost = 0;
        contract.actions.filter((action) => action.actionType == 80).map((action) => {
            action.rows.filter((item) => item.paymentType == 10).map((item) => {
                balanceCost += item.cost;
            });
        });

        row.cost = contract.loanCost - balanceCost < cost ? contract.loanCost - balanceCost : cost;
        return row;
    }
}

let calculator = new ScheduleCalculator();

export default calculator;