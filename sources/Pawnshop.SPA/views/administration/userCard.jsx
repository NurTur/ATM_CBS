import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import UserForm, { selector } from './userForm';

import { card as cardLoad, save as cardSave } from '../../actions/users';
import { groups as groupsLoad, roles as rolesLoad, organizations as organizationsLoad } from '../../actions/dictionaries';

import Restrict from '../controls/restrict';
import permissions from '../../engine/permissions';

class UserCard extends React.Component {
    constructor(props, context, queue) {
        super(props, context, queue);
    }
    static contextTypes = {
        router: PropTypes.object.isRequired
    };
    componentWillMount = () => {
        this.onLoad(this.props.params.id);
        if (!this.props.groups.length) {
            this.props.groupsLoad();
        }
        if (!this.props.roles.length) {
            this.props.rolesLoad();
        }
        if (!this.props.organizations.length) {
            this.props.organizationsLoad();
        }
    };

    onLoad = id => this.props.cardLoad(id);
    onSave = user =>
        this.props
            .cardSave(user)
            .then(action => this.context.router.push(`/users/${action.data.member.id}`));

    render = () => {
        if (!this.props.card) return <div></div>;
        return (
            <Restrict permissions={permissions.UserManage} pass>
                <UserForm onSubmit={this.onSave} initialValues={this.props.card} enableReinitialize
                          groups={this.props.groups} selectedGroups={this.props.selectedGroups}
                          roles={this.props.roles} selectedRoles={this.props.selectedRoles} 
                          organizations={this.props.organizations}/>
            </Restrict>);
    };
}

export default connect(state => {
    const { workspace, dictionary } = state;
    return {
        card: workspace.card,
        groups: dictionary.groups,
        roles: dictionary.roles,
        organizations: dictionary.organizations,
        selectedGroups: selector(state, 'groups'),
        selectedRoles: selector(state, 'roles')
    }
}, { cardLoad, cardSave, groupsLoad, rolesLoad, organizationsLoad })(UserCard);