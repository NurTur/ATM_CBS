import React from 'react';
import { reduxForm, Field } from 'redux-form'

class PasswordForm extends React.Component {
    render = () => {
        return (
            <form onSubmit={this.props.handleSubmit} className="form-horizontal">
                <div className="panel-body">
                    <fieldset className="form-group">
                        <label htmlFor="oldPassword" className="col-sm-3">Текущий пароль</label>
                        <div className="col-sm-9">
                            <Field name="oldPassword" component="input" type="password" className="form-control" />
                        </div>
                    </fieldset>
                    <fieldset className="form-group">
                        <label htmlFor="newPassword" className="col-sm-3">Новый пароль</label>
                        <div className="col-sm-9">
                            <Field name="newPassword" component="input" type="password" className="form-control" />
                        </div>
                    </fieldset>
                    <fieldset className="form-group">
                        <label htmlFor="confirmPassword" className="col-sm-3">Повторите пароль</label>
                        <div className="col-sm-9">
                            <Field name="confirmPassword" component="input" type="password" className="form-control" />
                        </div>
                    </fieldset>
                </div>
                <div className="panel-footer">
                    <button type="submit" className="btn btn-primary">Сохранить</button>
                </div>
            </form>
        );
    }
}

export default reduxForm({
    form: 'PasswordForm'
})(PasswordForm);