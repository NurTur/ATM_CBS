import React from 'react';
import { reduxForm, Field, formValueSelector } from 'redux-form';
import { expenseGroups as expenseGroupsLoad, accounts as accountsLoad } from '../../actions/dictionaries';
import DictInput from '../controls/form/dictInput';

class ExpenseTypeForm extends React.Component {
    render = () => {
        let { readOnly } = this.props;
        return (
            <form onSubmit={this.props.handleSubmit} className="form-horizontal">
                <div className="panel-body">
                    <fieldset className="form-group" disabled={readOnly}>
                        <label htmlFor="expenseGroupId" className="col-sm-3">Группа</label>
                        <div className="col-sm-9">
                            <Field name="expenseGroupId" component={DictInput} className="form-control"
                                   dictionary="expenseGroups" onLoad={expenseGroupsLoad} display={(row, i) => row.orderBy + '. ' + row.name} />
                        </div>
                    </fieldset>
                    <fieldset className="form-group" disabled={readOnly}>
                        <label htmlFor="name" className="col-sm-3">Наименование</label>
                        <div className="col-sm-9">
                            <Field name="name" component="input" type="text" className="form-control" />
                        </div>
                    </fieldset>
                    <fieldset className="form-group" disabled={readOnly}>
                        <label htmlFor="accountId" className="col-sm-3">Счет</label>
                        <div className="col-sm-9">
                            <Field name="accountId" component={DictInput} className="form-control"
                                   dictionary="accounts" onLoad={accountsLoad} display={(row, i) => row.code + ' ' + row.name} />
                        </div>
                    </fieldset>
                    <fieldset className="form-group" disabled={readOnly}>
                        <label htmlFor="orderBy" className="col-sm-3">Порядок</label>
                        <div className="col-sm-9">
                            <Field name="orderBy" component="input" type="number" className="form-control" />
                        </div>
                    </fieldset>
                </div>
                <div className="panel-footer">
                    <button type="button" className="btn btn-warning" onClick={() => history.back()}>Назад</button>
                    {readOnly ||
                    <button type="submit" className="btn btn-primary">Сохранить</button>
                    }
                </div>
            </form>
        );
    }
}

export default reduxForm({
    form: 'ExpenseTypeForm'
})(ExpenseTypeForm);

export const selector = formValueSelector('ExpenseTypeForm');