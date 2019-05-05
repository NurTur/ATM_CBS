import React from 'react';
import { reduxForm } from "redux-form";
import moment from 'moment';

class NotificationLogs extends React.Component {
    render() {
        let logs = this.props.initialValues;

        return (
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>Дата</th>
                        <th>Сообщение</th>
                    </tr>
                </thead>
                <tbody>
                    {logs && logs.map((item, i) => {
                        return (
                            <tr key={i}>
                                <td>{moment(item.createDate).format('L')}</td>
                                <td>{item.statusMessage}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        );
    }
}

export default NotificationLogs = reduxForm({
    form: 'NotificationLogs'
})(NotificationLogs);