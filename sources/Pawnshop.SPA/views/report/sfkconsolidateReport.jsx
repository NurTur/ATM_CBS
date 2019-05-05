import React from 'react';
import { Button, Glyphicon, InputGroup } from 'react-bootstrap';
import { connect } from 'react-redux';
import DateInput from '../controls/form/dateInput';
import { profile } from '../../actions/security';
import { html, excel } from '../../actions/common';

class SfkConsolidateReport extends React.Component {
    static contextTypes = {
        router: React.PropTypes.object.isRequired,
        store: React.PropTypes.object.isRequired
    };

    state = {
        beginDate: new Date(),
        endDate: new Date(),
        branchId: this.props.auth.branchId,
        isPeriod: false
    };

    componentDidMount(){
        if (this.props.auth.isAuthenticated) {
            this.props.profile();
        }
    }

    onPrint = () => {
        let query = {
            reportName: 'SfkConsolidateReport',
            reportQuery: {
                beginDate: this.state.beginDate || new Date(),
                endDate: this.state.endDate || new Date(),
                branchId: this.state.branchId || 0,
                isPeriod: this.state.isPeriod || false
            }
        };

        this.props.html(query);
    }

    onExport = () => {
        let query = {
            reportName: 'SfkConsolidateReport',
            reportQuery: {
                beginDate: this.state.beginDate || new Date(),
                endDate: this.state.endDate || new Date(),
                branchId: this.state.branchId || 0,
                isPeriod: this.state.isPeriod || false
            }
        };

        this.props.excel(query);
    }

    onIsPeriodChange(e){
        this.setState({ 
            isPeriod: e.target.checked 
        })
        console.log(e.target.value);
    }

    render = () => (
        <div style={{margin:20}}>
            <div className="row form-group">
                <div className="col-sm-2">
                    <InputGroup bsSize="sm" style={{width:'100%'}}>
                            <span className="input-group-addon">
                                <input type="checkbox" onChange={e => {
                                    this.onIsPeriodChange(e);
                                }} checked={this.state.isPeriod} />
                            </span>
                            <input type="text" className="form-control" value="за период" disabled />
                    </InputGroup>
                </div>
            </div>
            <div className="row form-group">
            <div hidden={this.state.isPeriod}>
                    <div className="col-sm-2">
                        <label>Состояние на</label>
                    </div>
                    <div className="col-sm-4">
                        <DateInput className="form-control" placeholder="Состояние на" onChange={e => {
                            this.setState({
                                beginDate: e
                            });
                        }} value={this.state.beginDate} />
                    </div>
                </div>

                <div hidden={!this.state.isPeriod}>
                <div className="col-sm-1">
                    <label>Дата с</label>
                </div>
                <div className="col-sm-2">
                    <DateInput className="form-control" placeholder="Дата с" onChange={e => {
                        this.setState({
                            beginDate: e
                        });
                    }} value={this.state.beginDate} />
                </div>
                <div className="col-sm-1">
                    <label>по</label>
                </div>
                <div className="col-sm-2">
                    <DateInput className="form-control" placeholder="по" onChange={e => {
                        this.setState({
                            endDate: e
                        });
                    }} value={this.state.endDate} />
                </div>
                </div>
            
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
                        <option selected={!this.state.branchId} value="">Все</option>
                        {this.props.auth.profile.branches.map(b =>
                            <option selected={b.id == this.state.branchId} value={b.id}>{b.displayName}</option>
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
}, { profile, html, excel })(SfkConsolidateReport);