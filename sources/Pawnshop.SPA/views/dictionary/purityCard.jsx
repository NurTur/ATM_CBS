import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import PurityForm, { selector } from './purityForm';
import { card as cardLoad, save as cardSave } from '../../actions/purities';

import Restrict from '../controls/restrict';
import permissions from '../../engine/permissions';

class PurityCard extends React.Component {
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
    onSave = purity =>
        this.props
            .cardSave(purity)
            .then(action => {
                if (action && action.data) {
                    this.context.router.push(`/purities/${action.data.id}`);
                }
            });

    render = () => {
        if (!this.props.card) return <div></div>;
        return (
            <Restrict permissions={permissions.PurityManage} pass>
                <PurityForm onSubmit={this.onSave} initialValues={this.props.card} enableReinitialize />
            </Restrict>
        );
    };
}

export default connect(state => {
    const { workspace } = state;
    return {
        card: workspace.card,
    }
}, { cardLoad, cardSave })(PurityCard);