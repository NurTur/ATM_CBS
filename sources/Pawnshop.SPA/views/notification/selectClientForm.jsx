import React from 'react';
import { reduxForm, formValueSelector, Field } from 'redux-form';

class SelectClientForm extends React.Component {
    static contextTypes = {
        store: React.PropTypes.object.isRequired
    };

    render() {
        return (
            <form onSubmit={this.props.handleSubmit}>
                <fieldset className="form-group">
                    <label htmlFor="collateralType" className="col-sm-4">Вид залога</label>
                    <div className="col-sm-8">
                        <Field name="collateralType" component="select" className="form-control">
                            <option value="">Все</option>
                            <option value="10">Золото</option>
                            <option value="20">Автотранспорт</option>
                            <option value="30">Товар</option>
                            <option value="40">Спецтехника</option>
                        </Field>
                    </div>
                </fieldset>
                <fieldset className="form-group">
                    <label htmlFor="cardType" className="col-sm-4">Тип карты</label>
                    <div className="col-sm-8">
                        <Field name="cardType" component="select" className="form-control">
                            <option value="">Все</option>
                            <option value="10">Standard</option>
                            <option value="20">Bronze</option>
                            <option value="30">Silver</option>
                            <option value="40">Gold</option>
                            <option value="50">Platinum</option>
                        </Field>
                    </div>
                </fieldset>
            </form>
        );
    }
}

export default SelectClientForm = reduxForm({
    form: 'SelectClientForm'
})(SelectClientForm);

const selector = formValueSelector('SelectClientForm');