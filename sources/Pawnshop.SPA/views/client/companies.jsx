import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { Table, Column } from '../controls/table';
import { ButtonGroup, Button, Glyphicon } from 'react-bootstrap';
import { connect } from 'react-redux';
import { list as listLoad, remove as removeItem } from '../../actions/companies';
import Restrict from '../controls/restrict';
import permissions from '../../engine/permissions';
import Confirmation from '../controls/confirmation';

class Companies extends React.Component {
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
                <Column name="identityNumber" title="БИН" sort={true} template={
                    row => <Link onlyActiveOnIndex={true} to={`/companies/${row.id}`} target="_blank">{row.identityNumber}</Link>
                } />
                <Column name="fullname" title="Наименование" sort="asc" template={
                    row => <Link onlyActiveOnIndex={true} to={`/companies/${row.id}`} target="_blank">{row.fullname}</Link>
                } />
                <Column name="address" title="Адрес" sort={true} />
                <Column name="mobilePhone" title="Моб. телефон" sort={true} />
                <Column actions={true} template={
                    row =>
                        <ButtonGroup bsSize="xs">
                            <Link onlyActiveOnIndex={true} className="btn btn-default btn-sm" to={`/companies/${row.id}`} target="_blank"><Glyphicon glyph="edit"/></Link>
                            <Restrict permissions={permissions.CompanyManage}>
                                <Button onClick={e => {
                                    this._confirmation.show("Вы действительно хотите удалить запись?",
                                        () => this.props.removeItem(row.id)
                                            .then(action => this.onLoad(this.props.query))
                                    );
                                }}><Glyphicon glyph="remove"/> Удалить</Button>
                            </Restrict>
                        </ButtonGroup>
                } />
            </Table>

            <Confirmation ref={r => this._confirmation = r} />
        </div>
    );

    renderActions = () =>
        <ButtonGroup bsSize="sm">
            <Restrict permissions={permissions.CompanyManage}>
                <Button onClick={e => this.context.router.push('/companies/0')}><Glyphicon glyph="plus"/> Создать</Button>
            </Restrict>
        </ButtonGroup>
}

export default connect((state) => {
    const { list, query } = state.workspace;
    return { list, query }
}, { listLoad, removeItem })(Companies);