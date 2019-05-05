import React, { PropTypes } from 'react';
import { Table, Column } from '../controls/table';
import { ButtonGroup, Button, Glyphicon, InputGroup } from 'react-bootstrap';
import { connect } from 'react-redux';
import { list as listLoad, remove as removeItem, receive as receiveItem, receiveCancel } from '../../actions/remittances';
import Confirmation from '../controls/confirmation';
import Restrict from '../controls/restrict';
import permissions from '../../engine/permissions';
import { profile } from '../../actions/security';
import DateInput from '../controls/form/dateInput';

class Remittances extends React.Component {
    constructor(props, context, queue) {
        super(props, context, queue);
        this.onLoad({});
    }

    static contextTypes = {
        router: PropTypes.object.isRequired,
        store: React.PropTypes.object.isRequired
    };

    filter = {
        incoming: false,
        beginDate: null,
        endDate: null,
        status: null
    };

    componentDidMount(){
        if (this.props.auth.isAuthenticated) {
            this.props.profile();
        }
    }

    onLoad = query => {
        if (!query) {
            query = this.props.query || {};
        }

        if (query.clean) {
            this.filter = {
                incoming: false,
                beginDate: null,
                endDate: null,
                status: null
            };
            query.clean = undefined;
        }

        query.model = {
            incoming: this.filter.incoming || false,
            beginDate: this.filter.beginDate || null,
            endDate: this.filter.endDate || null,
            status: this.filter.status || null
        };
        this.props.listLoad(query);
    };

    _confirmation = null;
    render = () => (
        <div>
            <Table data={this.props.list} query={this.props.query} onLoad={this.onLoad} actions={this.renderActions()} filters={this.renderFilters()}>
                <Column name="sendBranch.displayName" title="Отправитель" sort={true} template={
                    row => row.sendBranch.displayName
                } />
                <Column name="sendDate" title="Дата" sort="desc" type="date" />
                <Column name="sendCost" title="Сумма" sort={true} type="number" />
                <Column name="receiveBranch.displayName" title="Получатель" sort={true} template={
                    row => row.receiveBranch.displayName
                } />
                <Column name="status" title="Статус" sort={true} template={
                    row =>
                        row.status == 10 && <span>Отправлено</span> ||
                        row.status == 20 && <span>Получено</span>
                } />
                <Column actions={true} template={
                    row =>
                        <ButtonGroup bsSize="xs">
                            {row.sendBranchId == this.props.auth.branchId &&
                            <Restrict permissions={permissions.CashOrderManage}>
                                <Button onClick={e => this.context.router.push(`/remittances/${row.id}`)}><Glyphicon glyph="edit"/></Button>
                            </Restrict>}
                            {row.sendBranchId == this.props.auth.branchId &&
                            <Restrict permissions={permissions.CashOrderManage}>
                                <Button onClick={e => {
                                    this._confirmation.show("Вы действительно хотите удалить запись?",
                                        () => this.props.removeItem(row.id).then(action => this.onLoad(this.props.query))
                                    );
                                }} disabled={row.status > 10}><Glyphicon glyph="remove"/></Button>
                            </Restrict>}
                            {row.receiveBranchId == this.props.auth.branchId &&
                            <Restrict permissions={permissions.CashOrderManage}>
                                <Button onClick={e => {
                                    this._confirmation.show("Вы действительно хотите принять деньги?",
                                        () => this.props.receiveItem(row.id).then(action => this.onLoad(this.props.query))
                                    );
                                }} disabled={row.status > 10}><Glyphicon glyph="ok"/></Button>
                            </Restrict>}
                            {row.receiveBranchId == this.props.auth.branchId &&
                            <Restrict permissions={permissions.CashOrderManage}>
                                <Button onClick={e => {
                                    this._confirmation.show("Вы действительно хотите отменить принятие денег?",
                                        () => this.props.receiveCancel(row.id).then(action => this.onLoad(this.props.query))
                                    );
                                }} disabled={row.status != 20 || !row.createdToday || row.contractId!=null}><Glyphicon glyph="ban-circle"/></Button>
                            </Restrict>}
                        </ButtonGroup>
                } />
            </Table>

            <Confirmation ref={r => this._confirmation = r} />
        </div>
    );

    renderActions = () =>
        <ButtonGroup bsSize="sm">
            <Restrict permissions={permissions.CashOrderManage}>
                <Button onClick={e => this.context.router.push('/remittances/0')}><Glyphicon glyph="plus"/> Создать</Button>
            </Restrict>
        </ButtonGroup>;

    renderFilters = () => [
        <div className="row">
            <div className="col-sm-3">
                <InputGroup bsSize="sm" style={{width:'100%', paddingLeft:5}}>
                    <span className="input-group-addon">
                        <input type="checkbox" onChange={e => {
                            this.filter.incoming = e.target.checked;
                            this.onLoad();
                        }} checked={this.filter.incoming} />
                    </span>
                    <input type="text" className="form-control" value="входящие" disabled />
                </InputGroup>
            </div>
            <div className="col-sm-3">
                <DateInput className="form-control input-sm" placeholder="Дата с..." onChange={e => {
                    this.filter.beginDate = e;
                    this.onLoad();
                }} value={this.filter.beginDate} />
            </div>
            <div className="col-sm-3">
                <DateInput className="form-control input-sm" placeholder="Дата по..." onChange={e => {
                    this.filter.endDate = e;
                    this.onLoad();
                }} value={this.filter.endDate} />
            </div>
            <div className="col-sm-3">
                <InputGroup bsSize="sm" style={{width:'100%'}}>
                    <select className="form-control" onChange={e => {
                        this.filter.status = e.target.value;
                        this.onLoad();
                    }}>
                        <option selected={!this.filter.status} value="">Статус</option>
                        <option selected={this.filter.status == 10} value="10">Отправлено</option>
                        <option selected={this.filter.status == 20} value="20">Получено</option>
                    </select>
                </InputGroup>
            </div>
        </div>
    ];
}

export default connect((state) => {
    const { workspace, auth } = state;

    return {
        list: workspace.list,
        query: workspace.query,
        auth: auth
    }
}, { listLoad, removeItem, receiveItem, receiveCancel, profile })(Remittances);