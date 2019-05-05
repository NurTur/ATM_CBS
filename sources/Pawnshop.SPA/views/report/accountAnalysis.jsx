import React, { PropTypes } from 'react';
import { Table, Column } from '../controls/table';
import { ButtonGroup, Button, Glyphicon, InputGroup } from 'react-bootstrap';
import { connect } from 'react-redux';
import { accountAnalysis, accountAnalysisList as listLoad, cashOrders as cashOrdersLoad, exportAccountAnalysis } from '../../actions/reports';
import { accounts as accountsLoad } from '../../actions/dictionaries';
import { downloadTemp, print } from '../../actions/common';
import { profile } from '../../actions/security';
import { changeWorkspace } from '../../actions/workspace';
import DateInput from '../controls/form/dateInput';
import AccountAnalysisPrint from './accountAnalysisPrint';
import CashOrdersPrint from '../cashOrder/cashOrdersPrint';

class AccountAnalysis extends React.Component {
    constructor(props, context, queue) {
        super(props, context, queue);

        this.onLoad({});
        if (!this.props.accounts.length) {
            this.props.accountsLoad();
        }
    }

    static contextTypes = {
        router: PropTypes.object.isRequired,
        store: React.PropTypes.object.isRequired
    };

    state = {
        month: (new Date()).getMonth() + 1,
        year: (new Date()).getFullYear(),
        branchId: this.props.auth.branchId,
        accountId: null
    };

    componentDidMount(){
        if (this.props.auth.isAuthenticated) {
            this.props.profile();
        }
    }

    onDebitCashOrders(accountId) {
        let query = {
            model: {
                month: this.state.month || null,
                year: this.state.year || null,
                branchId: this.state.branchId || null,
                debitAccountId: accountId || null
            }
        };

        if (!query.model.month) return;
        if (!query.model.year) return;
        if (!query.model.branchId) return;
        if (!query.model.debitAccountId) return;

        this.props.cashOrdersLoad(query)
            .then(action => {
                if (action && action.data) {
                    this.props.print(<CashOrdersPrint data={action.data} auth={this.props.auth} />);
                }
            });
    };

    onCreditCashOrders(accountId) {
        let query = {
            model: {
                month: this.state.month || null,
                year: this.state.year || null,
                branchId: this.state.branchId || null,
                creditAccountId: accountId || null
            }
        };

        if (!query.model.month) return;
        if (!query.model.year) return;
        if (!query.model.branchId) return;
        if (!query.model.creditAccountId) return;

        this.props.cashOrdersLoad(query)
            .then(action => {
                if (action && action.data) {
                    this.props.print(<CashOrdersPrint data={action.data} auth={this.props.auth} />);
                }
            });
    };

    onLoad = query => {
        if (!query) {
            query = this.props.query || {};
        }

        if (query.clean) {
            this.state = {
                month: (new Date()).getMonth() + 1,
                year: (new Date()).getFullYear(),
                branchId: this.props.auth.branchId,
                accountId: null
            };
            query.clean = undefined;
        }

        query.model = {
            month: this.state.month || null,
            year: this.state.year || null,
            branchId: this.state.branchId || null,
            accountId: this.state.accountId || null
        };

        if (!query.model.month) return;
        if (!query.model.year) return;
        if (!query.model.branchId) return;
        if (!query.model.accountId) return;

        this.props.listLoad(query);
    };

    onPrint = query => {
        if (!query) {
            query = this.props.query || {};
        }

        query.model = {
            month: this.state.month || null,
            year: this.state.year || null,
            branchId: this.state.branchId || null,
            accountId: this.state.accountId || null
        };

        if (!query.model.month) return;
        if (!query.model.year) return;
        if (!query.model.branchId) return;
        if (!query.model.accountId) return;

        this.props.accountAnalysis(query)
            .then(action => {
                if (action && action.data) {
                    this.props.print(<AccountAnalysisPrint data={action.data} />);
                }
            });
    };

    onExport = query => {
        if (!query) {
            query = this.props.query || {};
        }

        query.model = {
            month: this.state.month || null,
            year: this.state.year || null,
            branchId: this.state.branchId || null,
            accountId: this.state.accountId || null
        };

        if (!query.model.month) return;
        if (!query.model.year) return;
        if (!query.model.branchId) return;
        if (!query.model.accountId) return;

        this.props.exportAccountAnalysis(query)
            .then(action => {
                if (action && action.data) {
                    this.context.store.dispatch(downloadTemp(action.data));
                }
            });
    };

    render = () => (
        <div>
            <Table data={this.props.list} query={this.props.query}
                   onLoad={this.onLoad} actions={this.renderActions()} filters={this.renderFilters()}>
                <Column name="AccountName" title="Наименование счета" sort={false} />
                <Column name="AccountCode" title="Счет" sort={false} />
                <Column name="FromCredit" title="С кредита счетов" sort={false} template={
                    row => <a onClick={e => this.onCreditCashOrders(row.AccountId)}>{row.FromCredit}</a>
                } />
                <Column name="ToDebit" title="В дебет счетов" sort={false} template={
                    row => <a onClick={e => this.onDebitCashOrders(row.AccountId)}>{row.ToDebit}</a>
                } />
            </Table>
        </div>
    );

    renderActions = () =>
        <ButtonGroup bsSize="sm">
            <Button onClick={e => this.onPrint()}><Glyphicon glyph="print"/> Печать</Button>
            <Button onClick={e => this.onExport()}><Glyphicon glyph="print"/> Excel</Button>
        </ButtonGroup>;

    renderFilters = () => [
        <div className="row">
            <div className="col-sm-3">
                <div style={{paddingLeft:5}}>
                    <select className="form-control"
                            onChange={e => {
                                this.setState({
                                    month: e.target.value
                                });
                            }}>
                        <option selected={this.state.month == 1} value="1">Январь</option>
                        <option selected={this.state.month == 2} value="2">Февраль</option>
                        <option selected={this.state.month == 3} value="3">Март</option>
                        <option selected={this.state.month == 4} value="4">Апрель</option>
                        <option selected={this.state.month == 5} value="5">Май</option>
                        <option selected={this.state.month == 6} value="6">Июнь</option>
                        <option selected={this.state.month == 7} value="7">Июль</option>
                        <option selected={this.state.month == 8} value="8">Август</option>
                        <option selected={this.state.month == 9} value="9">Сентябрь</option>
                        <option selected={this.state.month == 10} value="10">Октябрь</option>
                        <option selected={this.state.month == 11} value="11">Ноябрь</option>
                        <option selected={this.state.month == 12} value="12">Декабрь</option>
                    </select>
                </div>
            </div>
            <div className="col-sm-3">
                <input type="number" min="2015" max="2020" className="form-control" onChange={e => {
                    this.setState({
                        year: e.target.value
                    });
                }} value={this.state.year} />
            </div>
            <div className="col-sm-3">
                <InputGroup bsSize="sm" style={{width:'100%', paddingLeft:5}}>
                    <select className="form-control"
                            onChange={e => {
                                this.setState({
                                    branchId: e.target.value
                                });
                                this.onLoad();
                            }}>
                        {this.props.auth.profile.branches.map(b =>
                            <option selected={b.id == this.state.branchId} value={b.id}>{b.displayName}</option>
                        )}
                    </select>
                </InputGroup>
            </div>
            <div className="col-sm-3">
                <InputGroup bsSize="sm" style={{width:'100%', paddingLeft:5}}>
                    <select className="form-control"
                            onChange={e => {
                                this.setState({
                                    accountId: e.target.value
                                });
                                this.onLoad();
                            }}>
                        <option selected={!this.state.accountId} value="">Счет</option>
                        {this.props.accounts.map(a =>
                            <option selected={a.id == this.state.accountId} value={a.id}>{a.code} - {a.name}</option>
                        )}
                    </select>
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
        accounts: dictionary.accounts,
        auth: auth
    }
}, { accountAnalysis, listLoad, exportAccountAnalysis, accountsLoad, cashOrdersLoad, changeWorkspace, print, profile })(AccountAnalysis);