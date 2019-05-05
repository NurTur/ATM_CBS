import React from 'react';
import { reduxForm, formValueSelector, Field, FieldArray } from 'redux-form';
import DateInput from '../../controls/form/dateInput';
import moment from 'moment';
import rc from '../../../engine/actionRowCalculator';

import ActionRows from './actionRows';

class AdditionForm extends React.Component {
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
            this.props.change('reason', `Выкуп залогового билета №${contract.contractNumber} от ${moment(contract.contractDate).format('L')}`);
            this._init();
        }
    }

    _init(date, cost) {
        let { contract, options } = this.props;

        let state = this.context.store.getState();
        let rows = selector(state, 'rows');
        date = date || selector(state, 'date');
        cost = cost || this.state.cost;
        
        this.props.array.removeAll('rows');
        if (contract && date) {
            date = moment(date).startOf('day');
            let totalCost = 0;
            options.isAddition = true;
            // Долг
            let row10 = rc.row10(rows, contract, options,contract.loanCost);
            if (row10) {
                totalCost += parseFloat(row10.cost);
                this.props.array.push('rows', row10);
            }

            // Пошлина
            let row20 = rc.row20(rows, contract, options, date);
            if (row20) {
                totalCost += parseFloat(row20.cost);
                this.props.array.push('rows', row20);
            }

            // Штраф
            let row30 = rc.row30(rows, contract, options, date);
            if (row30) {
                totalCost += parseFloat(row30.cost);
                this.props.array.push('rows', row30);
            }
            totalCost+=parseFloat(cost);            
            options.isAddition = false;
            this.props.change("totalCost", totalCost.toFixed());

            let balanceCost = contract.loanCost + cost;
            this.props.change("balanceCost", balanceCost.toFixed());
            this.props.change("cost",cost.toFixed())
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
                        <label className="col-sm-4">Сумма добора</label>
                        <div className="col-sm-2">
                            <input type="number" name="cost" className="form-control" onChange={e => {
                                let cost = parseInt(e.target.value || 0);
                                this._init(null, cost);
                            }} readOnly={this.props.readOnly}/>
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
                        <label htmlFor="totalCost" className="col-sm-3">Итого, тг</label>
                        <div className="col-sm-3">
                            <Field name="totalCost" component="input" type="number" className="form-control" readOnly/>
                        </div>
                        <label htmlFor="balanceCost" className="col-sm-3">Основной долг, тг</label>
                        <div className="col-sm-3">
                            <Field name="balanceCost" component="input" type="number" className="form-control" readOnly/>
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

export default AdditionForm = reduxForm({
    form: 'AdditionForm'
})(AdditionForm);

const selector = formValueSelector('AdditionForm');