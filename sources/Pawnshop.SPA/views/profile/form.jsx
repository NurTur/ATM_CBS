import React from 'react';
import { reduxForm, Field } from 'redux-form'

class UserForm extends React.Component {
    render = () => {
        return (
            <form onSubmit={this.props.handleSubmit} className="form-horizontal">
                <div className="panel-body">
                    <fieldset className="form-group">
                        <label htmlFor="login" className="col-sm-3">Имя пользователя</label>
                        <div className="col-sm-9">
                            <Field name="login" component="input" type="text" className="form-control" />
                        </div>
                    </fieldset>
                    <fieldset className="form-group" disabled>
                        <label htmlFor="identityNumber" className="col-sm-3">ИИН</label>
                        <div className="col-sm-9">
                            <Field name="identityNumber" component="input" type="text" className="form-control" />
                        </div>
                    </fieldset>
                    <fieldset className="form-group">
                        <label htmlFor="fullname" className="col-sm-3">Полное имя</label>
                        <div className="col-sm-9">
                            <Field name="fullname" component="input" type="text" className="form-control" />
                        </div>
                    </fieldset>
                    <fieldset className="form-group">
                        <label htmlFor="email" className="col-sm-3">Электронная почта</label>
                        <div className="col-sm-9">
                            <Field name="email" component="input" type="email" className="form-control" />
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
    form: 'ProfileForm'
})(UserForm);