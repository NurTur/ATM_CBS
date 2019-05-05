import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { Table, Column } from '../controls/table';
import { ButtonGroup, Button, Glyphicon, InputGroup, Dropdown, MenuItem } from 'react-bootstrap';
import { connect } from 'react-redux';
import { list as listLoad, remove as removeItem, approve as approveItem, prohibit as prohibitItem, undoRemove, excel as excelLoad } from '../../actions/cashOrders';
import { clients as clientsLoad, users as usersLoad, accounts as accountsLoad } from '../../actions/dictionaries';
import CashOrdersPrint from './cashOrdersPrint';
import CashInOrderPrint from './cashInOrderPrint';
import CashOutOrderPrint from './cashOutOrderPrint';
import { downloadTemp, print } from '../../actions/common';
import Confirmation from '../controls/confirmation';
import MemorandumPrint from './memorandumPrint';

import Restrict from '../controls/restrict';
import permissions from '../../engine/permissions';
import { profile } from '../../actions/security';
import SelectInput from '../controls/form/selectInput';
import DateInput from '../controls/form/dateInput';
import moment from 'moment';

class CashOrders extends React.Component {
    constructor(props, context, queue) {
        super(props, context, queue);

        this.onLoad({});
        if (!this.props.users.length) {
            this.props.usersLoad();
        }
        if (!this.props.accounts.length) {
            this.props.accountsLoad();
        }
        this.client = {
            id: null,
            fullname: 'Клиент'
        };
        if(permissions.CashOrderApprove){
            this.classes.accountClasses="col-sm-6";
        }
        else{
            this.classes.accountClasses="col-sm-3";
        }
    }

    static contextTypes = {
        router: PropTypes.object.isRequired,
        store: React.PropTypes.object.isRequired
    };

    filter = {
        orderType: null,
        beginDate: null,
        endDate: null,
        orderNumber: null,        
        clientId: null,
        userId: null,
        accountId: null,
        isDelete: null,
        isApproved: 0,
        ownerId: 0,
    };

    client = {
        id: null,
        fullname: 'Клиент'
    }

    classes = {
        accountClasses: null
    }    

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
                orderType: null,
                beginDate: null,
                endDate: null,
                orderNumber: null,        
                clientId: null,
                userId: null,
                accountId: null,
                isDelete: null,
            };
            this.client = {
                id: null,
                fullname: 'Клиент'
            };
            query.clean = undefined;
        }
        
        query.model = {
            orderType: this.filter.orderType || null,
            beginDate: this.filter.beginDate || null,
            endDate: this.filter.endDate || null,
            orderNumber: this.filter.orderNumber || null,
            clientId: this.filter.clientId || null,
            userId: this.filter.userId || null,
            accountId: this.filter.accountId || null,
            isDelete: this.filter.isDelete || null,
            isApproved: this.filter.isApproved || null,
            ownerId: this.filter.ownerId || 0,
        };
        this.props.listLoad(query);
    };

    onPrint = () => {
        this.props.print(<CashOrdersPrint data={this.props.list} auth={this.props.auth} />);
    };

    onPrintCard = (row) => {
        if (row.orderType == 10) {
            this.props.print(<CashInOrderPrint data={row} auth={this.props.auth} />);
        } else {
            this.props.print(<CashOutOrderPrint data={row} auth={this.props.auth} />);
        }
    };

    onPrintMemorandum = (row, isProoven) => {
        this.props.print(<MemorandumPrint data={row} auth={this.props.auth} isProoven={isProoven}/>)
    };

    onExport = () => {
        this.props.excelLoad(this.props.list.list)
            .then(action => {
                if (action && action.data) {
                    this.context.store.dispatch(downloadTemp(action.data));
                }
            });
    };

    _confirmation = null;
    render = () => (
        <div>
            <Table data={this.props.list} query={this.props.query}
                   onLoad={this.onLoad} actions={this.renderActions()} filters={this.renderFilters()}>
                <Column name="orderType" title="Вид ордера" sort={true} template={
                    row =>
                    row.orderType == 10 && <span>Приход</span> ||
                    row.orderType == 20 && <span>Расход</span>
                } />
                <Column name="orderNumber" title="№" sort={true} template={
                    row => !row.clientId && <Link onlyActiveOnIndex={true} to={`/cashOrders/${row.id}`} target="_blank">{row.orderNumber}</Link> || <span>{row.orderNumber}</span>
                } />
                <Column name="orderDate" title="Дата" sort="desc" type="date" template={
                    row => !row.clientId && <Link onlyActiveOnIndex={true} to={`/cashOrders/${row.id}`} target="_blank">{moment(row.orderDate).format('L')}</Link> || <span>{moment(row.orderDate).format('L')}</span>
                } />
                <Column name="reason" title="Основание" sort={false} />
                <Column name="orderCost" title="Сумма" sort={true} type="number" />
                <Column name="debitAccount.code" title="Дебет" sort={true} template={
                    row => row.debitAccount.code
                } />
                <Column name="creditAccount.code" title="Кредит" sort={true} template={
                    row => row.creditAccount.code
                } />
                <Column name="clientName" title="Клиент" sort={true} />
                <Column name="approvestatus" title="Статус" sort={true} template={
                    row =>
                    (row.approveStatus==0 && <span className="label label-warning">Ожидает</span> ||
                     row.approveStatus==10 && <span className="label label-success">Одобрен</span> ||
                     row.approveStatus==20 && <span className="label label-danger">Отклонен</span> )
                } />
                <Restrict permissions={permissions.CashOrderApprove}>
                    <Column name="branch.displayName" title="Филиал" sort={false} template={
                        row => row.branch.displayName
                    } />
                </Restrict>
                <Column name="author.fullname" title="Автор" sort={true} template={
                    row => row.author.fullname
                } />
                <Column actions={true} template={
                    row =>
                        <ButtonGroup bsSize="xs">
                            <Link title="Изменить" className="btn btn-default btn-sm" to={`/cashOrders/${row.id}`} target="_blank"><Glyphicon glyph="edit"/></Link>
                            {row.approveStatus!=10 &&
                            <Restrict permissions={permissions.CashOrderApprove}>
                                 <Button title="Подтвердить" onClick={e => {
                                    this._confirmation.show("Вы хотите подтвердить запись?",
                                    () => this.props.approveItem(row.id)
                                        .then(action => this.onLoad(this.props.query))
                                );
                                }}><Glyphicon glyph="thumbs-up"/></Button></Restrict>}
                            {row.approveStatus==0 &&
                            <Restrict permissions={permissions.CashOrderApprove}>
                                 <Button title="Отклонить" onClick={e => {
                                    this._confirmation.show("Вы хотите отклонить запись?",
                                    () => this.props.prohibitItem(row.id)
                                        .then(action => this.onLoad(this.props.query))
                                );
                                }} disabled={row.approveStatus==20}><Glyphicon glyph="thumbs-down"/></Button></Restrict>}
                            {row.clientId &&<Button title="Печать" onClick={e => this.onPrintCard(row)}><Glyphicon glyph="print"/></Button>}
                            {!row.clientId &&
                            <Dropdown bsSize="xs" pullRight={true}>
                                <Dropdown.Toggle>
                                    <Glyphicon glyph="print" />
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    {row.approveStatus==10 && <MenuItem eventKey="1" onClick={e => this.onPrintCard(row)}>Кассовый ордер</MenuItem>}
                                    {row.proveType==20 && <MenuItem eventKey="2" onClick={e => this.onPrintMemorandum(row,false)}>СЗ без документов</MenuItem>}
                                    {row.proveType==10 && <MenuItem eventKey="3" onClick={e => this.onPrintMemorandum(row,true)}>СЗ с документами</MenuItem>}
                                </Dropdown.Menu>
                            </Dropdown>}
                            
                            <Restrict permissions={permissions.CashOrderManage}>
                                <Button title="Копировать" onClick={e => this.context.router.push(`/cashOrders/${row.id}/true`)}><Glyphicon glyph="copy"/></Button>
                            </Restrict>
                            {!row.deleteDate &&
                            <Restrict permissions={permissions.CashOrderManage}>
                                <Button title="Удалить" onClick={e => {
                                    this._confirmation.show("Вы действительно хотите удалить запись?",
                                        () => this.props.removeItem(row.id)
                                            .then(action => this.onLoad(this.props.query))
                                    );
                                }} disabled={row.clientId || (!row.createdToday && !this.props.auth.profile.user.forSupport)}><Glyphicon glyph="remove"/></Button>
                            </Restrict>
                            }
                            {row.deleteDate &&
                            <Restrict permissions={permissions.CashOrderManage}>
                                <Button onClick={e => {
                                    this._confirmation.show("Вы действительно хотите восстановить запись?",
                                        () => this.props.undoRemove(row.id)
                                            .then(action => this.onLoad(this.props.query))
                                    );
                                }} disabled={row.clientId || (!row.createdToday && !this.props.auth.profile.user.forSupport)}><Glyphicon glyph="repeat"/></Button>
                            </Restrict>
                            }
                        </ButtonGroup>
                } />
            </Table>

            <Confirmation ref={r => this._confirmation = r} />
        </div>
    );

    renderActions = () =>
        <ButtonGroup bsSize="sm">
            <Restrict permissions={permissions.CashOrderManage}>
                <Button onClick={e => this.context.router.push('/cashOrders/0')}><Glyphicon glyph="plus"/> Создать</Button>
            </Restrict>
            <Button onClick={e => this.onPrint()}><Glyphicon glyph="print"/> Печать</Button>
            <Button onClick={e => this.onExport()}><Glyphicon glyph="print"/> Excel</Button>
        </ButtonGroup>;

    renderFilters = () => [ 
        <div className="row">
            <div className="col-sm-3">
                <InputGroup bsSize="sm" style={{width:'100%', paddingLeft:5}}>
                    <select className="form-control" aria-describedby="orderType-addon" onChange={e => {
                                this.filter.orderType = e.target.value;
                                this.onLoad();
                            }}>
                        <option selected={!this.filter.orderType} value="">Вид кассового ордера</option>
                        <option selected={this.filter.orderType == 10} value="10">Приход</option>
                        <option selected={this.filter.orderType == 20} value="20">Расход</option>
                    </select>
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
                    <span className="input-group-addon" id="orderNumber-addon">№</span>
                    <input type="int" min="1" className="form-control" name="orderNumber" aria-describedby="orderNumber-addon"
                        onChange={e => {
                            this.filter.orderNumber = e.target.value;
                            this.onLoad();
                        }} value={this.filter.orderNumber} />
                </InputGroup>
            </div>
        </div>,
        <div className="row" style={{marginTop:5}}>
            <div className="col-sm-6">
                <InputGroup bsSize="sm" style={{width:'100%', paddingLeft:5}}>
                    <SelectInput title="Выбор клиента" className="form-control input-sm"
                        input={{ value: this.client, onChange: e => { 
                            this.filter.clientId = (e && e.id) || null;
                            this.client = e;
                            this.onLoad(); 
                        } }}
                        onLoad={clientsLoad} display={e => e.fullname} />
                </InputGroup>
            </div>
            <div className="col-sm-6">
                <InputGroup bsSize="sm" style={{width:'100%'}}>
                    <select className="form-control" aria-describedby="userId-addon"
                            onChange={e => {
                                this.filter.userId = e.target.value;
                                this.onLoad();
                            }}>
                        <option selected={!this.filter.userId} value="">Сотрудник</option>
                        {this.props.users.map((item, i) => {
                            return <option selected={this.filter.userId == item.id} value={item.id}>{item.fullname}</option>
                        })}
                    </select>
                </InputGroup>
            </div>
        </div>,
        <div className="row" style={{marginTop:5}}>
            <div className="col-sm-3">
                <InputGroup bsSize="sm" style={{width:'100%', paddingLeft:5}}>
                    <select className="form-control" aria-describedby="accountId-addon"
                            onChange={e => {
                                this.filter.accountId = e.target.value;
                                this.onLoad();
                            }}>
                        <option selected={!this.filter.accountId} value="">Счет</option>
                        {this.props.accounts.map((item, i) => {
                            return <option selected={this.filter.accountId == item.id} value={item.id}>{item.code} - {item.name}</option>
                        })}
                    </select>
                </InputGroup>
            </div>
            <div className="col-sm-3">
                <InputGroup bsSize="sm" style={{width:'100%'}}>
                    <span className="input-group-addon">
                        <input type="checkbox" onChange={e => {
                            this.filter.isDelete = e.target.checked;
                            this.onLoad();
                        }} checked={this.filter.isDelete} />
                    </span>
                    <input type="text" className="form-control" value="удаленные" disabled />
                </InputGroup>
            </div>
            <div className="col-sm-3">
                <InputGroup bsSize="sm" style={{width:'100%'}}>
                    <span className="input-group-addon">
                        <input type="checkbox" onChange={e => {
                            this.filter.isApproved = e.target.checked;
                            this.onLoad();
                        }} checked={this.filter.isApproved} />
                    </span>
                    <input type="text" className="form-control" value="неподтвержденные" disabled />
                </InputGroup>
            </div>
            <Restrict permissions={permissions.CashOrderApprove}>
                <div className="col-sm-3" hidden={!this.filter.isApproved}>
                    <InputGroup bsSize="sm" style={{width:'100%', paddingLeft:5}}>
                        <select className="form-control" aria-describedby="accountId-addon"
                                onChange={e => {
                                    this.filter.ownerId = e.target.value;
                                    this.onLoad();
                                }}>
                            <option selected={!this.filter.ownerId} disabled value="">Филиал</option>
                            <option selected={this.filter.ownerId} value="-1">Все</option>
                            {this.props.auth.profile.branches.map((item, i)=>
                            <option selected={this.filter.ownerId  == item.id } value={item.id}>{item.displayName}</option>  
                            )}
                        </select>
                    </InputGroup>
                </div> 
            </Restrict>
        </div>
    ];
}

export default connect((state) => {
    const { workspace, dictionary, auth } = state;

    return { 
        list: workspace.list, 
        query: workspace.query,
        users: dictionary.users,
        accounts: dictionary.accounts,
        auth: auth
    }
}, { listLoad, removeItem, approveItem, prohibitItem, undoRemove, excelLoad, clientsLoad, usersLoad, accountsLoad, print, profile })(CashOrders);