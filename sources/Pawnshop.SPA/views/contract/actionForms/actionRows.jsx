import React from 'react';
import { Field } from 'redux-form';
import classnames from 'classnames';
import { accounts as accountsLoad } from '../../../actions/dictionaries';
import DictInput from '../../controls/form/dictInput';

const ActionRows = ({ fields, onChangePercent, readOnlyPercent }) => (
    <div>
        {fields.map((row, i) => {
            let paymentType = fields.get(i).paymentType;
            let paymentTypeLabel = "";
            switch (paymentType) {
                case 10:
                    paymentTypeLabel = "Долг";
                    break;
                case 20:
                    paymentTypeLabel = "Пошлина";
                    break;
                case 30:
                    paymentTypeLabel = "Штраф";
                    break;
                default:
                    paymentTypeLabel = "Не установлено";
                    break;
            }

            return (
                <div key={i} className={classnames({
                    "col-sm-4": fields.length === 3,
                    "col-sm-6": fields.length === 2,
                    "col-sm-12": fields.length === 1
                })}>
                    <div className="thumbnail">
                        <fieldset className="form-group form-group-sm">
                            <h6 className="col-sm-12"><strong>{paymentTypeLabel}</strong></h6>
                        </fieldset>
                        <fieldset className="form-group form-group-sm">
                            <label htmlFor={`${row}.period`} className="col-sm-4">Дней</label>
                            <div className="col-sm-8">
                                <Field name={`${row}.period`} component="input" type="number" className="form-control" readOnly disabled={paymentType == 10} />
                            </div>
                        </fieldset>
                        <fieldset className="form-group form-group-sm">
                            <label htmlFor={`${row}.percent`} className="col-sm-4">Процент</label>
                            <div className="col-sm-8">
                                <Field name={`${row}.percent`} component="input" type="number" className="form-control" disabled />
                            </div>
                        </fieldset>
                        <fieldset className="form-group form-group-sm">
                            <label htmlFor={`${row}.cost`} className="col-sm-4">Сумма</label>
                            <div className="col-sm-8">
                                <Field name={`${row}.cost`} component="input" type="number" className="form-control"
                                       readOnly={readOnlyPercent} disabled={paymentType == 10} onChange={onChangePercent} />
                            </div>
                        </fieldset>
                        <fieldset className="form-group form-group-sm">
                            <label htmlFor={`${row}.debitAccountId`} className="col-sm-4">Дебет</label>
                            <div className="col-sm-8">
                                <Field name={`${row}.debitAccountId`} component={DictInput} className="form-control"
                                        dictionary="accounts" onLoad={accountsLoad} display={(row, i) => row.code + ' ' + row.name} disabled={readOnlyPercent} />
                            </div>
                        </fieldset>
                        <fieldset className="form-group form-group-sm">
                            <label htmlFor={`${row}.creditAccountId`} className="col-sm-4">Кредит</label>
                            <div className="col-sm-8">
                                <Field name={`${row}.creditAccountId`} component={DictInput} className="form-control"
                                        dictionary="accounts" onLoad={accountsLoad} display={(row, i) => row.code + ' ' + row.name} disabled />
                            </div>
                        </fieldset>
                    </div>
                </div>
        )})}
    </div>
);

export default ActionRows;