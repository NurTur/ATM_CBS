import React from 'react';
import { Table, Column } from '../controls/table';
import { ButtonGroup, Button, Glyphicon } from 'react-bootstrap';
import { connect } from 'react-redux';
import { list as listLoad, save as saveItem, remove as removeItem } from '../../actions/notificationReceivers';
import { resend as receiverResend } from '../../actions/notifications';
import { clients as clientsLoad } from '../../actions/dictionaries';
import { profile } from '../../actions/security';
import SelectInput from '../controls/form/selectInput';
import Confirmation from '../controls/confirmation';
import permissions from "../../engine/permissions";
import Restrict from '../controls/restrict';

class NotificationReceivers extends React.Component {
    static contextTypes = {
        router: React.PropTypes.object.isRequired,
        store: React.PropTypes.object.isRequired
    };

    componentDidMount(){
        if (this.props.auth.isAuthenticated) {
            this.props.profile();
        }
        this.onLoad();
        this.client = {
            id: null,
            fullname: 'Клиент'
        };
    }

    client = {
        id: null,
        fullname: 'Клиент'
    }

    onLoad = query => {
        if (!query) {
            query = this.props.query || {};
        }
        query.model = {
            notificationId: this.props.notificationId
        };
        this.props.listLoad(query);
    };

    onSave = model => this.props.saveItem(model).then(action => {
        this._clientId = 0;
        this.client = {
            id: null,
            fullname: 'Клиент'
        };
        this.onLoad();
    });

    _confirmation = null;
    render = () => (
        <div>
            <Table data={this.props.list} query={this.props.query}
                   onLoad={this.onLoad} actions={this.renderActions()}>
                <Column name="client.fullname" title="Клиент" sort="asc" template={
                    row => <span>{row.client.fullname}</span>
                } />
                <Column name="tryCount" title="Попытки" sort={false} />
                <Column actions={true} template={
                    row =>
                        <ButtonGroup bsSize="xs">
                            {row.status == 20 && <Restrict permissions={permissions.NotificationManage}>
                                <Button onClick={e => {
                                    this._confirmation.show("Вы действительно хотите переотправить уведомление?",
                                        () => this.props.receiverResend(row.id).then(action => this.onLoad())
                                    );
                                }} disabled={row.status != 20}><Glyphicon glyph="send"/> Переотправить</Button>
                            </Restrict>}
                            <Restrict permissions={permissions.NotificationManage}>
                                <Button onClick={e => {
                                    this._confirmation.show("Вы действительно хотите удалить запись?",
                                        () => this.props.removeItem(row.id).then(action => this.onLoad())
                                    );
                                }} disabled={row.status > 0}><Glyphicon glyph="remove"/> Удалить</Button>
                            </Restrict>
                            <Button onClick={e => this.props.onLogs(row.id)}>
                                <Glyphicon glyph="tasks"/> Журнал
                            </Button>
                        </ButtonGroup>
                } />
            </Table>

            <Confirmation ref={r => this._confirmation = r} />
        </div>
    );

    _clientId = 0;
    renderActions = () => (
        <div style={{paddingLeft:'10px'}}>
            <SelectInput title="Выбор клиента" display={e => e.fullname}
                         input={{ className: 'form-control input-sm', style: {width: '200px'},
                             value: this.client, onChange: e => {
                                 this._clientId = (e && e.id) || null;
                                 this.client = e;
                                 this.onLoad();
                             } }}
                         button={{
                             className: 'btn btn-default btn-sm'
                         }}
                         onLoad={clientsLoad} readOnly={this.props.readOnly} />
            <Restrict permissions={permissions.NotificationManage}>
                <button type="button" className="btn btn-default btn-sm" title="Добавить" onClick={() => {
                    this.onSave({
                        notificationId: this.props.notificationId,
                        clientId: this._clientId,
                        status: 0,
                        createDate: new Date()
                    });
                }} disabled={this.props.notificationId <= 0}><Glyphicon glyph="plus"/></button>
            </Restrict>
        </div>
    );
};

export default connect((state) => {
    const { receiver, auth } = state;

    return {
        list: receiver.list,
        query: receiver.query,
        auth: auth,
    }
}, { listLoad, saveItem, removeItem, receiverResend, profile })(NotificationReceivers);