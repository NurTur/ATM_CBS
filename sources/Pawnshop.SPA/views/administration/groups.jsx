import React, { PropTypes } from 'react';
import { Table, Column } from '../controls/table';
import { ButtonGroup, Button, Glyphicon } from 'react-bootstrap';
import { connect } from 'react-redux';
import { list as listLoad, card as cardLoad, save as cardSave } from '../../actions/groups';
import Restrict from '../controls/restrict';
import permissions from '../../engine/permissions';

class Groups extends React.Component {
    constructor(props, context, queue) {
        super(props, context, queue);

        this.onLoad({});
    }
    static contextTypes = {
        router: PropTypes.object.isRequired
    };

    onLoad = query => this.props.listLoad(query);

    onLock = row => {
        this.props.cardLoad(row.id)
            .then(action => {
                if (action && action.data) {
                    action.data.member.locked = !action.data.member.locked;
                    this.props.cardSave(action.data)
                        .then(action => this.onLoad({}));
                }
            });
    };

    render = () => (
        <Table data={this.props.list} query={this.props.query}
               onLoad={this.onLoad} actions={this.renderActions()}>
            <Column name="displayName" title="Наименование" sort="asc" />
            <Column name="name" title="Код" sort={true} />
            <Column name="locked" title="Блок." type="bool" sort={true} />
            <Column actions={true} template={
                row =>
                    <ButtonGroup bsSize="xs">
                        <Button onClick={e => this.context.router.push(`/groups/${row.id}`)}><Glyphicon glyph="edit"/> Профиль</Button>
                        <Restrict permissions={permissions.GroupManage}>
                            <Button onClick={e => this.onLock(row)} title="Заблокировать/разблокировать"><Glyphicon glyph="lock"/></Button>
                        </Restrict>
                    </ButtonGroup>
            } />
        </Table>
    );

    renderActions = () =>
        <ButtonGroup bsSize="sm">
            <Restrict permissions={permissions.GroupManage}>
                <Button onClick={e => this.context.router.push('/groups/0')}><Glyphicon glyph="plus"/> Создать</Button>
            </Restrict>
        </ButtonGroup>
}

export default connect((state) => {
    const { list, query } = state.workspace;
    return { list, query }
}, { listLoad, cardLoad, cardSave })(Groups);