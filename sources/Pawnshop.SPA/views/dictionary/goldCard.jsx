import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import PositionForm, { submitForm } from './positionForm';

import Restrict from '../controls/restrict';
import permissions from '../../engine/permissions';

import { card as cardLoad, save as cardSave } from '../../actions/golds';

class GoldCard extends React.Component {
    constructor(props, context, queue) {
        super(props, context, queue);
    }

    static contextTypes = {
        router: PropTypes.object.isRequired,
        store: PropTypes.object.isRequired
    };

    componentWillMount = () => {
        this.onLoad(this.props.params.id);
    };

    onLoad = id => this.props.cardLoad(id);
    onSave = position =>
        this.props
            .cardSave(position)
            .then(action => {
                if (action && action.data) {
                    this.context.router.push(`/golds/${action.data.id}`);
                }
            });

    render = () => {
        if (!this.props.card) return <div></div>;
        const { dispatch } = this.context.store;

        return (
            <div>
                <Restrict permissions={permissions.GoldManage} pass>
                    <PositionForm onSubmit={this.onSave} initialValues={this.props.card}
                                  enableReinitialize className="panel-body" />
                </Restrict>
                <div className="panel-footer">
                    <div className="btn-group btn-group-sm">
                        <button type="button" className="btn btn-warning" onClick={() => history.back()}>Назад</button>
                        <Restrict permissions={permissions.GoldManage}>
                            <button type="button" className="btn btn-primary" onClick={() => dispatch(submitForm)}>Сохранить</button>
                        </Restrict>
                    </div>
                </div>
            </div>
        );
    };
}

export default connect(state => {
    const { workspace } = state;
    return {
        card: workspace.card,
    }
}, { cardLoad, cardSave })(GoldCard);