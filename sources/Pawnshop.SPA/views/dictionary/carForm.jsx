import React from 'react';
import { reduxForm, submit, Field, formValueSelector } from 'redux-form';
import DictInput from '../controls/form/dictInput';
import DateInput from '../controls/form/dateInput';

import { marks, models, colors } from '../../actions/cars';

class CarForm extends React.Component {
    render = () => {
        let { readOnly } = this.props;
        return (
            <form onSubmit={this.props.handleSubmit} className="form-horizontal">
                <div className="panel-body">
                    <fieldset className="form-group" disabled={readOnly}>
                        <label htmlFor="mark" className="col-sm-2">Марка</label>
                        <div className="col-sm-4">
                            <Field name="mark" component={DictInput} className="form-control uppercase"
                                   dictionary="marks" onLoad={marks} dataList
                                   identity={(r, i) => i} display={r => r} />
                        </div>
                        <label htmlFor="model" className="col-sm-2">Модель</label>
                        <div className="col-sm-4">
                            <Field name="model" component={DictInput} className="form-control uppercase"
                                   dictionary="models" onLoad={models} dataList
                                   identity={(r, i) => i} display={r => r} />
                        </div>
                    </fieldset>
                    <fieldset className="form-group" disabled={readOnly}>
                        <label htmlFor="releaseYear" className="col-sm-2">Год выпуска</label>
                        <div className="col-sm-4">
                            <Field name="releaseYear" component="input" type="number" min="1950" max="2020" step="1" className="form-control" />
                        </div>
                        <label htmlFor="transportNumber" className="col-sm-2">Гос номер</label>
                        <div className="col-sm-4">
                            <Field name="transportNumber" component="input" type="text" className="form-control uppercase" />
                        </div>
                    </fieldset>
                    <fieldset className="form-group" disabled={readOnly}>
                        <label htmlFor="motorNumber" className="col-sm-2">Номер двигателя</label>
                        <div className="col-sm-4">
                            <Field name="motorNumber" component="input" type="text" className="form-control uppercase" />
                        </div>
                        <label htmlFor="bodyNumber" className="col-sm-2">Номер кузова</label>
                        <div className="col-sm-4">
                            <Field name="bodyNumber" component="input" type="text" className="form-control uppercase" />
                        </div>
                    </fieldset>
                    <fieldset className="form-group" disabled={readOnly}>
                        <label htmlFor="techPassportNumber" className="col-sm-2">Номер техпаспорта</label>
                        <div className="col-sm-4">
                            <Field name="techPassportNumber" component="input" type="text" className="form-control uppercase" />
                        </div>
                        <label htmlFor="techPassportDate" className="col-sm-2">Дата техпаспорта</label>
                        <div className="col-sm-4">
                            <Field name="techPassportDate" component={DateInput} className="form-control" />
                        </div>
                    </fieldset>
                    <fieldset>
                        <label htmlFor="color" className="col-sm-2">Цвет</label>
                        <div className="col-sm-4">
                            <Field name="color" component={DictInput} className="form-control uppercase"
                                   dictionary="colors" onLoad={colors} dataList
                                   identity={(r, i) => i} display={r => r} />
                        </div>
                    </fieldset>
                </div>
            </form>
        );
    }
}

export default reduxForm({
    form: 'CarForm'
})(CarForm);

export const selector = formValueSelector('CarForm');
export const submitForm = dispatch => dispatch(submit('CarForm'));