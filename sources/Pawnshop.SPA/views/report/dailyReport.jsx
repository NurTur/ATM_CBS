import React from 'react';
import { Button, Glyphicon } from 'react-bootstrap';
import { connect } from 'react-redux';
import DateInput from '../controls/form/dateInput';
import { profile } from '../../actions/security';
import { html, excel } from '../../actions/common';

class DailyReport extends React.Component {
    static contextTypes = {
        router: React.PropTypes.object.isRequired,
        store: React.PropTypes.object.isRequired
    };

    state = {
        currentDate: new Date(),
        branchId: this.props.auth.branchId
    };

    componentDidMount(){
        if (this.props.auth.isAuthenticated) {
            this.props.profile();
        }
    }

    onPrint = () => {
        let query = {
            reportName: 'DailyReport',
            reportQuery: {
                currentDate: this.state.currentDate || null,
                branchId: this.state.branchId || null
            }
        };

        this.props.html(query);
    }

    onExport = () => {
        let query = {
            reportName: 'DailyReport',
            reportQuery: {
                currentDate: this.state.currentDate || null,
                branchId: this.state.branchId || null
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
                            currentDate: e
                        });
                    }} value={this.state.currentDate} />
                </div>
            </div>
            <div className="row form-group">
                <div className="col-sm-4">
                    <label>Филиал</label>
                </div>
                <div className="col-sm-8">
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
}, { profile, html, excel })(DailyReport);