import React from 'react';
import { reduxForm, submit, Field, formValueSelector } from 'redux-form';

class PositionForm extends React.Component {
    render = () => {
        let { readOnly } = this.props;
        return (
            <form onSubmit={this.props.handleSubmit} className="form-horizontal">
                <div className={this.props.className}>
                    <fieldset className="form-group" disabled={readOnly}>
                        <label htmlFor="name" className="col-sm-3">Наименование</label>
                        <div className="col-sm-9">
                            <Field name="name" component="input" type="text" className="form-control" />
                        </div>
                    </fieldset>
                </div>
            </form>
        );
    }
}

export default reduxForm({
    form: 'PositionForm'
})(PositionForm);

export const selector = formValueSelector('PositionForm');
export const submitForm = dispatch => dispatch(submit('PositionForm'));