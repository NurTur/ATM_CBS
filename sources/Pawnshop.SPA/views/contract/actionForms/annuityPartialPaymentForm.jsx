import React from 'react';
import { reduxForm, formValueSelector, Field, FieldArray } from 'redux-form';
import DateInput from '../../controls/form/dateInput';
import moment from 'moment';
import calculator from '../../../engine/scheduleCalculator';

import ActionRows from './actionRows';

class AnnuityPartialPaymentForm extends React.Component {
    static contextTypes = {
        store: React.PropTypes.object.isRequired
    };

    state = {
        cost: 0
    };

    componentDidMount() {
        let { contract, readOnly } = this.props;
        if (!readOnly) {
            let now = moment().startOf('day');
            this.props.change("date", now);
            this.props.change('reason', `Частичное гашение залогового билета №${contract.contractNumber} от ${moment(contract.contractDate).format('L')}`);
            this._init();
        }
    }

    _init(date, cost) {
        let { contract, options } = this.props;
        let { profile } = options;
        let minCount = profile && profile.minLoanPeriod && profile.minLoanPeriod / 30 || 0;

        let state = this.context.store.getState();
        let rows = selector(state, 'rows');
        date = date || selector(state, 'date');
        cost = cost || this.state.cost;
        let monthlyPaymentSum = 0;
        contract.actions.forEach(action => {
            if(action.actionType==80){
                action.rows.forEach(row => {
                    if(row.paymentType==10){
                        monthlyPaymentSum += row.cost;
                    }
                })
            }
        });

        this.props.array.removeAll('rows');
        if (contract && date) {
            date = moment(date).startOf('day');
            let totalCost = 0;

            // Долг
            let row10 = calculator.partialPaymentDebt(rows, contract, options, cost);
            if (row10) {
                totalCost += parseFloat(row10.cost);
                this.props.array.push('rows', row10);
            }

            // Пошлина
            let row20 = calculator.buyoutPercent(rows, contract, options, date, minCount);
            if (row20) {
                totalCost += parseFloat(row20.cost);
                this.props.array.push('rows', row20);
            }

            // Штраф
            let row30 = calculator.penalty(rows, contract, options, date);
            if (row30) {
                totalCost += parseFloat(row30.cost);
                this.props.array.push('rows', row30);
            }

            this.props.change("totalCost", totalCost.toFixed());

            let balanceCost = contract.loanCost - cost - monthlyPaymentSum;
            this.props.change("balanceCost", balanceCost.toFixed());
        }
    }

    render() {
        return (
            <form onSubmit={this.props.handleSubmit}>
                <div className="row">
                    <fieldset className="form-group">
                        <label htmlFor="date" className="col-sm-2">Дата</label>
                        <div className="col-sm-4">
                            <Field name="date" component={DateInput} className="form-control" disabled />
                        </div>
                        <label className="col-sm-4">Сумма частичного гашения</label>
                        <div className="col-sm-2">
                            <input type="number" className="form-control" onChange={e => {
                                let cost = parseInt(e.target.value || 0);
                                this.setState({ cost: cost });
                                this._init(null, cost);
                            }} readOnly={this.props.readOnly} />
                        </div>
                    </fieldset>
                </div>
                <div className="row">
                    <FieldArray name="rows" component={ActionRows} readOnlyPercent={true} onChangePercent={(e, val) => {
                        e.preventDefault();
                    }} />
                </div>
                <div className="row">
                    <fieldset className="form-group">
                        <label htmlFor="totalCost" className="col-sm-2">Итого, тг</label>
                        <div className="col-sm-4">
                            <Field name="totalCost" component="input" type="number" className="form-control" readOnly />
                        </div>
                        <label htmlFor="balanceCost" className="col-sm-2">Остаток, тг</label>
                        <div className="col-sm-4">
                            <Field name="balanceCost" component="input" type="number" className="form-control" readOnly />
                        </div>
                    </fieldset>
                </div>
                <fieldset className="form-group">
                    <label htmlFor="reason">Основание</label>
                    <Field name="reason" component="textarea" className="form-control" readOnly={this.props.readOnly} />
                </fieldset>
                <fieldset className="form-group">
                    <label htmlFor="note">Примечание</label>
                    <Field name="note" component="textarea" className="form-control" readOnly={this.props.readOnly} />
                </fieldset>
            </form>
        );
    }
}

export default AnnuityPartialPaymentForm = reduxForm({
    form: 'AnnuityPartialPaymentForm'
})(AnnuityPartialPaymentForm);

const selector = formValueSelector('AnnuityPartialPaymentForm');