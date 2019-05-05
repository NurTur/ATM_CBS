import React from 'react';
import { reduxForm, Field, formValueSelector } from 'redux-form';

class ContractNoteForm extends React.Component {
    static contextTypes = {
        store: React.PropTypes.object.isRequired
    };

    render = () => {
        return (
            <form onSubmit={this.props.handleSubmit} className="form-horizontal">
                <div className="panel-body">
                    <fieldset className="form-group">
                        <Field name="note" component="textarea" className="form-control"
                               readOnly={this.props.readOnly} style={{resize:'none'}} rows="4" />
                    </fieldset>
                </div>
            </form>
        );
    }
}

export default reduxForm({
    form: 'ContractNoteForm'
})(ContractNoteForm);

export const selector = formValueSelector('ContractNoteForm');