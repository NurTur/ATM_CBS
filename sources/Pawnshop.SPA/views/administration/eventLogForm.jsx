import React from 'react';
import { reduxForm } from "redux-form";

class EventLogForm extends React.Component {
    render() {
        return (
            <form onSubmit={this.props.handleSubmit}>
                <div className="row">
                    <label className="col-sm-12">Данные запроса</label>
                </div>
                <div className="row form-group">
                    <div className="col-sm-12">
                        <textarea rows="7" style={{width:'100%',resize:'none'}} readOnly={true}>{this.props.initialValues && this.props.initialValues.requestData || null}</textarea>
                    </div>
                </div>
                <div className="row">
                    <label className="col-sm-12">Данные ответа</label>
                </div>
                <div className="row form-group">
                    <div className="col-sm-12">
                        <textarea rows="7" style={{width:'100%',resize:'none'}} readOnly={true}>{this.props.initialValues && this.props.initialValues.responseData || null}</textarea>
                    </div>
                </div>
            </form>
        );
    };
}

export default EventLogForm = reduxForm({
    form: 'EventLogForm'
})(EventLogForm);