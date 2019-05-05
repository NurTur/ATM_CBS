import React from 'react';
import { reduxForm, Field, formValueSelector } from 'redux-form';
import { groups as groupsLoad, accounts as accountsLoad, expenseTypes as expenseTypesLoad, users as usersLoad } from '../../actions/dictionaries';
import DictInput from '../controls/form/dictInput';

class RemittanceSettingForm extends React.Component {
    static contextTypes = {
        store: React.PropTypes.object.isRequired
    };

    render = () => {
        return (
            <form onSubmit={this.props.handleSubmit} className="form-horizontal">
                <div className="panel-body">
                    <fieldset className="form-group">
                        <label htmlFor="sendBranchId" className="col-sm-2">Отправитель</label>
                        <div className="col-sm-4">
                            <Field name="sendBranchId" component={DictInput} className="form-control"
                                   dictionary="groups" onLoad={groupsLoad} display={(row, i) => row.displayName} />
                        </div>
                        <label htmlFor="receiveBranchId" className="col-sm-2">Получатель</label>
                        <div className="col-sm-4">
                            <Field name="receiveBranchId" component={DictInput} className="form-control"
                                   dictionary="groups" onLoad={groupsLoad} display={(row, i) => row.displayName} />
                        </div>
                    </fieldset>
                    <div className="panel panel-default">
                        <div className="panel-heading">РКО</div>
                        <div className="panel-body">
                            <fieldset className="form-group">
                                <label htmlFor="cashOutDebitId" className="col-sm-2">Дебет</label>
                                <div className="col-sm-4">
                                    <Field name="cashOutDebitId" component={DictInput} className="form-control"
                                           dictionary="accounts" onLoad={accountsLoad} display={(row, i) => row.code + ' ' + row.name} />
                                </div>
                                <label htmlFor="cashOutCreditId" className="col-sm-2">Кредит</label>
                                <div className="col-sm-4">
                                    <Field name="cashOutCreditId" component={DictInput} className="form-control"
                                           dictionary="accounts" onLoad={accountsLoad} display={(row, i) => row.code + ' ' + row.name} />
                                </div>
                            </fieldset>
                        </div>
                    </div>
                    <div className="panel panel-default">
                        <div className="panel-heading">ПКО</div>
                        <div className="panel-body">
                            <fieldset className="form-group">
                                <label htmlFor="cashInDebitId" className="col-sm-2">Дебет</label>
                                <div className="col-sm-4">
                                    <Field name="cashInDebitId" component={DictInput} className="form-control"
                                           dictionary="accounts" onLoad={accountsLoad} display={(row, i) => row.code + ' ' + row.name} />
                                </div>
                                <label htmlFor="cashInCreditId" className="col-sm-2">Кредит</label>
                                <div className="col-sm-4">
                                    <Field name="cashInCreditId" component={DictInput} className="form-control"
                                           dictionary="accounts" onLoad={accountsLoad} display={(row, i) => row.code + ' ' + row.name} />
                                </div>
                            </fieldset>
                        </div>
                    </div>
                    <fieldset className="form-group">
                        <label htmlFor="expenseTypeId" className="col-sm-2">Вид расходов</label>
                        <div className="col-sm-10">
                            <Field name="expenseTypeId" component={DictInput} className="form-control"
                                   dictionary="expenseTypes" onLoad={expenseTypesLoad} display={e => e.expenseGroup.name + ' ' + e.name} />
                        </div>
                    </fieldset>
                    <fieldset className="form-group">
                        <label htmlFor="cashOutUserId" className="col-sm-2">Контрагент РКО</label>
                        <div className="col-sm-4">
                            <Field name="cashOutUserId" component={DictInput} className="form-control"
                                   dictionary="users" onLoad={usersLoad} display={(row, i) => row.fullname} />
                        </div>
                        <label htmlFor="cashInUserId" className="col-sm-2">Контрагент ПКО</label>
                        <div className="col-sm-4">
                            <Field name="cashInUserId" component={DictInput} className="form-control"
                                   dictionary="users" onLoad={usersLoad} display={(row, i) => row.fullname} />
                        </div>
                    </fieldset>
                </div>
                <div className="panel-footer">
                    <button type="button" className="btn btn-warning" onClick={() => history.back()}>Назад</button>
                    <button type="submit" className="btn btn-primary">Сохранить</button>
                </div>
            </form>
        );
    }
}

export default reduxForm({
    form: 'RemittanceSettingForm'
})(RemittanceSettingForm);

export const selector = formValueSelector('RemittanceSettingForm');