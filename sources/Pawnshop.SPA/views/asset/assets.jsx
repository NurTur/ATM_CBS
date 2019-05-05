import React, { PropTypes } from 'react';
import { Table, Column } from '../controls/table';
import { ButtonGroup, Button, Glyphicon, InputGroup } from 'react-bootstrap';
import { connect } from 'react-redux';
import { list as listLoad, remove as removeItem } from '../../actions/assets';
import Confirmation from '../controls/confirmation';
import Restrict from '../controls/restrict';
import permissions from '../../engine/permissions';

class Assets extends React.Component {
    constructor(props, context, queue) {
        super(props, context, queue);
        this.onLoad({});
    }

    static contextTypes = {
        router: PropTypes.object.isRequired,
        store: React.PropTypes.object.isRequired
    };

    filter = {
        disposal: false,
    };

    onLoad = query => {
        if (!query) {
            query = this.props.query || {};
        }

        if (query.clean) {
            this.filter = {
                disposal: false
            };
            query.clean = undefined;
        }

        query.model = {
            disposal: this.filter.disposal || false
        };

        this.props.listLoad(query);
    };

    _confirmation = null;
    render = () => (
        <div>
            <Table data={this.props.list} query={this.props.query}
                   onLoad={this.onLoad} actions={this.renderActions()} filters={this.renderFilters()}>
                <Column name="number" title="Инвентарный номер" sort={true} />
                <Column name="name" title="Наименование" sort="asc" />
                <Column name="manager.fullname" title="МОЛ" sort={true} template={
                    row => row.manager.fullname
                } />
                <Column name="registerDate" title="Дата приема" sort={true} type="date" />
                <Column name="cost" title="Сумма" sort={true} />
                <Column name="disposalDate" title="Дата списания" sort={true} type="date" />
                <Column actions={true} template={
                    row =>
                        <ButtonGroup bsSize="xs">
                            <Restrict permissions={permissions.AssetManage}>
                                <Button onClick={e => this.context.router.push(`/assets/${row.id}`)}><Glyphicon glyph="edit"/></Button>
                            </Restrict>
                            <Restrict permissions={permissions.AssetManage}>
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
            <Restrict permissions={permissions.AssetManage}>
                <Button onClick={e => this.context.router.push('/assets/0')}><Glyphicon glyph="plus"/> Создать</Button>
            </Restrict>
        </ButtonGroup>;

    renderFilters = () => [
        <div className="row">
            <div className="col-sm-3">
                <InputGroup bsSize="sm" style={{width:'100%', paddingLeft:5}}>
                    <span className="input-group-addon">
                        <input type="checkbox" onChange={e => {
                            this.filter.disposal = e.target.checked;
                            this.onLoad();
                        }} checked={this.filter.disposal} />
                    </span>
                    <input type="text" className="form-control" value="списанные" disabled />
                </InputGroup>
            </div>
        </div>
    ];
}

export default connect((state) => {
    const { workspace } = state;

    return {
        list: workspace.list,
        query: workspace.query
    }
}, { listLoad, removeItem })(Assets);