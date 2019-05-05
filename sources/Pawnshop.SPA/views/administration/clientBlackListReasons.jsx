import React, { PropTypes } from 'react';
import { Table, Column } from '../controls/table';
import { ButtonGroup, Button, Glyphicon, InputGroup } from 'react-bootstrap';
import { connect } from 'react-redux';
import { list as listLoad, card as cardLoad, save as cardSave} from '../../actions/clientBlackListReasons';
import Restrict from '../controls/restrict';
import permissions from '../../engine/permissions';
import { success as successNotification } from '../../actions/common';

class СlientBlackListReasons extends React.Component {
    constructor(props, context, queue) {
        super(props, context, queue);

        this.onLoad({});
    }

    static contextTypes = {
        router: PropTypes.object.isRequired
    };
    

    onLoad = query => this.props.listLoad(query);

    _confirmation = null;
    render = () => (
        <div>
            <Table data={this.props.list} query={this.props.query}
                    onLoad={this.onLoad} actions={this.renderActions()}>
                <Column name="name" title="Наименование" sort="asc" />
                <Column name="allowNewContracts" title="Позволяет создавать договора" type="bool" sort={false} />
                {permissions.ClientBlackListReasonManage &&
                <Column actions={true} template={
                    row =>
                        <ButtonGroup bsSize="xs">
                            <Button onClick={e => this.context.router.push(`/clientBlackListReasons/${row.id}`)}><Glyphicon glyph="edit"/> Изменить</Button>
                        </ButtonGroup>
                } />}
            </Table>
        </div>
    );

    renderActions = () =>
        <ButtonGroup bsSize="sm">
            <Restrict permissions={permissions.ClientBlackListReasonManage}>
                <Button onClick={e => this.context.router.push('/clientBlackListReasons/0')}><Glyphicon glyph="plus" /> Создать</Button>
            </Restrict>
        </ButtonGroup>
}

export default connect((state) => {
    const { list, query } = state.workspace;
    return { list, query }
}, { listLoad, cardLoad, cardSave, successNotification })(СlientBlackListReasons);