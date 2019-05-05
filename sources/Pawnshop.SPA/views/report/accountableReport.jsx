import React from 'react';
import { Button, Glyphicon } from 'react-bootstrap';
import { connect } from 'react-redux';
import DateInput from '../controls/form/dateInput';
import { profile } from '../../actions/security';
import { html, excel } from '../../actions/common';
import { accounts as accountsLoad } from '../../actions/dictionaries';

class AccountableReport extends React.Component {
    static contextTypes = {
        router: React.PropTypes.object.isRequired,
        store: React.PropTypes.object.isRequired
    };

    state = {
        beginDate: new Date(),
        endDate: new Date(),
        branchId: this.props.auth.branchId,
        selectedAccounts: []
    };

    componentDidMount(){
        if (this.props.auth.isAuthenticated) {
            this.props.profile();
        }
        if (!this.props.accounts.length) {
            this.props.accountsLoad();
        }
    }

    onPrint = () => {
        let accountIds = [];
        let branchIds = [];
        var selectedAccounts = Array.prototype.slice.call( this.state.selectedAccounts || null )
        var selectedBranches = Array.prototype.slice.call( this.state.selectedBranches || null )
        if(selectedAccounts.length==0) {
            alert("Нужно выбрать хотя бы один номер счета");
            return;
        }
        if(selectedBranches.length==0) {
            alert("Нужно выбрать хотя бы один филиал");
            return;
        }
        selectedAccounts.map( x => {
            accountIds.push(x.value);
        });
        selectedBranches.map( x => {
            branchIds.push(x.value);
        });
        let query = {
            reportName: 'AccountableReport',
            reportQuery: {
                beginDate: this.state.beginDate || new Date(),
                endDate: this.state.endDate || new Date(),
                branchIds:  branchIds || null,
                accountIds: accountIds || null
            }
        };
        
        this.props.html(query);
    }

    onExport = () => {
        let accountIds = [];
        let branchIds = [];
        var selectedAccounts = Array.prototype.slice.call( this.state.selectedAccounts || null )
        var selectedBranches = Array.prototype.slice.call( this.state.selectedBranches || null )
        if(selectedAccounts.length==0) {
            alert("Нужно выбрать хотя бы один номер счета");
            return;
        }
        if(selectedBranches.length==0) {
            alert("Нужно выбрать хотя бы один филиал");
            return;
        }
        selectedAccounts.map( x => {
            accountIds.push(x.value);
        });
        selectedBranches.map( x => {
            branchIds.push(x.value);
        });
        let query = {
            reportName: 'AccountableReport',
            reportQuery: {
                beginDate: this.state.beginDate || new Date(),
                endDate: this.state.endDate || new Date(),
                branchIds:  branchIds || null,
                accountIds: accountIds || null
            }
        };

        this.props.excel(query);
    }


    render = () => (
        
        <div style={{margin:20}}>
            <div className="row form-group">
                <div className="col-sm-2">
                    <label>Дата с</label>
                </div>
                <div className="col-sm-4">
                    <DateInput className="form-control" placeholder="Дата с" onChange={e => {
                        this.setState({
                            beginDate: e
                        });
                    }} value={this.state.beginDate} />
                </div>
                <div className="col-sm-2">
                    <label>по</label>
                </div>
                <div className="col-sm-4">
                    <DateInput className="form-control" placeholder="по" onChange={e => {
                        this.setState({
                            endDate: e
                        });
                    }} value={this.state.endDate} />
                </div>
            </div>
            <div className="row form-group">
                <div className="col-sm-2">
                    <label>Филиалы</label>
                </div>
                <div className="col-sm-10">
                    <select id="accounts"  className="form-control" style={{height:"300"}}
                            onChange={e => {
                                this.setState({
                                    selectedBranches: e.target.selectedOptions
                                });
                            }}
                            multiple>
                        {this.props.auth.profile.branches.map(a =>
                            <option value={a.id}>{a.displayName}</option>
                        )}
                    </select>
                </div>
            </div>
            <div className="row form-group">
                <div className="col-sm-2">
                    <label>Счет</label>
                </div>
                <div className="col-sm-10">
                    <select id="accounts"  className="form-control" style={{height:"300"}}
                            onChange={e => {
                                this.setState({
                                    selectedAccounts: e.target.selectedOptions
                                });
                            }}
                            multiple>
                        {this.props.accounts.map(a =>
                            <option value={a.id}>{a.code} - {a.name}</option>
                        )}
                    </select>
                </div>
            </div>
            <div className="row form-group">
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
    const { dictionary, auth } = state;
    
    return { 
        accounts: dictionary.accounts,
        auth: auth
    }
}, { accountsLoad, profile, html, excel })(AccountableReport);