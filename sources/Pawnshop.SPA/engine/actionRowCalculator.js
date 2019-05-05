import moment from 'moment';

class ActionRowCalculator {
    buildRow(rows, code, loan, percent, period) {
        let row = null;
        if (rows)
            row = rows.find(e => e.paymentType == code);
        if (!row) {
            row = { paymentType: code };
        }
        if (percent || period) {
            row.originalPercent = percent;
            row.period = period;
            if (!row.cost) {
                row.percent = (row && row.percent) || percent;
                row.cost = ((loan * row.percent / 100).toFixed(2) * row.period).toFixed();
            } else {
                row.percent = (row.cost / row.period * 100 / loan).toFixed(4);
            }
        } else {
            row.originalPercent = null;
            row.percent = null;
            row.period = null;
            row.cost = loan.toFixed();
        }

        return row;
    }

    buildRow10(rows, settings, cost) {
        let row10 = this.buildRow(rows, 10, cost);

        row10.debitAccountId = settings.debitId;
        row10.creditAccountId = settings.creditId;

        return row10;
    }

    buildRow20(rows, contract, settings, options, date) {
        let row20 = null;

        date = moment(date).startOf('day');
        let maturityDate = moment(contract.maturityDate).startOf('day');
        let contractDate = moment(contract.prolongDate || contract.contractDate).startOf('day');
        if (date.isAfter(maturityDate)) {
            let period = maturityDate.diff(contractDate, 'days');
            if (!contract.prolongDate && !contract.locked) period++;

            row20 = this.buildRow(rows, 20, contract.loanCost, contract.loanPercent, period);
            
        } else {
            let period = date.diff(contractDate, 'days');
            /*ВРЕМЕННОЕ РЕШЕНИЕ - УБРАТЬ В МАРТЕ 2019 ГОДА ОТСЮДА*/
            var check59 = 0.1966;
            if(contract.loanPercent > check59)
            {
                period = date.diff(contractDate, 'days');
                if (!contract.prolongDate && !contract.locked) period++;
            }
            else{
            /*ВРЕМЕННОЕ РЕШЕНИЕ - УБРАТЬ В МАРТЕ 2019 ГОДА ДО СЮДА*/
                if(!options.isAddition){
                    if (!contract.prolongDate) {
                        if (!contract.locked) period++;
                        period = this.getPeriod20(options, period);
                    }
                }
                else{
                    period = date.diff(contractDate, 'days');
                    if (!contract.prolongDate && !contract.locked) period++;
                }
                
            }
            row20 = this.buildRow(rows, 20, contract.loanCost, contract.loanPercent, period);
        }

        row20.debitAccountId = settings.debitId;
        row20.creditAccountId = settings.creditId;

        return row20;
    }

    buildRow30(rows, contract, settings, date) {
        let row30 = null;

        date = moment(date).startOf('day');
        let maturityDate = moment(contract.maturityDate).startOf('day');
        if (date.isAfter(maturityDate)) {
            row30 = this.buildRow(rows, 30,
                contract.loanCost, contract.penaltyPercent,
                date.diff(maturityDate, 'days'));
            row30.debitAccountId = settings.debitId;
            row30.creditAccountId = settings.creditId;
        }

        return row30;
    }

    getSettings(options, collateralType, transferDate) {
        let settings = options.configuration.cashOrderSettings;
        collateralType = parseInt(collateralType);

        if (transferDate) {
            switch (collateralType) {
                case 10:
                    return null;
                case 20:
                    return settings.carTransferSettings;
                case 30:
                    return null;
                case 40:
                    return null;
            }
        } else {
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
        }
        return null;
    }

    getPeriod20(options, calculated) {
        let { profile } = options;  
        if (profile && profile.minLoanPeriod) {
            if (calculated < profile.minLoanPeriod) {
                calculated = profile.minLoanPeriod;
            }
        }
        return calculated;
    }

    row10(rows, contract, options, cost) {
        let { debtSettings } = this.getSettings(options, contract.collateralType, contract.transferDate);
        return this.buildRow10(rows, debtSettings, cost);
    }

    row20(rows, contract, options, date) {
        let { loanSettings } = this.getSettings(options, contract.collateralType, contract.transferDate);
        return this.buildRow20(rows, contract, loanSettings, options, date);
    }

    row30(rows, contract, options, date) {
        let { penaltySettings } = this.getSettings(options, contract.collateralType, contract.transferDate);
        return this.buildRow30(rows, contract, penaltySettings, date);
    }
}

let calculator = new ActionRowCalculator();

export default calculator;