import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import LoanPercentForm, { selector } from './loanPercentForm';
import { card as cardLoad, save as cardSave } from '../../actions/loanPercents';

import Restrict from '../controls/restrict';
import permissions from '../../engine/permissions';
import { profile } from '../../actions/security';

class LoanPercentCard extends React.Component {
    constructor(props, context, queue) {
        super(props, context, queue);
    }

    static contextTypes = {
        router: PropTypes.object.isRequired
    };

    componentWillMount = () => {
        this.onLoad(this.props.params.id);
    };

    onLoad = id => this.props.cardLoad(id);
    onSave = setting => {
        this.props
            .cardSave(setting)
            .then(action => {
                if (action && action.data) {
                    this.context.router.push(`/loanPercents/${action.data.id}`);
                }
            });
    };

    render = () => {
        if (!this.props.card) return <div></div>;
        return (
            <Restrict permissions={permissions.LoanPercentSettingManage} pass>
                <LoanPercentForm onSubmit={this.onSave} initialValues={this.props.card} auth={this.props.auth} enableReinitialize />
            </Restrict>);
    };
}

export default connect(state => {
    const { workspace, auth } = state;
    return {
        card: workspace.card,
        auth: auth,
    }
}, { cardLoad, cardSave, profile })(LoanPercentCard);