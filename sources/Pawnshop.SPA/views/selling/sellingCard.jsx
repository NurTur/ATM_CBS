import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import SellingForm, { selector } from './sellingForm';
import { card as cardLoad, sell as cardSell } from '../../actions/sellings';
import CashInOrderPrint from '../cashOrder/cashInOrderPrint';
import { print } from '../../actions/common';

import Restrict from '../controls/restrict';
import permissions from '../../engine/permissions';

class SellingCard extends React.Component {
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
    onSell = selling => {
        this.props
            .cardSell(selling)
            .then(action => {
                if (action && action.data) {
                    this.props.print(<CashInOrderPrint data={action.data.cashOrder} auth={this.props.auth} />);
                    this.context.router.push(`/sellings`);
                }
            });
    }

    render = () => {
        if (!this.props.card) return <div></div>;
        return (
            <Restrict permissions={permissions.SellingManage} pass>
                <SellingForm onSubmit={this.onSell} initialValues={this.props.card} enableReinitialize />
            </Restrict>
        );
    };
}

export default connect(state => {
    const { workspace, auth } = state;
    return {
        card: workspace.card,
        auth: auth
    }
}, { cardLoad, cardSell, print })(SellingCard);