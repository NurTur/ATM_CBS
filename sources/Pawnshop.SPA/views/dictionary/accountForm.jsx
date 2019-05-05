import React from 'react';
import { reduxForm, Field, formValueSelector } from 'redux-form';

class AccountForm extends React.Component {
    render = () => {
        let { readOnly } = this.props;
        return (
            <form onSubmit={this.props.handleSubmit} className="form-horizontal">
                <div className="panel-body">
                    <fieldset className="form-group" disabled={readOnly}>
                        <label htmlFor="code" className="col-sm-2">Счет</label>
                        <div className="col-sm-10">
                            <Field name="code" component="input" type="text" className="form-control" />
                        </div>
                    </fieldset>
                    <fieldset className="form-group" disabled={readOnly}>
                        <label htmlFor="name" className="col-sm-2">Наименование</label>
                        <div className="col-sm-10">
                            <Field name="name" component="input" type="text" className="form-control" />
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
    form: 'AccountForm'
})(AccountForm);

export const selector = formValueSelector('AccountForm');