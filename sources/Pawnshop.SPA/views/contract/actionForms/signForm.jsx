import React from 'react';
import { reduxForm, formValueSelector, Field, FieldArray } from 'redux-form';
import DateInput from '../../controls/form/dateInput';

import ActionRows from './actionRows';
import moment from 'moment';
import rc from '../../../engine/actionRowCalculator';

class SignForm extends React.Component {
    static contextTypes = {
        store: React.PropTypes.object.isRequired
    };

    componentDidMount() {
        let { contract, readOnly } = this.props;
        if (!readOnly) {
            this.props.change('date', contract.contractDate);
            this.props.change('reason', `Залоговый билет №${contract.contractNumber} от ${moment(contract.contractDate).format('L')}`);
            this._init();
        }
    }

    _init() {
        let { contract, options } = this.props;
        let { supplySettings } = rc.getSettings(options, contract.collateralType, contract.transferDate);
        let state = this.context.store.getState();
        let rows = selector(state, 'rows');

        this.props.array.removeAll('rows');
        if (contract) {
            let totalCost = 0;

            // Долг
            let row10 = rc.buildRow(rows, 10, contract.loanCost);
            row10.debitAccountId = supplySettings.debitId;
            row10.creditAccountId = supplySettings.creditId;
            totalCost += parseFloat(row10.cost);
            this.props.array.push('rows', row10);

            this.props.change("totalCost", totalCost.toFixed());
        }
    }

    render() {
        let readOnlyDate = this.props.readOnly || !this.props.options.allowDiscount;

        return (
            <form onSubmit={this.props.handleSubmit}>
                <div className="row">
                    <fieldset className="form-group">
                        <label htmlFor="date" className="col-sm-2">Дата</label>
                        <div className="col-sm-4">
                            <Field name="date" component={DateInput} className="form-control"
                                   readOnly={readOnlyDate} />
                        </div>
                    </fieldset>
                </div>
                <div className="row">
                    <FieldArray name="rows" component={ActionRows} />
                </div>
                <div className="row">
                    <fieldset className="form-group">
                        <label htmlFor="totalCost" className="col-sm-6">Итого, тг</label>
                        <div className="col-sm-6">
                            <Field name="totalCost" component="input" type="number" className="form-control" readOnly />
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

export default SignForm = reduxForm({
    form: 'SignForm'
})(SignForm);

const selector = formValueSelector('SignForm');