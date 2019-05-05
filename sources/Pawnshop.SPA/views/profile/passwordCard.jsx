import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { SubmissionError } from 'redux-form'
import Form from './passwordForm';

import { updatePassword, signOut } from '../../actions/security';
import { warning as notify } from '../../actions/common';

class Card extends React.Component {
    constructor(props, context, queue) {
        super(props, context, queue);
    }
    static contextTypes = {
        router: PropTypes.object.isRequired
    };

    onSave = data => {
        if (!data.oldPassword || !data.newPassword || !data.confirmPassword) {
            this.props.notify("Заполните все обязательные поля.")
            throw new SubmissionError({});
        }
        if (data.newPassword !== data.confirmPassword) {
            this.props.notify("Повтор нового пароля введен неверно.");
            throw new SubmissionError({});
        }

        return this.props
            .updatePassword(data)
            .then(() => {
                this.context.router.push('/');
                this.props.signOut();
            }, () => {
                throw new SubmissionError({});
            })
    };

    render() {
        return (
            <div className="panel panel-default">
                <div className="panel-heading">
                    <h4 className="panel-title">Смена пароля</h4>
                </div>
                <Form onSubmit={this.onSave} />
            </div>
        );
    }
}

export default connect(() => { return {} },{ updatePassword, signOut, notify })(Card);

