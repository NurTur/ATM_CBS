import React from 'react';
import { reduxForm, Field, formValueSelector } from 'redux-form';
import { groups as groupsLoad } from '../../actions/dictionaries';
import DateInput from '../controls/form/dateInput';
import DictInput from '../controls/form/dictInput';

class RemittanceForm extends React.Component {
    static contextTypes = {
        store: React.PropTypes.object.isRequired
    };

    render = () => {
        let { readOnly } = this.props;

        return (
            <form onSubmit={this.props.handleSubmit} className="form-horizontal">
                <div className="panel-body">
                    <fieldset className="form-group" disabled={readOnly}>
                        <label htmlFor="sendDate" className="col-sm-2">Дата</label>
                        <div className="col-sm-4">
                            <Field name="sendDate" component={DateInput} className="form-control" disabled={true} />
                        </div>
                        <label htmlFor="sendCost" className="col-sm-2">Сумма</label>
                        <div className="col-sm-4">
                            <Field name="sendCost" component="input" type="number" min="0" max="1000000000" className="form-control" />
                        </div>
                    </fieldset>
                    <fieldset className="form-group" disabled={readOnly}>
                        <label htmlFor="receiveBranchId" className="col-sm-2">Получатель</label>
                        <div className="col-sm-10">
                            <Field name="receiveBranchId" component={DictInput} className="form-control"
                                   dictionary="groups" onLoad={groupsLoad} display={(row, i) => row.displayName} />
                        </div>
                    </fieldset>
                    <fieldset className="form-group" disabled={readOnly}>
                        <label htmlFor="note" className="col-sm-2">Примечание</label>
                    </fieldset>
                    <fieldset className="form-group" disabled={readOnly}>
                        <div className="col-sm-12">
                            <Field name="note" component="textarea" rows="5" className="form-control" />
                        </div>
                    </fieldset>
                </div>
                <div className="panel-footer">
                    <button type="button" className="btn btn-warning" onClick={() => history.back()}>Назад</button>
                    {readOnly || <button type="submit" className="btn btn-primary">Сохранить</button>}
                </div>
            </form>
        );
    }
}

export default reduxForm({
    form: 'RemittanceForm'
})(RemittanceForm);

export const selector = formValueSelector('RemittanceForm');