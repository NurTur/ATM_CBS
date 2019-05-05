import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import GroupForm, { selector } from './groupForm';

import { card as cardLoad, save as cardSave } from '../../actions/groups';
import { groups as groupsLoad, roles as rolesLoad } from '../../actions/dictionaries';

import Restrict from '../controls/restrict';
import permissions from '../../engine/permissions';

class GroupCard extends React.Component {
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
    };

    onLoad = id => this.props.cardLoad(id);
    onSave = group =>
        this.props
            .cardSave(group)
            .then(action => this.context.router.push(`/groups/${action.data.member.id}`));

    render = () => {
        if (!this.props.card) return <div></div>;
        return (
            <Restrict permissions={permissions.GroupManage} pass>
                <GroupForm onSubmit={this.onSave} initialValues={this.props.card} enableReinitialize
                           groups={this.props.groups} selectedGroups={this.props.selectedGroups}
                           roles={this.props.roles} selectedRoles={this.props.selectedRoles} />
            </Restrict>);
    };
}

export default connect(state => {
    const { workspace, dictionary } = state;
    return {
        card: workspace.card,
        groups: dictionary.groups,
        roles: dictionary.roles,
        selectedGroups: selector(state, 'groups'),
        selectedRoles: selector(state, 'roles')
    }
}, { cardLoad, cardSave, groupsLoad, rolesLoad })(GroupCard);