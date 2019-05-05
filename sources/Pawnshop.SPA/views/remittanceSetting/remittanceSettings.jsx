import React, { PropTypes } from 'react';
import { Table, Column } from '../controls/table';
import { ButtonGroup, Button, Glyphicon } from 'react-bootstrap';
import { connect } from 'react-redux';
import { list as listLoad, remove as removeItem } from '../../actions/remittanceSettings';
import Confirmation from '../controls/confirmation';
import Restrict from '../controls/restrict';
import permissions from '../../engine/permissions';

class RemittanceSettings extends React.Component {
    constructor(props, context, queue) {
        super(props, context, queue);
        this.onLoad({});
    }

    static contextTypes = {
        router: PropTypes.object.isRequired,
    };

    onLoad = query => this.props.listLoad(query);

    _confirmation = null;
    render = () => (
        <div>
            <Table data={this.props.list} query={this.props.query}
                   onLoad={this.onLoad} actions={this.renderActions()}>
                <Column name="sendBranch.displayName" title="Отправитель" sort={true} template={
                    row => row.sendBranch.displayName
                } />
                <Column name="receiveBranch.displayName" title="Получатель" sort={true} template={
                    row => row.receiveBranch.displayName
                } />
                <Column name="cashOutDebit.code" title="РКО Дебет" sort={true} template={
                    row => row.cashOutDebit.code
                } />
                <Column name="cashOutCredit.code" title="РКО Кредит" sort={true} template={
                    row => row.cashOutCredit.code
                } />
                <Column name="cashInDebit.code" title="ПКО Дебет" sort={true} template={
                    row => row.cashInDebit.code
                } />
                <Column name="cashInCredit.code" title="ПКО Кредит" sort={true} template={
                    row => row.cashInCredit.code
                } />
                <Column actions={true} template={
                    row =>
                        <ButtonGroup bsSize="xs">
                            <Restrict permissions={permissions.BranchConfigurationManage}>
                                <Button onClick={e => this.context.router.push(`/remittanceSettings/${row.id}`)}><Glyphicon glyph="edit"/></Button>
                            </Restrict>
                            <Restrict permissions={permissions.BranchConfigurationManage}>
                                <Button onClick={e => {
                                    this._confirmation.show("Вы действительно хотите удалить запись?",
                                        () => this.props.removeItem(row.id).then(action => this.onLoad(this.props.query))
                                    );
                                }}><Glyphicon glyph="remove"/></Button>
                            </Restrict>
                        </ButtonGroup>
                } />
            </Table>

            <Confirmation ref={r => this._confirmation = r} />
        </div>
    );

    renderActions = () =>
        <ButtonGroup bsSize="sm">
            <Restrict permissions={permissions.BranchConfigurationManage}>
                <Button onClick={e => this.context.router.push('/remittanceSettings/0')}><Glyphicon glyph="plus"/> Создать</Button>
            </Restrict>
        </ButtonGroup>;
}

export default connect((state) => {
    const { workspace } = state;

    return {
        list: workspace.list,
        query: workspace.query
    }
}, { listLoad, removeItem })(RemittanceSettings);