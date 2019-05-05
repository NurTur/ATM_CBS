import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import RemittanceForm from './remittanceForm';
import { card as cardLoad, save as cardSave } from '../../actions/remittances';
import Restrict from '../controls/restrict';
import permissions from '../../engine/permissions';

class RemittanceCard extends React.Component {
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
    onSave = cashOrder =>
        this.props
            .cardSave(cashOrder)
            .then(action => {
                if (action && action.data) {
                    this.context.router.push(`/remittances/${action.data.id}`);
                }
            });

    render = () => {
        if (!this.props.card) return <div></div>;
        return (
            <Restrict permissions={permissions.CashOrderManage} pass>
                <RemittanceForm onSubmit={this.onSave} initialValues={this.props.card}
                                readOnly={this.props.card.id > 0 && (this.props.card.status > 10 || this.props.card.sendBranchId != this.props.auth.branchId)}
                                enableReinitialize />
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
}, { cardLoad, cardSave })(RemittanceCard);
