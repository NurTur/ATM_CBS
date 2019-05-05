import React from 'react';
import { Table, Column} from '../controls/table';
import { ButtonGroup, Button, Glyphicon, InputGroup } from 'react-bootstrap';
import { connect } from 'react-redux';
import { list as listLoad, remove as removeItem, send as sendItem } from '../../actions/notifications';
import Confirmation from '../controls/confirmation';
import Restrict from '../controls/restrict';
import permissions from '../../engine/permissions'
import DateInput from '../controls/form/dateInput';
import { profile } from '../../actions/security';

class Notifications extends React.Component {
    static contextTypes = {
        router: React.PropTypes.object.isRequired,
        store: React.PropTypes.object.isRequired
    };

    filter = {
        beginDate: null,
        endDate: null,
        messageType: null,
        status: null
    };

    componentDidMount(){
        if (this.props.auth.isAuthenticated) {
            this.props.profile();
        }
        this.onLoad();
    }

    onLoad = query => {
        if (!query) {
            query = this.props.query || {};
        }

        if (query.clean) {
            this.filter = {
                beginDate: null,
                endDate: null,
                messageType: null,
                status: null
            };
            query.clean = undefined;
        }

        query.model = {
            beginDate: this.filter.beginDate || null,
            endDate: this.filter.endDate || null,
            messageType: this.filter.messageType || null,
            status: this.filter.status || null,
        };
        this.props.listLoad(query);
    };

    _confirmation = null;
    render = () => (
        <div>
            <Table data={this.props.list} query={this.props.query}
                   onLoad={this.onLoad} actions={this.renderActions()} filters={this.renderFilters()}>
                <Column name="messageType" title="Тип сообщения" sort={true} template={
                    row =>
                        row.messageType == 10 && <span>Email</span> ||
                        row.messageType == 20 && <span>Sms</span>
                } />
                <Column name="subject" title="Тема" sort={true} />
                <Column name="message" title="Сообщение" sort={true} />
                <Column name="createDate" title="Дата" sort="desc" type="date" />
                <Column name="status" title="Статус" sort={true} template={
                    row =>
                        row.status == 0 && <span>Черновик</span> ||
                        row.status == 10 && <span>Для отправки</span> ||
                        row.status == 20 && <span>Отправлено</span>
                } />
                <Column actions={true} template={
                    row =>
                        <ButtonGroup bsSize="xs">
                            <Button onClick={e => this.context.router.push(`/notifications/${row.id}`)}><Glyphicon glyph="edit"/> Изменить</Button>
                            <Restrict permissions={permissions.NotificationManage}>
                                <Button onClick={e => {
                                    this._confirmation.show("Вы действительно хотите отправить уведомление?",
                                        () => this.props.sendItem(row.id).then(action => this.onLoad(this.props.query))
                                    );
                                }} disabled={row.status > 0}><Glyphicon glyph="send"/> Отправить</Button>
                            </Restrict>
                            <Restrict permissions={permissions.NotificationManage}>
                                <Button onClick={e => {
                                    this._confirmation.show("Вы действительно хотите удалить запись?",
                                        () => this.props.removeItem(row.id).then(action => this.onLoad(this.props.query))
                                    );
                                }} disabled={row.status > 0}><Glyphicon glyph="remove"/> Удалить</Button>
                            </Restrict>
                        </ButtonGroup>
                }/>
            </Table>

            <Confirmation ref={r => this._confirmation = r} />
        </div>
    );

    renderActions = () =>
        <ButtonGroup bsSize="sm">
            <Restrict permissions={permissions.NotificationManage}>
                <Button onClick={e => this.context.router.push('/notifications/0')}><Glyphicon glyph="plus"/> Создать</Button>
            </Restrict>
        </ButtonGroup>

    renderFilters = () => [
        <div className="row">
            <div className="col-sm-3">
                <div style={{paddingLeft:5}}>
                    <DateInput className="form-control input-sm" placeholder="Дата с..." onChange={e => {
                        this.filter.beginDate = e;
                        this.onLoad();
                    }} value={this.filter.beginDate} />
                </div>
            </div>
            <div className="col-sm-3">
                <DateInput className="form-control input-sm" placeholder="Дата по..." onChange={e => {
                    this.filter.endDate = e;
                    this.onLoad();
                }} value={this.filter.endDate} />
            </div>
            <div className="col-sm-3">
                <InputGroup bsSize="sm" style={{width:'100%'}}>
                    <select className="form-control"
                            onChange={e => {
                                this.filter.messageType = e.target.value;
                                this.onLoad();
                            }}>
                        <option selected={!this.filter.messageType} value="">Тип сообщения</option>
                        <option selected={this.filter.messageType == 10} value="10">Email</option>
                        <option selected={this.filter.messageType == 20} value="20">Sms</option>
                    </select>
                </InputGroup>
            </div>
            <div className="col-sm-3">
                <InputGroup bsSize="sm" style={{width:'100%'}}>
                    <select className="form-control"
                            onChange={e => {
                                this.filter.status = e.target.value;
                                this.onLoad();
                            }}>
                        <option selected={!this.filter.status} value="">Статус</option>
                        <option selected={this.filter.status == 0} value="0">Черновик</option>
                        <option selected={this.filter.status == 10} value="10">Для отправки</option>
                        <option selected={this.filter.status == 20} value="20">Отправлено</option>
                    </select>
                </InputGroup>
            </div>
        </div>,
    ];
};

export default connect((state) => {
    const { workspace, auth } = state;

    return {
        list: workspace.list,
        query: workspace.query,
        auth: auth,
    }
}, { listLoad, removeItem, sendItem, profile })(Notifications);