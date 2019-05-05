import React from 'react';
import { Link } from 'react-router';
import { Table, Column } from '../controls/table';
import { ButtonGroup, Button, Glyphicon, InputGroup, Dropdown, MenuItem } from 'react-bootstrap';
import { connect } from 'react-redux';
import {
    list as listLoad, card as cardLoad, remove as removeItem, undoRemove,
    excel as excelLoad, print as printLoad, printAnnuity
} from '../../actions/contracts';
import { find as findOrder } from '../../actions/cashOrders';
import { find as findLoanPercent } from '../../actions/loanPercents';
import { purities as puritiesLoad } from '../../actions/dictionaries';
import ContractsPrint from './contractsPrint';
import ContractBailmentPrint from './contractBailmentPrint';
import ContractPrint from './contractPrint';
import ContractAnnuityPrint from './contractAnnuityPrint';
import { downloadTemp, print } from '../../actions/common';
import Restrict from '../controls/restrict';
import DateInput from '../controls/form/dateInput';
import permissions from '../../engine/permissions'
import { profile } from '../../actions/security';
import Confirmation from '../controls/confirmation';

class Contracts extends React.Component {
    static contextTypes = {
        router: React.PropTypes.object.isRequired,
        store: React.PropTypes.object.isRequired
    };

    filter = {
        beginDate: null,
        endDate: null,
        collateralType: null,
        displayStatus: null,
        isTransferred: false,
        identityNumber: null
    };

    componentDidMount(){
        if (this.props.auth.isAuthenticated) {
            this.props.profile();
        }
        if (!this.props.purities.length) {
            this.props.puritiesLoad();
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
                collateralType: null,
                displayStatus: null,
                isTransferred: false,
                identityNumber: null
            };
            query.clean = undefined;
        }

        query.model = {
            clientId: this.props.clientId,
            beginDate: this.filter.beginDate || null,
            endDate: this.filter.endDate || null,
            collateralType: this.filter.collateralType || null,
            displayStatus: this.filter.displayStatus || null,
            isTransferred: this.filter.isTransferred || false,
            identityNumber: this.filter.identityNumber || null
        };
        this.props.listLoad(query);
    };

    onPrint = () => {
        this.props.print(
            <ContractsPrint data={this.props.list} auth={this.props.auth}
                            beginDate={(this.beginDate && this.beginDate.value) || null}
                            endDate={(this.endDate && this.endDate.value) || null} />);
    };

    onPrintCard = (row) => {
        if (row.status < 30) return;

        this.props.cardLoad(row.id).then(action => {
            if (action && action.data) {
                let contract = action.data;
                this.props.findOrder({
                    contractId: contract.id,
                    actionType: 50,
                }).then(action => {
                    if (action && action.data) {
                        let cashOrder = action.data;
                        if (contract.percentPaymentType == 30 || contract.percentPaymentType == 31) {
                            this.props.findLoanPercent({
                                collateralType: contract.collateralType,
                                cardType: contract.contractData.client.cardType,
                                loanCost: contract.loanCost,
                                loanPeriod: contract.loanPeriod
                            }).then(action => {
                                if (action && action.data) {
                                    this.props.print(<ContractAnnuityPrint data={contract} order={cashOrder} auth={this.props.auth} profile={action.data} />);
                                } else {
                                    this.props.warning('Профиль для загрузки процентов по данному типу договор не найден. Обратитесь к администратору для настройки процентов.');
                                }
                            });
                        } else {
                            this.props.print(<ContractPrint data={contract} order={cashOrder} auth={this.props.auth} purities={this.props.purities} />);
                        }
                    } else {
                        let cashOrder = {
                            debitAccount: {},
                            creditAccount: {}
                        };
                        if (contract.percentPaymentType == 30 || contract.percentPaymentType == 31) {
                            this.props.findLoanPercent({
                                collateralType: contract.collateralType,
                                cardType: contract.client.cardType,
                                loanCost: contract.loanCost,
                                loanPeriod: contract.loanPeriod
                            }).then(action => {
                                if (action && action.data) {
                                    this.props.print(<ContractAnnuityPrint data={contract} order={cashOrder} auth={this.props.auth} profile={action.data} />);
                                } else {
                                    this.props.warning('Профиль для загрузки процентов по данному типу договор не найден. Обратитесь к администратору для настройки процентов.');
                                }
                            });
                        } else {
                            this.props.print(<ContractPrint data={contract} order={cashOrder} auth={this.props.auth} purities={this.props.purities} />);
                        }
                    }
                });
            }
        });
    };

    onPrintContractBailment = (row) => {
        if (row.status < 30) return;

        this.props.cardLoad(row.id).then(action => {
            if (action && action.data) {
                this.props.print(<ContractBailmentPrint data={action.data} auth={this.props.auth} />);
            }
        });
    };

    onPrintContractCollateral = (row) => {
        if (row.status < 30) return;
        if (row.collateralType != 20 && row.collateralType != 40) return;

        if (row.percentPaymentType == 30 || row.percentPaymentType == 31) {
            this.props.printAnnuity(row.id)
                .then(action => {
                    if (action && action.data) {
                        this.context.store.dispatch(downloadTemp(action.data));
                    }
                });
        } else {
            this.props.printLoad(row.id)
                .then(action => {
                    if (action && action.data) {
                        this.context.store.dispatch(downloadTemp(action.data));
                    }
                });
        }
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
                <Column name="contractDate" title="Дата" sort="desc" type="date" />
                <Column name="contractNumber" title="№" sort={true} template={
                    row => <Link onlyActiveOnIndex={true} to={`/contracts/${row.id}`} target="_blank">{row.contractNumber}</Link>
                } />
                <Column name="contractData.client.fullname" title="Клиент" sort={true} template={
                    row => <Link onlyActiveOnIndex={true} to={`/contracts/${row.id}`} target="_blank">{row.contractData.client.fullname}</Link>
                } />
                <Column name="contractData.client.cardType" title="Тип карты" sort={true} template={
                    row =>
                    row.contractData.client.cardType == 10 && <span>Standard</span> ||
                    row.contractData.client.cardType == 20 && <span>Bronze</span> ||
                    row.contractData.client.cardType == 30 && <span>Silver</span> ||
                    row.contractData.client.cardType == 40 && <span>Gold</span> ||
                    row.contractData.client.cardType == 50 && <span>Platinum</span>
                } />
                <Column name="loanPercent" title="Процент" sort={true} template={
                    row => (row.loanPercent*30).toFixed(1)
                } />
                <Column name="loanCost" title="Сумма" sort={true} type="number" />
                <Column name="collateralType" title="Вид залога" sort={true} template={
                    row =>
                    row.collateralType == 10 && <span>Золото</span> ||
                    row.collateralType == 20 && <span>Автотранспорт</span> ||
                    row.collateralType == 30 && <span>Товар</span> ||
                    row.collateralType == 40 && <span>Спецтехника</span>
                } />
                <Column name="maturityDate" title="Дата возврата" sort={true} type="date" />
                <Column name="displayStatus" title="Статус" sort={true} template={
                    row =>
                    row.displayStatus == 0 && <span>Новый</span> ||
                    row.displayStatus == 10 && <span>Открыт</span> ||
                    row.displayStatus == 20 && <span className="label label-danger">Просрочен</span> ||
                    row.displayStatus == 30 && <span className="label label-warning">Продлен</span> ||
                    row.displayStatus == 40 && <span className="label label-success">Выкуплен</span> ||
                    row.displayStatus == 50 && <span className="label label-info">На реализации</span> ||
                    row.displayStatus == 60 && <span className="label label-default">Удален</span>
                } />
                <Column name="branch.displayName" title="Филиал" sort={true} template={
                    row => row.branch.displayName
                } />
                <Column name="author.fullname" title="Автор" sort={true} template={
                    row => row.author.fullname
                } />

                <Column actions={true} template={
                    row =>
                        <ButtonGroup bsSize="xs">
                            <Link onlyActiveOnIndex={true} className="btn btn-default btn-sm" to={`/contracts/${row.id}`} target="_blank"><Glyphicon glyph="edit"/></Link>
                            <Dropdown bsSize="xs" pullRight={true}>
                                <Dropdown.Toggle>
                                    <Glyphicon glyph="print" />
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <MenuItem eventKey="1" onClick={e => this.onPrintCard(row)}>Залоговый билет</MenuItem>
                                    <MenuItem eventKey="2" onClick={e => this.onPrintContractBailment(row)}>Договор на ответ хранение</MenuItem>
                                    <MenuItem eventKey="3" onClick={e => this.onPrintContractCollateral(row)}>Договор залога</MenuItem>
                                </Dropdown.Menu>
                            </Dropdown>
                            <Restrict permissions={permissions.ContractManage}>
                                <Button onClick={e => this.context.router.push(`/contracts/${row.id}/true`)}><Glyphicon glyph="copy"/></Button>
                            </Restrict>
                            {!row.deleteDate &&
                            <Restrict permissions={permissions.ContractManage}>
                                <Button onClick={e => {
                                    this._confirmation.show("Вы действительно хотите удалить запись?",
                                        () => this.props.removeItem(row.id)
                                            .then(action => this.onLoad(this.props.query))
                                    );
                                }} disabled={row.status > 0 || row.locked || (!row.createdToday && !this.props.auth.profile.user.forSupport)}><Glyphicon glyph="remove"/></Button>
                            </Restrict>
                            }
                            {row.deleteDate &&
                            <Restrict permissions={permissions.ContractManage}>
                                <Button onClick={e => {
                                    this._confirmation.show("Вы действительно хотите восстановить запись?",
                                        () => this.props.undoRemove(row.id)
                                            .then(action => this.onLoad(this.props.query))
                                    );
                                }} disabled={row.status > 0 || (!row.createdToday && !this.props.auth.profile.user.forSupport)}><Glyphicon glyph="repeat"/></Button>
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
            <Restrict permissions={permissions.ContractManage}>
                <Button onClick={e => this.context.router.push('/contracts/0')} 
                        disabled={this.filter.isTransferred} 
                        title={this.filter.isTransferred && "Нельзя создать переданный договор" || "Создать договор"}><Glyphicon glyph="plus"/> Создать</Button>
            </Restrict>
            <Button onClick={e => this.onPrint()}><Glyphicon glyph="print"/> Печать</Button>
            <Button onClick={e => this.onExport()}><Glyphicon glyph="print"/> Excel</Button>
        </ButtonGroup>;

    renderFilters = () => [
        <div className="row form-group">
            <div className="col-sm-2">
                <InputGroup bsSize="sm" style={{width:'100%', paddingLeft:5}}>
                    <span className="input-group-addon" id="identityNumber-addon">ИИН</span>
                    <input type="int" min="0" className="form-control" name="identityNumber" aria-describedby="identityNumber-addon"
                        onChange={e => {
                            if(e.target.value.length == 0 && this.state.updatedWithIdentityNumber){
                                this.filter.identityNumber = null;
                                this.setState({
                                    updatedWithIdentityNumber: false
                                });
                                this.onLoad();
                            }
                            if(e.target.value.length == 12 || !e.target.value.match(/[^0-9]/g)){
                                this.filter.identityNumber = e.target.value;
                                this.setState({
                                    updatedWithIdentityNumber: true
                                });
                                this.onLoad();
                            }
                        }} value={this.filter.identityNumber} />
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
            <div className="col-sm-2">
                <InputGroup bsSize="sm" style={{width:'100%'}}>
                    <select className="form-control"
                            onChange={e => {
                                this.filter.collateralType = e.target.value;
                                this.onLoad();
                            }}>
                        <option selected={!this.filter.collateralType} value="">Вид залога</option>
                        <option selected={this.filter.collateralType == 10} value="10">Золото</option>
                        <option selected={this.filter.collateralType == 20} value="20">Автотранспорт</option>
                        <option selected={this.filter.collateralType == 30} value="30">Товар</option>
                        <option selected={this.filter.collateralType == 40} value="40">Спецтехника</option>
                    </select>
                </InputGroup>
            </div>
            <div className="col-sm-2">
                <InputGroup bsSize="sm" style={{width:'100%'}}>
                    <select className="form-control"
                            onChange={e => {
                                this.filter.displayStatus = e.target.value;
                                this.onLoad();
                            }}>
                        <option selected={!this.filter.displayStatus} value="">Статус</option>
                        <option selected={this.filter.displayStatus == 0} value="0">Новый</option>
                        <option selected={this.filter.displayStatus == 10} value="10">Открыт</option>
                        <option selected={this.filter.displayStatus == 20} value="20">Просрочен</option>
                        <option selected={this.filter.displayStatus == 30} value="30">Продлен</option>
                        <option selected={this.filter.displayStatus == 40} value="40">Выкуплен</option>
                        <option selected={this.filter.displayStatus == 50} value="50">На реализации</option>
                        <option selected={this.filter.displayStatus == 60} value="60">Удален</option>
                        <option selected={this.filter.displayStatus == 70} value="70">Действующие</option>
                    </select>
                </InputGroup>
            </div>
        </div>,
        <div className="row">
            <div className="col-sm-4">
                <InputGroup bsSize="sm" style={{width:'100%', paddingLeft:5}}>
                    <span className="input-group-addon">
                        <input type="checkbox" onChange={e => {
                            this.filter.isTransferred = e.target.checked;
                            this.onLoad();
                        }} checked={this.filter.isTransferred} />
                    </span>
                    <input type="text" className="form-control" value="переданные" disabled />
                </InputGroup>
            </div>
        </div>
    ];
}

export default connect((state) => {
    const { workspace, dictionary, auth } = state;
    
    return { 
        list: workspace.list,
        query: workspace.query,
        purities: dictionary.purities,
        auth: auth,
    }
}, { listLoad, cardLoad, removeItem, undoRemove, excelLoad, printLoad, findOrder, findLoanPercent, print, printAnnuity, profile, puritiesLoad })(Contracts);