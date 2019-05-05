import React, { PropTypes } from 'react';
import { ButtonGroup, Button, Glyphicon, InputGroup, Dropdown, MenuItem } from 'react-bootstrap';
import { connect } from 'react-redux';
import { contractMonitoring, exportContractMonitoring } from '../../actions/reports';
import { downloadTemp, print } from '../../actions/common';
import Restrict from '../controls/restrict';
import DateInput from '../controls/form/dateInput';
import permissions from '../../engine/permissions'
import { profile } from '../../actions/security';
import ContractMonitoringPrint from './contractMonitoringPrint';

class ContractMonitoring extends React.Component {
    static contextTypes = {
        router: React.PropTypes.object.isRequired,
        store: React.PropTypes.object.isRequired
    };

    state = {
        beginDate: new Date(),
        endDate: new Date(),
        branchId: this.props.auth.branchId,
        collateralType: 10,
        displayStatus: null,
        prolongDayCount: null,
        prolongDayCountOperator: null,
        loanCost: null,
        loanCostOperator: null,
        isTransferred: false
    };

    componentDidMount(){
        if (this.props.auth.isAuthenticated) {
            this.props.profile();
        }
    }

    onPrint = query => {
        if (!query) {
            query = this.props.query || {};
        }
        
        query.model = {
            beginDate: this.state.beginDate || null,
            endDate: this.state.endDate || null,
            branchId: this.state.branchId || null,
            collateralType: this.state.collateralType || null,
            displayStatus: this.state.displayStatus || null,
            prolongDayCount: this.state.prolongDayCount && {
                value: this.state.prolongDayCount,
                operator: this.state.prolongDayCountOperator || 20
            } || null,
            loanCost: this.state.loanCost && {
                value: this.state.loanCost,
                operator: this.state.loanCostOperator || 20
            } || null,
            isTransferred: this.state.isTransferred || false
        };
        
        this.props.contractMonitoring(query)
            .then(action => {
                if (action && action.data) {
                    this.props.print(<ContractMonitoringPrint data={action.data} />);
                }
            });
    };

    onExport = query => {
        if (!query) {
            query = this.props.query || {};
        }

        query.model = {
            beginDate: this.state.beginDate || null,
            endDate: this.state.endDate || null,
            branchId: this.state.branchId || null,
            collateralType: this.state.collateralType || null,
            displayStatus: this.state.displayStatus || null,
            prolongDayCount: this.state.prolongDayCount && {
                value: this.state.prolongDayCount,
                operator: this.state.prolongDayCountOperator || 20
            } || null,
            loanCost: this.state.loanCost && {
                value: this.state.loanCost,
                operator: this.state.loanCostOperator || 20
            } || null,
            isTransferred: this.state.isTransferred || false
        };
        
        this.props.exportContractMonitoring(query)
            .then(action => {
                if (action && action.data) {
                    this.context.store.dispatch(downloadTemp(action.data));
                }
            });
    };

    render = () => (
        <div style={{margin:20}}>
            <div className="row form-group">
                <div className="col-sm-2">
                    <label>Дата с</label>
                </div>
                <div className="col-sm-4">
                    <DateInput className="form-control" placeholder="Дата" onChange={e => {
                        this.setState({
                            beginDate: e
                        });
                    }} value={this.state.beginDate} />
                </div>
                <div className="col-sm-2">
                    <label>по</label>
                </div>
                <div className="col-sm-4">
                    <DateInput className="form-control" placeholder="Дата" onChange={e => {
                        this.setState({
                            endDate: e
                        });
                    }} value={this.state.endDate} />
                </div>
            </div>
            <div className="row form-group">
                <div className="col-sm-2">
                    <label>Филиал</label>
                </div>
                <div className="col-sm-4">
                    <select className="form-control"
                            onChange={e => {
                                this.setState({
                                    branchId: e.target.value
                                });
                            }}>
                        {this.props.auth.profile.branches.map(b =>
                          <option selected={b.id == this.state.branchId} value={b.id}>{b.displayName}</option>  
                        )}
                    </select>
                </div>
                <div className="col-sm-2">
                    <label>Вид залога</label>
                </div>
                <div className="col-sm-4">
                    <select className="form-control"
                            onChange={e => {
                                this.setState({
                                    collateralType: e.target.value
                                });
                            }}>
                        <option selected={this.state.collateralType == 10} value="10">Золото</option>
                        <option selected={this.state.collateralType == 20} value="20">Автотранспорт</option>
                        <option selected={this.state.collateralType == 30} value="30">Товар</option>
                        <option selected={this.state.collateralType == 40} value="40">Спецтехника</option>
                    </select>
                </div>
            </div>
            <div className="row form-group">
                <div className="col-sm-8">
                    <select className="form-control"
                        onChange={e => {
                            this.state.displayStatus = e.target.value;
                    }}>
                        <option selected={!this.state.displayStatus} value="">Статус</option>
                        <option selected={this.state.displayStatus == 0} value="0">Новый</option>
                        <option selected={this.state.displayStatus == 10} value="10">Открыт</option>
                        <option selected={this.state.displayStatus == 20} value="20">Просрочен</option>
                        <option selected={this.state.displayStatus == 30} value="30">Продлен</option>
                        <option selected={this.state.displayStatus == 40} value="40">Выкуплен</option>
                        <option selected={this.state.displayStatus == 50} value="50">На реализации</option>
                        <option selected={this.state.displayStatus == 60} value="60">Удален</option>
                        <option selected={this.state.displayStatus == 70} value="70">Действующие</option>
                    </select>
                </div>
                <div className="col-sm-4">
                    <InputGroup bsSize="sm" style={{width:'100%', paddingLeft:5}}>
                    <span className="input-group-addon">
                        <input type="checkbox" onChange={e => {
                            this.setState({
                                isTransferred: e.target.checked
                            });
                        }} checked={this.state.isTransferred} />
                    </span>
                        <input type="text" className="form-control" value="переданные" disabled />
                    </InputGroup>
                </div>
            </div>
            <div className="row form-group">
                <div className="col-sm-2">
                    <label>Дней просрочки</label>
                </div>
                <div className="col-sm-2">
                    <select className="form-control"
                            onChange={e => {
                                this.setState({
                                    prolongDayCountOperator: e.target.value
                                });
                            }}>
                        <option selected={this.state.prolongDayCountOperator == 10} value="10">{'<'}</option>
                        <option selected={this.state.prolongDayCountOperator == 20} value="20">{'='}</option>
                        <option selected={this.state.prolongDayCountOperator == 30} value="30">{'<>'}</option>
                        <option selected={this.state.prolongDayCountOperator == 40} value="30">{'>'}</option>
                    </select>                    
                </div>
                <div className="col-sm-2">
                    <input type="number" min="0" max="200" className="form-control" onChange={e => {
                        this.setState({
                            prolongDayCount: e.target.value
                        });
                    }} value={this.state.prolongDayCount} />
                </div>
                <div className="col-sm-2">
                    <label>Ссуда</label>
                </div>
                <div className="col-sm-2">
                    <select className="form-control"
                            onChange={e => {
                                this.setState({
                                    loanCostOperator: e.target.value
                                });
                            }}>
                        <option selected={this.state.loanCostOperator == 10} value="10">{'<'}</option>
                        <option selected={this.state.loanCostOperator == 20} value="20">{'='}</option>
                        <option selected={this.state.loanCostOperator == 30} value="30">{'<>'}</option>
                        <option selected={this.state.loanCostOperator == 40} value="30">{'>'}</option>
                    </select>                    
                </div>
                <div className="col-sm-2">
                    <input type="number" min="0" max="10000000" className="form-control" onChange={e => {
                        this.setState({
                            loanCost: e.target.value
                        });
                    }} value={this.state.loanCost} />
                </div>
            </div>
            <div className="row">
                <div className="col-sm-12">
                    <div className="pull-right">
                        <Button onClick={e => this.onPrint()}><Glyphicon glyph="print"/> Печать</Button>
                        <Button onClick={e => this.onExport()}><Glyphicon glyph="print"/> Excel</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default connect((state) => {
    const { workspace, auth } = state;
    
    return { 
        list: workspace.list,
        query: workspace.query, 
        auth: auth,
    }
}, { contractMonitoring, exportContractMonitoring, print, profile })(ContractMonitoring);