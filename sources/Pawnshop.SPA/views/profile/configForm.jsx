import React from 'react';
import { reduxForm, Field } from 'redux-form';

class ConfigurationForm extends React.Component {
    render() {
        let { readOnly, handleSubmit, parent } = this.props;
        parent = parent || {};
        let { contactSettings, legalSettings, bankSettings, contractSettings, cashOrderSettings } = parent;
        contactSettings = contactSettings || {};
        legalSettings = legalSettings || {};
        bankSettings = bankSettings || {};
        contractSettings = contractSettings || {};
        cashOrderSettings = cashOrderSettings || {};
        let cashAccount = (cashOrderSettings && cashOrderSettings.cashAccountId && this.props.accounts.find(a => a.id == cashOrderSettings.cashAccountId)) || null;
        if (cashAccount) {
            cashAccount = `Не выбрано (${cashAccount.code} - ${cashAccount.name})`;
        } else {
            cashAccount = 'Не выбрано';
        }
        return (
            <form onSubmit={handleSubmit} className="form-horizontal">
                <div className="panel-body">
                    <fieldset disabled={readOnly}>
                        <h5>Контактная информация</h5>
                        <div className="form-group">
                            <label htmlFor="contactSettings.phone" className="col-sm-4">Телефон</label>
                            <div className="col-sm-8">
                                <Field name="contactSettings.phone" component="input" type="text" className="form-control"
                                       placeholder={contactSettings.phone} />
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="contactSettings.city" className="col-sm-4">Город</label>
                            <div className="col-sm-8">
                                <Field name="contactSettings.city" component="input" type="text" className="form-control"
                                       placeholder={contactSettings.city} />
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="contactSettings.address" className="col-sm-4">Адрес</label>
                            <div className="col-sm-8">
                                <Field name="contactSettings.address" component="textarea" className="form-control"
                                       placeholder={contactSettings.address} />
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="contactSettings.schedule" className="col-sm-4">Режим работы</label>
                            <div className="col-sm-8">
                                <Field name="contactSettings.schedule" component="textarea" className="form-control"
                                       placeholder={contactSettings.schedule} />
                            </div>
                        </div>
                    </fieldset>
                    <fieldset disabled={readOnly}>
                        <h5>Юридический статус</h5>
                        <div className="form-group">
                            <label htmlFor="legalSettings.legalName" className="col-sm-4">Наименование организации</label>
                            <div className="col-sm-8">
                                <Field name="legalSettings.legalName" component="input" type="text" className="form-control"
                                       placeholder={legalSettings.legalName} />
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="legalSettings.okud" className="col-sm-4">ОКУД</label>
                            <div className="col-sm-8">
                                <Field name="legalSettings.okud" component="input" type="text" className="form-control"
                                       placeholder={legalSettings.okud} />
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="legalSettings.okpo" className="col-sm-4">ОКПО</label>
                            <div className="col-sm-8">
                                <Field name="legalSettings.okpo" component="input" type="text" className="form-control"
                                       placeholder={legalSettings.okpo} />
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="legalSettings.rnn" className="col-sm-4">РНН</label>
                            <div className="col-sm-8">
                                <Field name="legalSettings.rnn" component="input" type="text" className="form-control"
                                       placeholder={legalSettings.rnn} />
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="legalSettings.bin" className="col-sm-4">БИН</label>
                            <div className="col-sm-8">
                                <Field name="legalSettings.bin" component="input" type="text" className="form-control"
                                       placeholder={legalSettings.bin} />
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="legalSettings.chiefName" className="col-sm-4">Руководитель</label>
                            <div className="col-sm-8">
                                <Field name="legalSettings.chiefName" component="input" type="text" className="form-control"
                                       placeholder={legalSettings.chiefName} />
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="legalSettings.chiefAccountantName" className="col-sm-4">Главный бухгалтер</label>
                            <div className="col-sm-8">
                                <Field name="legalSettings.chiefAccountantName" component="input" type="text" className="form-control"
                                       placeholder={legalSettings.chiefAccountantName} />
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="legalSettings.accountantName" className="col-sm-4">Бухгалтер</label>
                            <div className="col-sm-8">
                                <Field name="legalSettings.accountantName" component="input" type="text" className="form-control"
                                       placeholder={legalSettings.accountantName} />
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="legalSettings.cashierName" className="col-sm-4">Кассир</label>
                            <div className="col-sm-8">
                                <Field name="legalSettings.cashierName" component="input" type="text" className="form-control"
                                       placeholder={legalSettings.cashierName} />
                            </div>
                        </div>
                    </fieldset>
                    <fieldset disabled={readOnly}>
                        <h5>Банковские реквизиты</h5>
                        <div className="form-group">
                            <label htmlFor="bankSettings.bankName" className="col-sm-4">Наименование банка</label>
                            <div className="col-sm-8">
                                <Field name="bankSettings.bankName" component="input" type="text" className="form-control"
                                       placeholder={bankSettings.bankName} />
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="bankSettings.bankBik" className="col-sm-4">БИК банка</label>
                            <div className="col-sm-8">
                                <Field name="bankSettings.bankBik" component="input" type="text" className="form-control"
                                       placeholder={bankSettings.bankBik} />
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="bankSettings.bankAccount" className="col-sm-4">Номер счета</label>
                            <div className="col-sm-8">
                                <Field name="bankSettings.bankAccount" component="input" type="text" className="form-control"
                                       placeholder={bankSettings.bankAccount} />
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="bankSettings.bankKbe" className="col-sm-4">Кбе</label>
                            <div className="col-sm-8">
                                <Field name="bankSettings.bankKbe" component="input" type="text" className="form-control"
                                       placeholder={bankSettings.bankKbe} />
                            </div>
                        </div>
                    </fieldset>
                    <fieldset disabled={readOnly}>
                        <h5>Профиль договора</h5>
                        <div className="form-group">
                            <label htmlFor="contractSettings.numberCode" className="col-sm-4">Код для номера договора</label>
                            <div className="col-sm-8">
                                <Field name="contractSettings.numberCode" component="input" type="text" className="form-control"
                                       placeholder={contractSettings.numberCode} />
                            </div>
                        </div>
                    </fieldset>
                    <fieldset disabled={readOnly}>
                        <h5>Профиль ПКО и РКО</h5>
                        <div className="form-group">
                            <label htmlFor="cashOrderSettings.cashInNumberCode" className="col-sm-4">Код для номера ПКО</label>
                            <div className="col-sm-8">
                                <Field name="cashOrderSettings.cashInNumberCode" component="input" type="text" className="form-control"
                                       placeholder={cashOrderSettings.cashInNumberCode} />
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="cashOrderSettings.cashOutNumberCode" className="col-sm-4">Код для номера РКО</label>
                            <div className="col-sm-8">
                                <Field name="cashOrderSettings.cashOutNumberCode" component="input" type="text" className="form-control"
                                       placeholder={cashOrderSettings.cashOutNumberCode} />
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="cashOrderSettings.cashAccountId" className="col-sm-4">Счет кассы</label>
                            <div className="col-sm-8">
                                <Field name="cashOrderSettings.cashAccountId" component="select" className="form-control">
                                    <option value=''>{cashAccount}</option>
                                    {this.props.accounts.map(a => <option key={a.id} value={a.id}>{`${a.code} - ${a.name}`}</option>)}
                                </Field>
                            </div>
                        </div>
                        {this.renderCollateralSettings(cashOrderSettings.goldCollateralSettings, 'cashOrderSettings.goldCollateralSettings', 'Золото')}
                        {this.renderCollateralSettings(cashOrderSettings.goodCollateralSettings, 'cashOrderSettings.goodCollateralSettings', 'Товары')}
                        {this.renderCollateralSettings(cashOrderSettings.carCollateralSettings, 'cashOrderSettings.carCollateralSettings', 'Автотранспорт')}
                        {this.renderCollateralSettings(cashOrderSettings.machineryCollateralSettings, 'cashOrderSettings.machineryCollateralSettings', 'Спецтехника')}
                        {this.renderTransferSettings(cashOrderSettings.carTransferSettings, 'cashOrderSettings.carTransferSettings', 'Передача автотранспорт')}
                        {this.renderInsuranceSettings(cashOrderSettings.insuranceSettings, 'cashOrderSettings.insuranceSettings', 'Страховой договор')}
                    </fieldset>
                </div>
                {readOnly ||
                    <div className="panel-footer">
                        <button type="submit" className="btn btn-primary">Сохранить</button>
                    </div>
                }
            </form>
        );
    }

    renderCollateralSettings(parent, path, title) {
        return (
            <div className="row">
                <div className="col-sm-12">
                    <div className="panel panel-default">
                        <div className="panel-heading">{title}</div>
                        <div className="panel-body">
                            {this.renderAccountSettings(parent && parent.supplySettings, `${path}.supplySettings`, 'Выдача')}
                            {this.renderAccountSettings(parent && parent.debtSettings, `${path}.debtSettings`, 'Погашение основного долга')}
                            {this.renderAccountSettings(parent && parent.loanSettings, `${path}.loanSettings`, 'Проценты')}
                            {this.renderAccountSettings(parent && parent.penaltySettings, `${path}.penaltySettings`, 'Штраф')}
                            {this.renderAccountSettings(parent && parent.sellingSettings, `${path}.sellingSettings`, 'Отправка на реализацию')}
                            {this.renderAccountSettings(parent && parent.disposeSettings, `${path}.disposeSettings`, 'Реализация')}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    renderTransferSettings(parent, path, title) {
        return (
            <div className="row">
                <div className="col-sm-12">
                    <div className="panel panel-default">
                        <div className="panel-heading">{title}</div>
                        <div className="panel-body">
                            {this.renderAccountSettings(parent && parent.supplyDebtSettings, `${path}.supplyDebtSettings`, 'Погашение основного долга при передаче')}
                            {this.renderAccountSettings(parent && parent.supplyLoanSettings, `${path}.supplyLoanSettings`, 'Проценты при передаче')}
                            {this.renderAccountSettings(parent && parent.supplyPenaltySettings, `${path}.supplyPenaltySettings`, 'Штраф при передаче')}
                            {this.renderAccountSettings(parent && parent.debtSettings, `${path}.debtSettings`, 'Погашение основного долга')}
                            {this.renderAccountSettings(parent && parent.loanSettings, `${path}.loanSettings`, 'Проценты')}
                            {this.renderAccountSettings(parent && parent.penaltySettings, `${path}.penaltySettings`, 'Штраф')}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    renderInsuranceSettings(parent, path, title) {
        return (
            <div className="row">
                <div className="col-sm-12">
                    <div className="panel panel-default">
                        <div className="panel-heading">{title}</div>
                        <div className="panel-body">
                            {this.renderAccountSettings(parent && parent.signSettings, `${path}.signSettings`, 'Подписание страхового договора')}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    renderAccountSettings(parent, path, title) {
        let { accounts } = this.props;
        let debitPath = `${path}.debitId`;
        let creditPath = `${path}.creditId`;
        let debitParent = (parent && parent.debitId && accounts.find(a => a.id == parent.debitId)) || null;
        let creditParent = (parent && parent.creditId && accounts.find(a => a.id == parent.creditId)) || null;
        if (debitParent) {
            debitParent = `Не выбрано (${debitParent.code} - ${debitParent.name})`;
        } else {
            debitParent = 'Не выбрано';
        }
        if (creditParent) {
            creditParent = `Не выбрано (${creditParent.code} - ${creditParent.name})`;
        } else {
            creditParent = 'Не выбрано';
        }

        return (
            <div className="row">
                <div className="col-sm-12">
                    <div className="panel panel-default">
                        <div className="panel-heading">{title}</div>
                        <div className="panel-body">
                            <div className="col-sm-6">
                                <div className="form-group">
                                    <label htmlFor={debitPath} className="col-sm-4">Дебет</label>
                                    <div className="col-sm-8">
                                        <Field name={debitPath} component="select" className="form-control">
                                            <option value=''>{debitParent}</option>
                                            {accounts.map(a => <option key={a.id} value={a.id}>{`${a.code} - ${a.name}`}</option>)}
                                        </Field>
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-6">
                                <div className="form-group">
                                    <label htmlFor={creditPath} className="col-sm-4">Кредит</label>
                                    <div className="col-sm-8">
                                        <Field name={creditPath} component="select" className="form-control">
                                            <option value=''>{creditParent}</option>
                                            {accounts.map(a => <option key={a.id} value={a.id}>{`${a.code} - ${a.name}`}</option>)}
                                        </Field>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default reduxForm({
    form: 'ConfigurationForm'
})(ConfigurationForm);