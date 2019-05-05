import React from 'react';
import { reduxForm, Field, formValueSelector } from 'redux-form';

class CategoryForm extends React.Component {
    render = () => {
        let { readOnly } = this.props;
        return (
            <form onSubmit={this.props.handleSubmit} className="form-horizontal">
                <div className="panel-body">
                    <fieldset className="form-group" disabled={readOnly}>
                        <label htmlFor="name" className="col-sm-3">Наименование</label>
                        <div className="col-sm-9">
                            <Field name="name" component="input" type="text" className="form-control" />
                        </div>
                    </fieldset>
                    <fieldset className="form-group" disabled={readOnly}>
                        <label htmlFor="collateralType" className="col-sm-3">Вид залога</label>
                        <div className="col-sm-9">
                            <Field name="collateralType" component="select" className="form-control">
                                <option value="10">Золото</option>
                                <option value="20">Автотранспорт</option>
                                <option value="30">Товар</option>
                                <option value="40">Спецтехника</option>
                            </Field>
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
    form: 'CategoryForm'
})(CategoryForm);

export const selector = formValueSelector('CategoryForm');