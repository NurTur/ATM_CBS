import React, { PropTypes } from 'react';
import { Table, Column } from '../controls/table';
import { ButtonGroup, Button, Glyphicon, InputGroup } from 'react-bootstrap';
import { connect } from 'react-redux';
import { list as listLoad, card as cardLoad, save as cardSave, reset as passwordReset } from '../../actions/users';
import Restrict from '../controls/restrict';
import permissions from '../../engine/permissions';
import Confirmation from '../controls/confirmation';
import { success as successNotification } from '../../actions/common';

class Users extends React.Component {
    constructor(props, context, queue) {
        super(props, context, queue);

        this.onLoad({});
    }

    static contextTypes = {
        router: PropTypes.object.isRequired
    };

    filter = {
        locked: false
    };

    onLoad = query => {
        if (!query) {
            query = this.props.query || {};
        }

        if (query.clean) {
            this.filter = {
                locked: false
            };
            query.clean = undefined;
        }

        query.model = {
            locked: this.filter.locked || false
        };

        this.props.listLoad(query);
    };

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

    onReset = row => {
        this.props.passwordReset(row.id)
            .then(action => {
                if (action && action.data) {
                    this.props.successNotification('Пароль успешно сброшен');
                }
            });
    };

    _confirmation = null;
    render = () => (
        <div>
            <Table data={this.props.list} query={this.props.query}
                   onLoad={this.onLoad} actions={this.renderActions()} filters={this.renderFilters()}>
                <Column name="fullname" title="Ф.И.О" sort="asc" />
                <Column name="login" title="Имя пользователя" sort={true} />
                <Column name="identityNumber" title="ИИН" sort={true} />
                <Column name="email" title="Электронная почта" sort={true} />
                <Column name="locked" title="Блок." type="bool" sort={true} />
                <Column actions={true} template={
                    row =>
                        <ButtonGroup bsSize="xs">
                            <Button onClick={e => this.context.router.push(`/users/${row.id}`)}><Glyphicon glyph="edit"/> Профиль</Button>
                            <Restrict permissions={permissions.UserManage}>
                                <Button onClick={e => this.onLock(row)} title="Заблокировать/разблокировать"><Glyphicon glyph="lock"/></Button>
                            </Restrict>
                            <Restrict permissions={permissions.UserManage}>
                                <Button onClick={e => {
                                    this._confirmation.show("Вы действительно хотите сбросить пароль?",
                                        () => this.onReset(row)
                                    );
                                }} title="Сбросить пароль"><Glyphicon glyph="erase"/></Button>
                            </Restrict>
                        </ButtonGroup>
                } />
            </Table>

            <Confirmation ref={r => this._confirmation = r} />
        </div>
    );

    renderActions = () =>
        <ButtonGroup bsSize="sm">
            <Restrict permissions={permissions.UserManage}>
                <Button onClick={e => this.context.router.push('/users/0')}><Glyphicon glyph="plus"/> Создать</Button>
            </Restrict>
        </ButtonGroup>

    renderFilters = () => [
        <div className="row">
            <div className="col-sm-3">
                <InputGroup bsSize="sm" style={{width:'100%', paddingLeft:5}}>
                    <span className="input-group-addon">
                        <input type="checkbox" onChange={e => {
                            this.filter.locked = e.target.checked;
                            this.onLoad();
                        }} checked={this.filter.locked} />
                    </span>
                    <input type="text" className="form-control" value="заблокированные" disabled />
                </InputGroup>
            </div>
        </div>,
    ];
}

export default connect((state) => {
    const { list, query } = state.workspace;
    return { list, query }
}, { listLoad, cardLoad, cardSave, passwordReset, successNotification })(Users);