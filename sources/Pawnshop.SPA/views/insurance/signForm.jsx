import React from 'react';
import { reduxForm, formValueSelector, Field } from 'redux-form';

class SignForm extends React.Component {
    static contextTypes = {
        store: React.PropTypes.object.isRequired
    };

    render() {
        return (
            <form onSubmit={this.props.handleSubmit}>
                <fieldset className="form-group">
                    <label htmlFor="insuranceCost" className="col-sm-4">Сумма страховки</label>
                    <div className="col-sm-8">
                        <Field name="insuranceCost" component="input" type="number" className="form-control" />
                    </div>
                </fieldset>
            </form>
        );
    }
}

export default SignForm = reduxForm({
    form: 'SignForm'
})(SignForm);

const selector = formValueSelector('SignForm');