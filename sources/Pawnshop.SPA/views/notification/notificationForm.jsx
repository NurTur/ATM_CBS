import React from 'react';
import { reduxForm, Field, FieldArray, formValueSelector } from 'redux-form';
import { Tabs, Tab } from 'react-bootstrap';
import NotificationReceivers from './notificationReceivers';

class NotificationForm extends React.Component {
    render = () => {
        let { readOnly } = this.props;
        return (
            <form onSubmit={this.props.handleSubmit} className="form-horizontal">
                <div className="panel-heading">
                </div>
                <Tabs defaultActiveKey="notification" id="notificationCardTabs">
                    <Tab eventKey="notification" title="Уведомление">
                        <div className="panel-body">
                            <fieldset className="form-group" disabled={readOnly}>
                                <label htmlFor="messageType" className="col-sm-2">Тип сообщения</label>
                                <div className="col-sm-10">
                                    <Field name="messageType" component="select" className="form-control">
                                        <option value="10">Email</option>
                                        <option value="20">Sms</option>
                                    </Field>
                                </div>
                            </fieldset>
                            <fieldset className="form-group" disabled={readOnly}>
                                <label htmlFor="subject" className="col-sm-2">Тема</label>
                                <div className="col-sm-10">
                                    <Field name="subject" component="input" type="text" className="form-control" />
                                </div>
                            </fieldset>
                            <fieldset className="form-group" disabled={readOnly}>
                                <label htmlFor="message" className="col-sm-12">Сообщение</label>
                            </fieldset>
                            <fieldset className="form-group" disabled={readOnly}>
                                <div className="col-sm-12">
                                    <Field name="message" component="textarea" className="form-control" style={{resize:'none'}} rows="8" />
                                </div>
                            </fieldset>
                        </div>
                    </Tab>
                    <Tab eventKey="notificationReceivers" title="Получатели">
                        <NotificationReceivers notificationId={this.props.id} readOnly={readOnly} onLogs={this.props.onLogs} />
                    </Tab>
                </Tabs>
                <div className="panel-footer">
                    <button type="button" className="btn btn-warning" onClick={() => history.back()}>Назад</button>
                    {readOnly || <button type="submit" className="btn btn-primary">Сохранить</button>}
                    {readOnly || this.props.id > 0 && <button type="button" className="btn btn-success" onClick={this.props.onSelect}>Подобрать</button>}
                </div>
            </form>
        )
    }
}

export default reduxForm({
    form: 'NotificationForm'
})(NotificationForm);

export const selector = formValueSelector('NotificationForm');