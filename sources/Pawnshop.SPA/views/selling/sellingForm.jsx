import React, { PropTypes } from 'react';
import { reduxForm, Field, formValueSelector } from 'redux-form';
import DateInput from '../controls/form/dateInput';

class SellingForm extends React.Component {
    static contextTypes = {
        router: PropTypes.object.isRequired
    };

    render = () => {
        let { readOnly } = this.props;
        return (
            <form onSubmit={this.props.handleSubmit} className="form-horizontal">
                <div className="panel-body">
                    <fieldset className="form-group" disabled={readOnly}>
                        <label htmlFor="sellingDate" className="col-sm-4">Дата продажи</label>
                        <div className="col-sm-8">
                            <Field name="sellingDate" component={DateInput} className="form-control" />
                        </div>
                    </fieldset>
                    <fieldset className="form-group" disabled={readOnly}>
                        <label htmlFor="sellingCost" className="col-sm-4">Сумма</label>
                        <div className="col-sm-8">
                            <Field name="sellingCost" component="input" type="number" min="0" max="100000000" className="form-control" />
                        </div>
                    </fieldset>
                    <fieldset className="form-group">
                        <label htmlFor="note" className="col-sm-4">Примечание</label>
                        <div className="col-sm-8">
                            <Field name="note" component="input" type="text" className="form-control" readOnly={readOnly} />
                        </div>
                    </fieldset>
                </div>
                    <div className="panel-footer">
                        <button type="button" className="btn btn-warning" onClick={() => this.context.router.push(`/sellings`)}>Назад</button>
                        {readOnly ||
                            <button type="submit" className="btn btn-primary">Сохранить</button>
                        }
                    </div>
            </form>
        );
    }
}

export default reduxForm({
    form: 'SellingForm'
})(SellingForm);

export const selector = formValueSelector('SellingForm');