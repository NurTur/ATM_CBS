import React from 'react';
import { reduxForm, formValueSelector, Field, FieldArray } from 'redux-form';
import DateInput from '../../controls/form/dateInput';
import moment from 'moment';
import ContractPositions from '../contractPositions';

class SellingForm extends React.Component {
    componentDidMount() {
        let { contract, readOnly } = this.props;
        if (!readOnly) {
            let now = moment();
            this.props.change("date", now);
            this.props.change('reason', `Реализация залогового билета №${contract.contractNumber} от ${moment(contract.contractDate).format('L')}`);
            this.props.change('data.positions', contract.positions)
        }
    }

    onPositionsChange() {

    }

    render() {
        return (
            <form onSubmit={this.props.handleSubmit} className="form-horizontal">
                <fieldset className="form-group">
                    <label htmlFor="date" className="col-sm-2">Дата</label>
                    <div className="col-sm-4">
                        <Field name="date" component={DateInput} className="form-control" readOnly />
                    </div>
                </fieldset>
                <FieldArray name="data.positions" component={ContractPositions}
                            collateralType={this.props.contract.collateralType}
                            readOnly={this.props.readOnly} onChange={() => this.onPositionsChange()}
                            onPositionChange={(field, value) => this.props.change(field, value)} />
                <fieldset className="form-group">
                    <label htmlFor="reason" className="col-sm-12">Основание</label>
                    <div className="col-sm-12">
                        <Field name="reason" component="textarea" className="form-control" readOnly={this.props.readOnly} />
                    </div>
                </fieldset>
                <fieldset className="form-group">
                    <label htmlFor="note" className="col-sm-12">Примечание</label>
                    <div className="col-sm-12">
                        <Field name="note" component="textarea" className="form-control" readOnly={this.props.readOnly} />
                    </div>
                </fieldset>
            </form>
        );
    }
}

export default SellingForm = reduxForm({
    form: 'SellingForm'
})(SellingForm);

const selector = formValueSelector('SellingForm');