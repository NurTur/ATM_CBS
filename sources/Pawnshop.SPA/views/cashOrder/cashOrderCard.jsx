import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import CashOrderForm, { selector } from './cashOrderForm';

import { card as cardLoad, copy as cardCopy, save as cardSave } from '../../actions/cashOrders';

import Restrict from '../controls/restrict';
import permissions from '../../engine/permissions';

class CashOrderCard extends React.Component {
    constructor(props, context, queue) {
        super(props, context, queue);
    }

    static contextTypes = {
        router: PropTypes.object.isRequired
    };

    componentWillMount = () => {
        if (this.props.params.isCopy) {
            this.onCopy(this.props.params.id);
        } else {
            this.onLoad(this.props.params.id);
        }
    };

    onLoad = id => { 
        if (id == 0) {
            let card = this.props.cardLoad(id);
            card.data.debitAccountId = this.props.configuration.cashOrderSettings.cashAccountId;
            card.data.userId = this.props.auth.profile.user.id;
        } else {
            this.props.cardLoad(id);
        }
    };
    onCopy = id => this.props.cardCopy(id);
    onSave = cashOrder => 
        this.props
            .cardSave(cashOrder)
            .then(action => {
                if (action && action.data) {
                    this.context.router.push(`/cashOrders/${action.data.id}`);
                }
            });

    render = () => {
        if (!this.props.card) return <div></div>;
        return (
            <Restrict permissions={permissions.CashOrderManage} pass>
                <CashOrderForm onSubmit={this.onSave} initialValues={this.props.card}
                               readOnly={!this.props.card.createdToday && !this.props.auth.profile.user.forSupport}
                               clientId={this.props.card.clientId} options={this.props.configuration} enableReinitialize />
            </Restrict>
        );
    };
}

export default connect(state => {
    const { workspace, auth } = state;

    return {
        card: workspace.card,
        configuration: auth.configuration,
        auth: auth
    }
}, { cardLoad, cardCopy, cardSave })(CashOrderCard);