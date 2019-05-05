import React from 'react';
import { Button, Glyphicon } from 'react-bootstrap';
import { connect } from 'react-redux';
import DateInput from '../controls/form/dateInput';
import { profile } from '../../actions/security';
import { html, excel } from '../../actions/common';

class RegionMonitoringReport extends React.Component {
    static contextTypes = {
        router: React.PropTypes.object.isRequired,
        store: React.PropTypes.object.isRequired
    };

    state = {
        beginDate: new Date(),
        selectedBranches: []
    };

    componentDidMount(){
        if (this.props.auth.isAuthenticated) {
            this.props.profile();
        }
    }

    onPrint = () => {
        let branchIds = [];
        var selectedBranches = Array.prototype.slice.call( this.state.selectedBranches || null )
        if(selectedBranches.length==0) {
            alert("Нужно выбрать хотя бы один филиал");
            return;
        }
        selectedBranches.map( x => {
            branchIds.push(x.value);
        });
        let query = {
            reportName: 'RegionMonitoringReport',
            reportQuery: {
                beginDate: this.state.beginDate || null,
                branchIds:  branchIds || null
            }
        };
        
        this.props.html(query);
    }

    onExport = () => {
        let branchIds = [];
        var selectedBranches = Array.prototype.slice.call( this.state.selectedBranches || null )
        if(selectedBranches.length==0) {
            alert("Нужно выбрать хотя бы один филиал");
            return;
        }
        selectedBranches.map( x => {
            branchIds.push(x.value);
        });
        let query = {
            reportName: 'RegionMonitoringReport',
            reportQuery: {
                beginDate: this.state.beginDate || null,
                branchIds:  branchIds || null
            }
        };

        this.props.excel(query);
    }


    render = () => (
        
        <div style={{margin:20}}>
            <div className="row form-group">
                <div className="col-sm-4">
                    <label>Дата</label>
                </div>
                <div className="col-sm-8">
                    <DateInput className="form-control" placeholder="Дата" onChange={e => {
                        this.setState({
                            beginDate: e
                        });
                    }} value={this.state.beginDate} />
                </div>
            </div>
            <div className="row form-group">
                <div className="col-sm-4">
                    <label>Филиалы</label>
                </div>
                <div className="col-sm-8">
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
    const { auth } = state;
    
    return { 
        auth: auth
    }
}, { profile, html, excel })(RegionMonitoringReport);