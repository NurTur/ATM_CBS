import React from 'react';
import { reduxForm, Field, formValueSelector } from 'redux-form';
import { users as usersLoad } from '../../actions/dictionaries';
import DateInput from '../controls/form/dateInput';
import DictInput from '../controls/form/dictInput';

class AssetForm extends React.Component {
    static contextTypes = {
        store: React.PropTypes.object.isRequired
    };

    render = () => {
        return (
            <form onSubmit={this.props.handleSubmit} className="form-horizontal">
                <div className="panel-body">
                    <fieldset className="form-group">
                        <label htmlFor="name" className="col-sm-2">Наименование</label>
                        <div className="col-sm-10">
                            <Field name="name" component="input" type="text" className="form-control" />
                        </div>
                    </fieldset>
                    <fieldset className="form-group">
                        <label htmlFor="number" className="col-sm-2">№</label>
                        <div className="col-sm-4">
                            <Field name="number" component="input" type="text" className="form-control" />
                        </div>
                        <label htmlFor="managerId" className="col-sm-2">МОЛ</label>
                        <div className="col-sm-4">
                            <Field name="managerId" component={DictInput} className="form-control"
                                   dictionary="users" onLoad={usersLoad} display={(row, i) => row.fullname} />
                        </div>
                    </fieldset>
                    <fieldset className="form-group">
                        <label htmlFor="registerDate" className="col-sm-2">Дата приема</label>
                        <div className="col-sm-4">
                            <Field name="registerDate" component={DateInput} className="form-control" />
                        </div>
                        <label htmlFor="cost" className="col-sm-2">Сумма</label>
                        <div className="col-sm-4">
                            <Field name="cost" component="input" type="number" min="0" max="1000000000" className="form-control" />
                        </div>
                    </fieldset>
                    <fieldset className="form-group">
                        <label htmlFor="disposalDate" className="col-sm-2">Дата списания</label>
                        <div className="col-sm-4">
                            <Field name="disposalDate" component={DateInput} className="form-control" />
                        </div>
                    </fieldset>
                    <fieldset className="form-group">
                        <label htmlFor="note" className="col-sm-2">Примечание</label>
                    </fieldset>
                    <fieldset className="form-group">
                        <div className="col-sm-12">
                            <Field name="note" component="textarea" rows="5" className="form-control" />
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
    form: 'AssetForm'
})(AssetForm);

export const selector = formValueSelector('AssetForm');