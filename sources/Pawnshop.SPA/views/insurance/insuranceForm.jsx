import React from 'react';
import { reduxForm, Field, FieldArray, formValueSelector } from 'redux-form';
import { Tabs, Tab } from 'react-bootstrap';
import DateInput from '../controls/form/dateInput';
import InsuranceActions from './insuranceActions';
import Restrict from '../controls/restrict';
import permissions from '../../engine/permissions';

class InsuranceForm extends React.Component {
    static contextTypes = {
        store: React.PropTypes.object.isRequired
    };

    render() {
        return (
            <form onSubmit={this.props.handleSubmit} className="form-horizontal">
                <div className="panel-heading">
                    {this.renderToolbar()}
                </div>
                <Tabs defaultActiveKey="insurance" id="insuranceCardTabs">
                    <Tab eventKey="insurance" title="Договор">
                        {this.renderForm()}
                    </Tab>
                    <Tab eventKey="actions" title="Журнал действий">
                        <FieldArray name="actions" component={InsuranceActions} />
                    </Tab>
                </Tabs>
            </form>
        );
    }

    renderToolbar() {
        let status = this.props.status;

        return (
            <div className="btn-toolbar">
                <button type="button" className="btn btn-default" onClick={() => history.back()}>Назад</button>
                {status < 30 &&
                    <Restrict permissions={permissions.InsuranceManage}>
                        <div className="btn-group">
                            <button type="submit" className="btn btn-primary">Сохранить</button>
                        </div>
                    </Restrict>
                }
            </div>
        );
    }

    renderForm() {
        let readOnly = this.props.status > 20;

        return (
            <div className="panel-body">
                <fieldset>
                    <div className="col-sm-4">
                        <div className="form-group">
                            <label htmlFor="contract.contractDate" className="col-sm-6">Дата кредита</label>
                            <div className="col-sm-6">
                                <Field name="contract.contractDate" component={DateInput} className="form-control" disabled={true} />
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-8">
                        <div className="form-group">
                            <label htmlFor="contract.contractData.client.fullname" className="col-sm-2">Клиент</label>
                            <div className="col-sm-10">
                                <Field name="contract.contractData.client.fullname" component="input" type="text" className="form-control" disabled={true} />
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-6">
                        <div className="form-group">
                            <label htmlFor="insuranceNumber" className="col-sm-4">№</label>
                            <div className="col-sm-8">
                                <Field name="insuranceNumber" component="input" type="text" className="form-control" disabled={readOnly} />
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-6">
                        <div className="form-group">
                            <label htmlFor="insuranceData.invoiceNumber" className="col-sm-4">№ счета на оплату</label>
                            <div className="col-sm-8">
                                <Field name="insuranceData.invoiceNumber" component="input" type="text" className="form-control" disabled={readOnly} />
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-6">
                        <div className="form-group">
                            <label htmlFor="insuranceData.paymentNumber" className="col-sm-4">№ платежного поручения банка</label>
                            <div className="col-sm-8">
                                <Field name="insuranceData.paymentNumber" component="input" type="text" className="form-control" disabled={readOnly} />
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-6">
                        <div className="form-group">
                            <label htmlFor="insuranceData.paymentDate" className="col-sm-4">Дата платежного поручения банка</label>
                            <div className="col-sm-8">
                                <Field name="insuranceData.paymentDate" component={DateInput} className="form-control" disabled={readOnly} />
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-6">
                        <div className="form-group">
                            <label htmlFor="insuranceCost" className="col-sm-4">Сумма</label>
                            <div className="col-sm-8">
                                <Field name="insuranceCost" component="input" type="number" className="form-control" disabled={true} />
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-6">
                        <div className="form-group">
                            <label htmlFor="beginDate" className="col-sm-4">Дата оформления</label>
                            <div className="col-sm-8">
                                <Field name="beginDate" component={DateInput} className="form-control" disabled={true} />
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-6">
                        <div className="form-group">
                            <label htmlFor="endDate" className="col-sm-4">Дата закрытия</label>
                            <div className="col-sm-8">
                                <Field name="endDate" component={DateInput} className="form-control" disabled={true} />
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-6">
                        <div className="form-group">
                            <label htmlFor="cashbackCost" className="col-sm-4">Сумма к возврату</label>
                            <div className="col-sm-8">
                                <Field name="cashbackCost" component="input" type="number" className="form-control" disabled={true} />
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-6">
                        <div className="form-group">
                            <label htmlFor="status" className="col-sm-4">Статус</label>
                            <div className="col-sm-8">
                                <Field name="status" component="select" className="form-control" disabled={true}>
                                    <option value="0">Черновик</option>
                                    <option value="10">Подписан</option>
                                    <option value="20">Оплачен</option>
                                    <option value="30">Закрыт</option>
                                </Field>
                            </div>
                        </div>
                    </div>
                </fieldset>
            </div>
        );
    }
}

export default reduxForm({
    form: 'InsuranceForm'
})(InsuranceForm);

export const selector = formValueSelector('InsuranceForm');