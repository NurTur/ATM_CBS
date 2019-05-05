import React from 'react';
import { reduxForm, Field, FieldArray, formValueSelector } from 'redux-form';
import { Tabs, Tab, Glyphicon, Dropdown, MenuItem } from 'react-bootstrap';
import ContractPositions from './contractPositions';
import ContractActions from './contractActions';
import FileList from '../controls/form/fileList';
import DateInput from '../controls/form/dateInput';
import SelectInput from '../controls/form/selectInput';
import PhoneInput from '../controls/form/phoneInput';
import Restrict from '../controls/restrict';
import classnames from 'classnames';
import permissions from '../../engine/permissions';
import moment from 'moment';
import PersonForm, { submitForm as personSubmit } from '../client/personForm';
import CompanyForm, { submitForm as companySubmit } from '../client/companyForm';

import { clients as clientsLoad } from '../../actions/dictionaries';
import { add as personSave } from '../../actions/persons';
import { add as companySave } from '../../actions/companies';

import EventLogs from '../administration/eventLogs';
import ContractNotes from './contractNotes';

class ContractForm extends React.Component {
    static contextTypes = {
        store: React.PropTypes.object.isRequired
    };

    state = {};

    onClientChange(e) {
        e.preventDefault();
        e.cardType = 10;
        this.props.change('contractData.client', e);
        this.props.change('clientId', e.id);
        this.onUpdateLoanPercent();
        this.setState({
            cardType: e.cardType
        });
    }

    onCollateralTypeChange(e) {
        this.props.change('positions', []);
        this.onUpdateLoanPercent();
        this.setState({
            collateralType: e.target.value
        });
    }

    onClientCardTypeChange(e) {
        this.props.change('contractData.client.cardType', e.target.value);
        this.onUpdateLoanPercent();
        this.setState({
            cardType: e.target.value
        });
        let value = parseInt(e.target.value);
        if(value==20)
        {
            this.props.change('percentPaymentType', 20);
            this.onPercentPaymentTypeChange(e);
        }
    }

    onPercentPaymentTypeChange(e) {
        let state = this.context.store.getState();
        let value = parseInt(e.target.value);
        let contractDate = selector(state, 'contractDate');
        let loanPeriod = selector(state, 'loanPeriod');
        let cardType = selector(state, 'contractData.client.cardType');

        switch (value) {
            case 20:
                loanPeriod = 30;
                break;
            case 30:
                loanPeriod = 365;
                break;
            case 31:
                loanPeriod = 730;
                break;
            default:
                break;
        }

        contractDate = moment(contractDate).startOf('day');
        let maturityDate = contractDate.clone().add(loanPeriod - 1, 'days').startOf('day');
        this.props.change('loanPeriod', loanPeriod);
        this.props.change('maturityDate', maturityDate);
        this.props.change('originalMaturityDate', maturityDate);
        this.onUpdateLoanPercent();
        this.setState({
            loanPeriod: loanPeriod,
            maturityDate: maturityDate
        });
    }

    componentWillReceiveProps(props) {
        let readOnly = props.status > 0 || props.readOnly;
        if (!readOnly) {
            if ((props.profile && props.profile.loanPercent) !== (this.props.profile && this.props.profile.loanPercent) ||
                (props.profile && props.profile.penaltyPercent) !== (this.props.profile && this.props.profile.penaltyPercent)) {
                if (props.profile) {
                    this.props.change('loanPercent', props.profile.loanPercent);
                    this.props.change('penaltyPercent', props.profile.penaltyPercent);
                } else {
                    this.props.change('loanPercent', null);
                    this.props.change('penaltyPercent', null);
                }
                this.onPositionsChange(true);
            }
        }
    }

    onUpdateLoanPercent() {
        let state = this.context.store.getState();
        let collateralType = selector(state, 'collateralType');
        let cardType = selector(state, 'contractData.client.cardType');
        let loanCost = selector(state, 'loanCost');
        let loanPeriod = selector(state, 'loanPeriod');
        if (!collateralType || !cardType || !loanCost || !loanPeriod) return;

        this.props.onFindProfile({
            collateralType: collateralType,
            cardType: cardType,
            loanCost: loanCost,
            loanPeriod: loanPeriod
        });
    }

    onPositionsChange(skipReload) {
        let state = this.context.store.getState();
        let positions = selector(state, 'positions');
        let loanPercent = selector(state, 'loanPercent');
        let penaltyPercent = selector(state, 'penaltyPercent');
        let beforeLoanCost = selector(state, 'loanCost');

        let totalLoanCost = 0;
        let totalEstimatedCost = 0;
        let totalWeight = 0;
        let totalSpecificWeight = 0;

        for (let p of positions) {
            totalLoanCost       += parseFloat(p.loanCost) || 0;
            totalEstimatedCost  += parseFloat(p.estimatedCost) || 0;
            totalWeight         += (p.positionSpecific && parseFloat(p.positionSpecific.collateralTotalWeight)) || 0;
            totalSpecificWeight += (p.positionSpecific && parseFloat(p.positionSpecific.collateralSpecificWeight)) || 0;
        }
        this.props.change('loanCost', totalLoanCost);
        this.props.change('estimatedCost', totalEstimatedCost);
        this.props.change('contractSpecific.collateralTotalWeight', totalWeight);
        this.props.change('contractSpecific.collateralSpecificWeight', totalSpecificWeight);
        if (loanPercent) {
            this.props.change('loanPercentCost', totalLoanCost * (parseFloat(loanPercent) / 100));
        }
        if (penaltyPercent) {
            this.props.change('penaltyPercentCost', totalLoanCost * (parseFloat(penaltyPercent) / 100));
        }
        if (skipReload !== true && (beforeLoanCost !== totalLoanCost)) {
            this.onUpdateLoanPercent();
        }
    }

    render() {
        let readOnly = this.props.status > 0 || this.props.readOnly || !!this.props.deleteDate;
        let locked = this.props.locked || readOnly;
        let state = this.context.store.getState();
        let collateralType = this.state.collateralType || selector(state, 'collateralType');
        let cardType = this.state.cardType || selector(state, 'contractData.client.cardType');

        return (
            <form onSubmit={this.props.handleSubmit} className="form-horizontal">
                <div className="panel-heading">
                    {this.renderToolbar()}
                </div>
                <Tabs defaultActiveKey="contract" id="contractCardTabs">
                    <Tab eventKey="contract" title="Договор">
                        {this.renderForm(readOnly, locked)}
                    </Tab>
                    <Tab eventKey="contractPositions" title="Позиции">
                        <div className="panel-body">
                            <fieldset disabled={readOnly} className={classnames("row", {
                                "hidden": collateralType != 10,
                            })}>
                                <div className="col-xs-6">
                                    <div className="form-group">
                                        <label htmlFor="contractSpecific.collateralTotalWeight" className="col-xs-4">Общий вес</label>
                                        <div className="col-xs-8">
                                            <Field name="contractSpecific.collateralTotalWeight" component="input" type="number" min="0" max="100000000" className="form-control" readOnly />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xs-6">
                                    <div className="form-group">
                                        <label htmlFor="contractSpecific.collateralSpecificWeight" className="col-xs-4">Чистый вес</label>
                                        <div className="col-xs-8">
                                            <Field name="contractSpecific.collateralSpecificWeight" component="input" type="number" min="0" max="100000000" className="form-control" readOnly />
                                        </div>
                                    </div>
                                </div>
                            </fieldset>

                            <fieldset className="row" disabled={readOnly}>
                                <div className="col-xs-6">
                                    <div className="form-group">
                                        <label htmlFor="estimatedCost" className="col-xs-4">Оценка</label>
                                        <div className="col-xs-8">
                                            <Field name="estimatedCost" component="input" type="number" min="0" max="100000000" className="form-control" readOnly />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xs-6">
                                    <div className="form-group">
                                        <label htmlFor="loanCost" className="col-xs-4">Ссуда</label>
                                        <div className="col-xs-8">
                                            <Field name="loanCost" component="input" type="number" min="0" max="100000000" className="form-control" readOnly />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6 col-lg-3">
                                    <div className="form-group">
                                        <label htmlFor="loanPercent" className="col-xs-6">Процент пошлины</label>
                                        <div className="col-xs-6">
                                            <Field name="loanPercent" component="input" type="number" min="0" max="100" step="0.0001" className="form-control" readOnly />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6 col-lg-3">
                                    <div className="form-group">
                                        <label htmlFor="loanPercentCost" className="col-xs-6">Пошлина в день</label>
                                        <div className="col-xs-6">
                                            <Field name="loanPercentCost" component="input" type="number" min="0" max="100000000" className="form-control" readOnly />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6 col-lg-3">
                                    <div className="form-group">
                                        <label htmlFor="penaltyPercent" className="col-xs-6">Процент штрафа</label>
                                        <div className="col-xs-6">
                                            <Field name="penaltyPercent" component="input" type="number" min="0" max="100" step="0.0001" className="form-control" readOnly />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6 col-lg-3">
                                    <div className="form-group">
                                        <label htmlFor="penaltyPercentCost" className="col-xs-6">Штраф в день</label>
                                        <div className="col-xs-6">
                                            <Field name="penaltyPercentCost" component="input" type="number" min="0" max="100000000" className="form-control" readOnly />
                                        </div>
                                    </div>
                                </div>
                            </fieldset>
                            <FieldArray name="positions" component={ContractPositions}
                                collateralType={collateralType} cardType={cardType}
                                readOnly={readOnly} locked={locked} onChange={() => this.onPositionsChange()}
                                onPositionChange={(field, value) => this.props.change(field, value)} />
                        </div>
                    </Tab>
                    <Tab eventKey="contractFiles" title="Файлы">
                        <FieldArray name="files" component={FileList}
                                    readOnly={readOnly || this.props.id == 0} allowUpload={!this.props.deleteDate && this.props.id > 0}
                                    onSave={fileRowId => this.props.onFileSave({ contractId: this.props.id, fileRowId: fileRowId })}
                                    onRemove={fileRowId => this.props.onFileRemove({ contractId: this.props.id, fileRowId: fileRowId })} />
                    </Tab>
                    <Tab eventKey="actions" title="Журнал действий">
                        <FieldArray name="actions" component={ContractActions} auth={this.props.auth}
                                    onCancel={this.props.onActionCancel} onOpen={this.props.onActionOpen}
                                    onCashOrderPrint={this.props.onCashOrderPrint} branchId={(this.state.branchId || selector(state, 'branchId'))}/>
                    </Tab>
                    <Tab eventKey="eventLogs" title="Журнал событий">
                        <EventLogs entityId={this.props.params.id} entityType={10} entityView={true} />
                    </Tab>
                    <Tab eventKey="contractNotes" title="Примечания">
                        <ContractNotes contractId={this.props.params.id} />
                    </Tab>
                </Tabs>
                <div className="panel-footer">
                    {this.renderToolbar()}
                </div>
            </form>
        );
    }

    renderToolbar() {
        let state = this.context.store.getState();
        let status = this.props.status || -1;
        let label;
        let labelClass;
        
        switch (status) {
            case 30:
                label = "Подписан";
                labelClass = "label label-info";
                break;
            case 40:
                label = "Выкуплен";
                labelClass = "label label-success";
                break;
            case 50:
                label = "Отправлен на реализацию";
                labelClass = "label label-danger";
                break;
            default:
                label = "Черновик";
                labelClass = "label label-default";
                break;
        }
        const { handleSubmit, onSign, onInsuranceSign } = this.props;
        
        let percentPaymentType = this.state.percentPaymentType || selector(state, 'percentPaymentType');
        let cardType = this.state.cardType || selector(state, 'contractData.client.cardType');
        let contractDate = this.state.contractDate || selector(state, 'contractDate');
        let maturityDate = this.state.maturityDate || selector(state, 'maturityDate');
        let loanCost = this.state.loanCost || selector(state, 'loanCost');
        let loanPercent = this.state.loanPercent || selector(state, 'loanPercent');

        return (
            <div className="btn-toolbar">
                <button type="button" className="btn btn-default" onClick={() => history.back()}>Назад</button>
                {status <= 0 && !this.props.deleteDate &&
                    <Restrict permissions={permissions.ContractManage}>
                        <div className="btn-group">
                            <button type="submit" className="btn btn-primary">Сохранить</button>
                            <button type="button" className="btn btn-success" onClick={handleSubmit(val => onSign(val))}>Подписать</button>
                            {this.props.id > 0 && <Restrict permissions={permissions.InsuranceView}>
                                <button type="button" className="btn btn-default" onClick={handleSubmit(val => onInsuranceSign(val))}>Страховка</button>
                            </Restrict>}
                        </div>
                    </Restrict>
                }
                {status == 30 && !this.props.deleteDate &&
                    <Restrict permissions={permissions.ContractManage}>
                        <div className="btn-group">
                            {(((this.state.branchId || selector(state, 'branchId'))==(this.props.auth.branchId)) || this.props.auth.profile.user.forSupport) && percentPaymentType == 20 && <button type="button" className="btn btn-default" onClick={this.props.onProlong}>Продление</button>}
                            {(((this.state.branchId || selector(state, 'branchId'))==(this.props.auth.branchId)) || this.props.auth.profile.user.forSupport) && percentPaymentType == 20 && <button type="button" className="btn btn-default" onClick={this.props.onBuyout}>Выкуп</button>}
                            {((this.state.branchId || selector(state, 'branchId'))==(this.props.auth.branchId)) && percentPaymentType == 20 && <button type="button" className="btn btn-default" onClick={this.props.onAddition}>Добор</button>}
                            {((this.state.branchId || selector(state, 'branchId'))==(this.props.auth.branchId)) && !this.props.transferDate && percentPaymentType == 20 && <button type="button" className="btn btn-default" onClick={this.props.onPartialBuyout}>Частичный выкуп</button>}
                            {((this.state.branchId || selector(state, 'branchId'))==(this.props.auth.branchId)) && !this.props.transferDate && percentPaymentType == 20 && <button type="button" className="btn btn-default" onClick={this.props.onPartialPayment}>Частичное гашение</button>}
                            {((this.state.branchId || selector(state, 'branchId'))==(this.props.auth.branchId)) && !this.props.transferDate && percentPaymentType == 20 && <button type="button" className="btn btn-default" onClick={this.props.onSelling}>Реализация</button>}
                            {((this.state.branchId || selector(state, 'branchId'))==(this.props.auth.branchId)) && !this.props.transferDate && (percentPaymentType == 30 || percentPaymentType == 31) && <button type="button" className="btn btn-default" onClick={this.props.onMonthlyPayment}>Погашение</button>}
                            {((this.state.branchId || selector(state, 'branchId'))==(this.props.auth.branchId)) && !this.props.transferDate && (percentPaymentType == 30 || percentPaymentType == 31) && <button type="button" className="btn btn-default" onClick={this.props.onAnnuityBuyout}>Выкуп</button>}
                            {((this.state.branchId || selector(state, 'branchId'))==(this.props.auth.branchId)) && !this.props.transferDate && (percentPaymentType == 30 || percentPaymentType == 31) && <button type="button" className="btn btn-default" onClick={this.props.onAnnuityAddition}>Добор</button>}
                            {((this.state.branchId || selector(state, 'branchId'))==(this.props.auth.branchId)) && !this.props.transferDate && (percentPaymentType == 30 || percentPaymentType == 31) && <button type="button" className="btn btn-default" onClick={this.props.onAnnuityPartialPayment}>Частичное гашение</button>}
                            {((this.state.branchId || selector(state, 'branchId'))==(this.props.auth.branchId)) && !this.props.transferDate && percentPaymentType == 20 && this.props.collateralType == 20 && <Restrict permissions={permissions.ContractTransfer}>
                                <button type="button" className="btn btn-default" onClick={this.props.onTransfer}>Передача</button>
                            </Restrict>}
                            {percentPaymentType == 20 && <button type="button" className="btn btn-default" onClick={this.props.onCalculator}><Glyphicon glyph="calendar" /></button>}
                        </div>
                    </Restrict>
                }
                {status >= 30 && !this.props.deleteDate &&
                    <Dropdown pullRight={true}>
                        <Dropdown.Toggle>
                            <Glyphicon glyph="print" />
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <MenuItem eventKey="1" onClick={this.props.onPrintCard}>Залоговый билет</MenuItem>
                            <MenuItem eventKey="2" onClick={this.props.onPrintContractCollateral}>Договор залога</MenuItem>
                        </Dropdown.Menu>
                    </Dropdown>
                }
                {(percentPaymentType == 30 || percentPaymentType == 31) &&
                    <button type="button" className="btn btn-default" onClick={e => this.props.onSchedule({
                        contractDate: contractDate,
                        maturityDate: maturityDate,
                        loanCost: loanCost,
                        loanPercent: loanPercent
                    })}>График погашения</button>
                }
                <div className="pull-right">
                    <span className={labelClass}>{label}</span>
                </div>
            </div>
        );
    }

    renderForm(readOnly, locked) {
        return (
            <div className="panel-body">
                <fieldset disabled={readOnly}>
                    <div className="col-md-6 col-lg-4">
                        <div className="form-group">
                            <label htmlFor="contractNumber" className="col-xs-6">№</label>
                            <div className="col-xs-6">
                                <Field name="contractNumber" component="input" type="text" className="form-control" disabled />
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-4">
                        <div className="form-group">
                            <label htmlFor="collateralType" className="col-xs-6">Вид залога</label>
                            <div className="col-xs-6">
                                <Field name="collateralType" component="select" className="form-control" disabled={locked}
                                       onChange={e => this.onCollateralTypeChange(e)}>
                                    <option value="20">Автотранспорт</option>
                                    <option value="40">Спецтехника</option>
                                    <option value="10" disabled>Золото</option>
                                    <option value="30" disabled>Товар</option>                                    
                                </Field>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-4">
                        <div className="form-group">
                            <label htmlFor="percentPaymentType" className="col-xs-6">Удержание процентов</label>
                            <div className="col-xs-6">
                                <Field name="percentPaymentType" component="select" className="form-control"
                                       onChange={e => this.onPercentPaymentTypeChange(e)} disabled={this.state.cardType==20}>
                                    {/*<option value="10">При получении ссуды</option>*/}
                                    <option value="20">По истечении срока</option>
                                    <option value="30">12 месяцев</option>
                                    <option value="31" disabled>24 месяца</option>
                                </Field>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-4">
                        <div className="form-group">
                            <label htmlFor="contractDate" className="col-xs-6">Дата</label>
                            <div className="col-xs-6">
                                <Field name="contractDate" component={DateInput} className="form-control" disabled />
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-4">
                        <div className="form-group">
                            <label htmlFor="loanPeriod" className="col-xs-6">Срок залога</label>
                            <div className="col-xs-6">
                                <Field name="loanPeriod" component="input" className="form-control" type="number" disabled />
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-4">
                        <div className="form-group">
                            <label htmlFor="maturityDate" className="col-xs-6">Дата возврата</label>
                            <div className="col-xs-6">
                                <Field name="maturityDate" component={DateInput} className="form-control" disabled />
                            </div>
                        </div>
                    </div>
                </fieldset>
                <div className="panel panel-default">
                    <div className="panel-heading">
                        <div className="btn-toolbar">
                            <div className="pull-left">
                                <h4>Клиент</h4>
                            </div>
                        </div>
                    </div>
                    <div className="panel-body">
                        <fieldset className="form-group">
                            <label htmlFor="contractData.client" className="col-sm-2">Клиент</label>
                            <div className="col-sm-10">
                                <Field name="contractData.client" component={SelectInput} className="form-control"
                                       title="Выбор клиента" onLoad={clientsLoad} readOnly={locked}
                                       display={e => e.fullname} onChange={e => this.onClientChange(e)}>
                                    <PersonForm onSave={personSave} submitForm={personSubmit} title="Новый клиент" initialValues={{
                                        cardType: 10,
                                        documentType: 10,
                                    }} formOnly />
                                    <CompanyForm onSave={companySave} submitForm={companySubmit} title="Новая компания" initialValues={{
                                        cardType: 10,
                                        documentType: 10,
                                    }} formOnly />
                                </Field>
                            </div>
                        </fieldset>
                        <fieldset className="form-group">
                            <label htmlFor="contractData.client.cardType" className="col-sm-2">Тип карты</label>
                            <div className="col-sm-10">
                                <Restrict permissions={permissions.ClientCardTypeManage} pass passField="disabled">
                                    <Field name="contractData.client.cardType" component="select" className="form-control"
                                           disabled={readOnly} onChange={e => this.onClientCardTypeChange(e)}>
                                        <option value="10">Standard</option>
                                        <option value="20">Bronze</option>
                                        <option value="30">Silver</option>
                                        <option value="40">Gold</option>
                                        <option value="50">Platinum</option>
                                    </Field>
                                </Restrict>
                            </div>
                            <label htmlFor="contractData.client.cardNumber" className="col-sm-1 hidden">№</label>
                            <div className="col-sm-5 hidden">
                                <Field name="contractData.client.cardNumber" component="input" type="text" className="form-control" readOnly={readOnly} />
                            </div>
                        </fieldset>
                        <fieldset className="form-group">
                            <label htmlFor="contractData.client.fullname" className="col-sm-2">Клиент</label>
                            <div className="col-sm-4">
                                <Field name="contractData.client.fullname" component="input" type="text" className="form-control" readOnly={readOnly} />
                            </div>
                            <label htmlFor="contractData.client.identityNumber" className="col-sm-2">ИИН/БИН</label>
                            <div className="col-sm-4">
                                <Field name="contractData.client.identityNumber" component="input" type="text" className="form-control" readOnly={readOnly} />
                            </div>
                        </fieldset>
                        <fieldset className="form-group">
                            <label htmlFor="contractData.client.address" className="col-sm-2">Адрес факт.</label>
                            <div className="col-sm-4">
                                <Field name="contractData.client.address" component="input" type="text" className="form-control" readOnly={readOnly} />
                            </div>
                            <label htmlFor="contractData.client.mobilePhone" className="col-sm-2">Телефон</label>
                            <div className="col-sm-4">
                                <Field name="contractData.client.mobilePhone" component={PhoneInput} className="form-control" readOnly={readOnly} />
                            </div>
                        </fieldset>
                        <fieldset className="form-group">
                            <label htmlFor="contractData.client.registrationAddress" className="col-sm-2">Адрес рег.</label>
                            <div className="col-sm-4">
                                <Field name="contractData.client.registrationAddress" component="input" type="text" className="form-control" readOnly={readOnly} />
                            </div>
                        </fieldset>
                        <fieldset className="form-group">
                            <label htmlFor="contractData.client.documentType" className="col-sm-2">Документ</label>
                            <div className="col-sm-4">
                                <Field name="contractData.client.documentType" component="select" className="form-control" disabled={readOnly}>
                                    <option value="10">Удостоверение личности</option>
                                    <option value="20">Паспорт</option>
                                    <option value="30">Свидетельство о гос регистрации</option>
                                </Field>
                            </div>
                            <label htmlFor="contractData.client.documentNumber" className="col-sm-2">№ документа</label>
                            <div className="col-sm-4">
                                <Field name="contractData.client.documentNumber" component="input" type="text" className="form-control" readOnly={readOnly} />
                            </div>
                            <label htmlFor="contractData.client.documentSeries" className="col-sm-1 hidden">Серия</label>
                            <div className="col-sm-3 hidden">
                                <Field name="contractData.client.documentSeries" component="input" type="text" className="form-control" readOnly={readOnly} />
                            </div>
                        </fieldset>
                        <fieldset className="form-group">
                            <label htmlFor="contractData.client.documentDate" className="col-sm-2">Дата выдачи</label>
                            <div className="col-sm-4">
                                <Field name="contractData.client.documentDate" component={DateInput} className="form-control" readOnly={readOnly} />
                            </div>
                            <label htmlFor="contractData.client.documentProvider" className="col-sm-2">Кем выдан</label>
                            <div className="col-sm-4">
                                <Field name="contractData.client.documentProvider" component="input" type="text" className="form-control" readOnly={readOnly} />
                            </div>
                        </fieldset>
                        <fieldset className="form-group">
                            <label htmlFor="contractData.client.documentDateExpire" className="col-sm-2">Срок действия</label>
                            <div className="col-sm-4">
                                <Field name="contractData.client.documentDateExpire" component={DateInput} className="form-control" readOnly={readOnly} />
                            </div>
                            <label htmlFor="contractData.client.birthPlace" className="col-sm-2">Место рождения</label>
                            <div className="col-sm-4">
                                <Field name="contractData.client.birthPlace" component="input" type="text" className="form-control" readOnly={readOnly} />
                            </div>
                        </fieldset>
                    </div>
                </div>

                <fieldset className="form-group">
                    <label htmlFor="note" className="col-sm-12">Примечание</label>
                    <div className="col-sm-12">
                        <Field name="note" component="textarea" rows="5" className="form-control" readOnly={readOnly} />
                    </div>
                </fieldset>
            </div>
        );
    }
}

export default reduxForm({
    form: 'ContractForm'
})(ContractForm);

export const selector = formValueSelector('ContractForm');