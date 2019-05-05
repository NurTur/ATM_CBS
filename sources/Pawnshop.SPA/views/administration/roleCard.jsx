import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import RoleForm, { selector } from './roleForm';

import { card as cardLoad, save as cardSave } from '../../actions/roles';
import { permissions as permissionsLoad } from '../../actions/dictionaries';

import Restrict from '../controls/restrict';
import permissions from '../../engine/permissions';

class RoleCard extends React.Component {
    constructor(props, context, queue) {
        super(props, context, queue);
    }

    static contextTypes = {
        router: PropTypes.object.isRequired
    };

    componentWillMount = () => {
        this.onLoad(this.props.params.id);
        if (!this.props.permissions.length) {
            this.props.permissionsLoad();
        }
    };

    onLoad = id => this.props.cardLoad(id);
    onSave = role =>
        this.props
            .cardSave(role)
            .then(action => {
                if (action && action.data) {
                    this.context.router.push(`/roles/${action.data.id}`);
                }
            });
    
    render = () => {
        if (!this.props.card) return <div></div>;
        return (
            <Restrict permissions={permissions.RoleManage} pass>
                <RoleForm onSubmit={this.onSave} initialValues={this.props.card} enableReinitialize
                          permissions={this.props.permissions} selectedPermissions={this.props.selectedPermissions} />
            </Restrict>);
    };
}

export default connect(state => {
    const { workspace, dictionary } = state;
    return {
        card: workspace.card,
        permissions: dictionary.permissions,
        selectedPermissions: selector(state, 'permissions.permissions'),
    }
}, { cardLoad, cardSave, permissionsLoad })(RoleCard);