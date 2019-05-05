import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import СlientBlackListReasonForm from './clientBlackListReasonForm';

import { card as cardLoad, save as cardSave} from '../../actions/clientBlackListReasons';
import { clientBlackListReasons as reasonsLoad } from '../../actions/dictionaries';

import Restrict from '../controls/restrict';
import permissions from '../../engine/permissions';

class ClientBlackListReasonCard extends React.Component {
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
    onSave = clientBlackListReasonCard =>
        this.props
            .cardSave(clientBlackListReasonCard)
            .then(action => this.context.router.push(`/clientBlackListReasons/${action.data.id}`));

    render = () => {
        return (
            <Restrict permissions={permissions.ClientBlackListReasonManage} pass>
                <СlientBlackListReasonForm onSubmit={this.onSave} initialValues={this.props.card} enableReinitialize
                           initialValues={this.props.card} />
            </Restrict>);
    };
}

export default connect(state => {
    const { workspace, dictionary } = state;
    return {
        card: workspace.card,
        clientBlackListReasons: dictionary.clientBlackListReasons
    }
}, { cardLoad, cardSave, reasonsLoad })(ClientBlackListReasonCard);