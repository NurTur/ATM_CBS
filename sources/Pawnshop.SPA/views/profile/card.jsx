import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Form from './form';

import { updateProfile } from '../../actions/security';

class Card extends React.Component {
    constructor(props, context, queue) {
        super(props, context, queue);
    }
    static contextTypes = {
        router: PropTypes.object.isRequired
    };

    onSave = profile => this.props
        .updateProfile(profile)
        .then(() => this.context.router.push('/'));

    render() {
        if (!this.props.profile) return <div></div>;
        return (
            <div className="panel panel-default">
                <div className="panel-heading">
                    <h4 className="panel-title">Профиль</h4>
                </div>
                <Form onSubmit={this.onSave} initialValues={this.props.profile.user} enableReinitialize />
            </div>
        );
    }
}

export default connect(state => {
    const { auth } = state;
    return {
        profile: auth.profile
    }
}, { updateProfile })(Card);

