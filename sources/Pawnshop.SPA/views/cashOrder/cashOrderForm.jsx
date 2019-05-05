import React from 'react';
import { reduxForm, Field, formValueSelector } from 'redux-form';
import { users as usersLoad, accounts as accountsLoad, expenseTypes as expenseTypesLoad } from '../../actions/dictionaries';
import DateInput from '../controls/form/dateInput';
import DictInput from '../controls/form/dictInput';
import SelectInput from '../controls/form/selectInput';

class CashOrderForm extends React.Component {
    static contextTypes = {
        store: React.PropTypes.object.isRequired
    };

    onOrderTypeChange(e) {
        let orderType = e.target.value;
        let cashAccountId = this.props.options.cashOrderSettings.cashAccountId;
        this.props.change('orderType', orderType);
        if (orderType == 10) {
            this.props.change('debitAccountId', cashAccountId);
            this.props.change('creditAccountId', 0);
            this.props.change('expenseTypeId', null);
            this.props.change('expenseType', null);
        } else {
            this.props.change('creditAccountId', cashAccountId);
            this.props.change('debitAccountId', 0);
        }
        this.setState({
            orderType: orderType
        });
    }

    onExpenseTypeChange(e) {
        this.props.change('expenseTypeId', e.id);
        if (e.accountId) {
            this.props.change('debitAccountId', e.accountId);
        }
    }

    onProveTypeChange(e) {
        let proveType = e.target.value;
        this.props.change('proveType', proveType);
        if(proveType==10){
            this.props.change('debitAccountId', 35);
        }
        else if(proveType==20){
            this.props.change('debitAccountId', 112);
        }
        else{
            this.props.change('debitAccountId', 0);
        }
        this.setState({
            proveType: proveType
        });
        
    }

    render = () => {
        let { readOnly } = this.props;
        let state = this.context.store.getState();
        let orderType = selector(state, 'orderType');
        let proveType = selector(state, 'proveType');

        return (
            <form onSubmit={this.props.handleSubmit} className="form-horizontal">
                <div className="panel-body">
                    <fieldset className="form-group" disabled={readOnly}>
                        <label htmlFor="orderNumber" className="col-sm-2">№</label>
                        <div className="col-sm-4">
                            <Field name="orderNumber" component="input" type="text" className="form-control" disabled />
                        </div>
                        <label htmlFor="orderType" className="col-sm-2">Вид ордера</label>
                        <div className="col-sm-4">
                            <Field name="orderType" component="select" className="form-control" onChange={e => this.onOrderTypeChange(e)}>
                                <option value="10">Приход</option>
                                <option value="20">Расход</option>
                            </Field>
                        </div>
                    </fieldset>
                    <fieldset className="form-group" disabled={readOnly}>
                        <label htmlFor="orderDate" className="col-sm-2">Дата</label>
                        <div className="col-sm-4">
                            <Field name="orderDate" component={DateInput} className="form-control"/>
                        </div>
                        <label htmlFor="orderCost" className="col-sm-1">Сумма</label>
                        <div className="col-sm-2">
                            <Field name="orderCost" component="input" type="number" min="0" max="1000000000" className="form-control" />
                        </div>
                        <label htmlFor="orderCost" className="col-sm-1">Документы</label>
                        <div className="col-sm-2">
                        <Field name="proveType" component="select" className="form-control" onChange={e => this.onProveTypeChange(e)} disabled={orderType==10}>
                                <option value="">Не требуются</option>
                                <option value="10">Есть</option>
                                <option value="20">Нету</option>
                            </Field>
                        </div>
                    </fieldset>
                    <fieldset className="form-group" disabled={readOnly}>
                        <label htmlFor="userId" className="col-sm-3">Контрагент (кому/от кого)</label>
                        <div className="col-sm-9">
                            <Field name="userId" component={DictInput} className="form-control"
                                    dictionary="users" onLoad={usersLoad} display={(row, i) => row.fullname} />
                        </div>
                    </fieldset>
                    <fieldset className="form-group" disabled={readOnly}>
                            <label htmlFor="debitAccountId" className="col-sm-2">Дебет</label>
                            <div className="col-sm-4">
                                <Field name="debitAccountId" component={DictInput} className="form-control" disabled={proveType==10 || proveType==20}
                                        dictionary="accounts" onLoad={accountsLoad} display={(row, i) => row.code + ' ' + row.name} />
                            </div>
                        <label htmlFor="creditAccountId" className="col-sm-2">Кредит</label>
                        <div className="col-sm-4">
                            <Field name="creditAccountId" component={DictInput} className="form-control"
                                    dictionary="accounts" onLoad={accountsLoad} display={(row, i) => row.code + ' ' + row.name} />
                        </div>
                    </fieldset>
                    <fieldset className="form-group" disabled={readOnly} hidden={orderType != 20}>
                        <label htmlFor="expenseType" className="col-sm-2">Вид расходов</label>
                        <div className="col-sm-10">
                            <Field name="expenseType" component={SelectInput} className="form-control"
                                   title="Виды расходов" onLoad={expenseTypesLoad} readOnly={readOnly}
                                   display={e => e.expenseGroup.name + ' ' + e.name} onChange={e => this.onExpenseTypeChange(e)}>
                            </Field>
                        </div>
                    </fieldset>
                    <fieldset className="form-group" disabled={readOnly}>
                        <label htmlFor="reason" className="col-sm-2">Основание</label>
                        <div className="col-sm-10">
                            <Field name="reason" component="input" type="text" className="form-control" />
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
                    {readOnly ||
                        (!this.props.clientId && <button type="submit" className="btn btn-primary">Сохранить</button>)
                    }
                </div>
            </form>
        );
    }
}

export default reduxForm({
    form: 'CashOrderForm'
})(CashOrderForm);

export const selector = formValueSelector('CashOrderForm');