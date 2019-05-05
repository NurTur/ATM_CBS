import React from 'react';
import { Field } from 'redux-form';
import DateInput from '../controls/form/dateInput';
import PhoneInput from '../controls/form/phoneInput';
import Restrict from '../controls/restrict';
import permissions from '../../engine/permissions';

class ClientForm extends React.Component {
    render = () => {
        let { readOnly } = this.props;
        return (
            <div>
                <fieldset className="form-group" disabled={readOnly}>
                    <label htmlFor="cardType" className="col-sm-2">Тип карты</label>
                    <div className="col-sm-10">
                        <Restrict permissions={permissions.ClientCardTypeManage} pass passField="disabled">
                            <Field name="cardType" component="select" className="form-control">
                                <option value="10">Standard</option>
                                <option value="20">Bronze</option>
                                <option value="30">Silver</option>
                                <option value="40">Gold</option>
                                <option value="50">Platinum</option>
                            </Field>
                        </Restrict>
                    </div>
                    <label htmlFor="cardNumber" className="col-sm-1 hidden">№</label>
                    <div className="col-sm-5">
                        <Field name="cardNumber" component="input" type="text" className="form-control hidden" />
                    </div>
                </fieldset>
                <fieldset className="form-group" disabled={readOnly}>
                    <label htmlFor="identityNumber" className="col-sm-1">{this.props.identityNumberLabel}</label>
                    <div className="col-sm-3">
                        <Field name="identityNumber" component="input" type="text" className="form-control" />
                    </div>
                    <label htmlFor="fullname" className="col-sm-1">{this.props.fillnameLabel}</label>
                    <div className="col-sm-7">
                        <Field name="fullname" component="input" type="text" className="form-control" />
                    </div>
                </fieldset>        
                <fieldset className="form-group" disabled={readOnly}>
                    <label htmlFor="address" className="col-sm-2">Адрес фактический</label>
                    <div className="col-sm-10">
                        <Field name="address" component="input" type="text" className="form-control" />
                    </div>
                </fieldset>  
                <fieldset className="form-group" disabled={readOnly}>
                    <label htmlFor="registrationAddress" className="col-sm-2">Адрес регистрации</label>
                    <div className="col-sm-10">
                        <Field name="registrationAddress" component="input" type="text" className="form-control" />
                    </div>
                </fieldset>        
                <fieldset className="form-group" disabled={readOnly}>
                    <label htmlFor="mobilePhone" className="col-sm-2">Моб. телефон</label>
                    <div className="col-sm-4">
                        <Field name="mobilePhone" component={PhoneInput} className="form-control" />
                    </div>
                    <label htmlFor="staticPhone" className="col-sm-2">Городской телефон</label>
                    <div className="col-sm-4">
                        <Field name="staticPhone" component={PhoneInput} className="form-control" />
                    </div>
                </fieldset>
                <fieldset className="form-group" disabled={readOnly}>
                    <label htmlFor="email" className="col-sm-2">Email</label>
                    <div className="col-sm-4">
                        <Field name="email" component="input" type="email" className="form-control" />
                    </div>
                </fieldset>
                <div className="panel panel-default">
                    <div className="panel-heading">
                        <h3 className="panel-title">Данные документа</h3>
                    </div>
                    <div className="panel-body">
                        <fieldset className="form-group" disabled={readOnly}>
                            <label htmlFor="documentType" className="col-sm-2">Документ</label>
                            <div className="col-sm-4">
                                <Field name="documentType" component="select" className="form-control">
                                    <option value="10">Удостоверение личности</option>
                                    <option value="20">Паспорт</option>
                                    <option value="30">Свидетельство о гос регистрации</option>
                                </Field>
                            </div>
                            <label htmlFor="documentNumber" className="col-sm-2">Номер</label>
                            <div className="col-sm-4">
                                <Field name="documentNumber" component="input" type="text" className="form-control" />
                            </div>
                            <label htmlFor="documentSeries" className="col-sm-1 hidden">Серия</label>
                            <div className="col-sm-3 hidden">
                                <Field name="documentSeries" component="input" type="text" className="form-control" />
                            </div>
                        </fieldset>
                        <fieldset className="form-group" disabled={readOnly}>
                            <label htmlFor="documentDate" className="col-sm-2">Дата выдачи</label>
                            <div className="col-sm-4">
                                <Field name="documentDate" component={DateInput} className="form-control" />
                            </div>
                            <label htmlFor="documentProvider" className="col-sm-2">Кем выдан</label>
                            <div className="col-sm-4">
                                <Field name="documentProvider" component="input" type="text" className="form-control" />
                            </div>
                        </fieldset>
                        <fieldset className="form-group" disabled={readOnly}>
                            <label htmlFor="documentDateExpire" className="col-sm-2">Срок действия</label>
                            <div className="col-sm-4">
                                <Field name="documentDateExpire" component={DateInput} className="form-control" />
                            </div>
                            <label htmlFor="birthPlace" className="col-sm-2">Место рождения</label>
                            <div className="col-sm-4">
                                <Field name="birthPlace" component="input" type="text" className="form-control" />
                            </div>
                        </fieldset>
                    </div>
                </div>
                <fieldset className="form-group" disabled={readOnly}>
                    <label htmlFor="note" className="col-sm-2">Прочее</label>
                    <div className="col-sm-10">
                        <Field name="note" component="input" type="text" className="form-control" />
                    </div>
                </fieldset>        
            </div>
        );
    }
}

export default ClientForm;