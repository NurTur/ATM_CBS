import React from 'react';
import { Button, Glyphicon } from 'react-bootstrap';
import { connect } from 'react-redux';
import { profile } from '../../actions/security';
import { html, excel } from '../../actions/common';

class ExpenseYearReport extends React.Component {
    static contextTypes = {
        router: React.PropTypes.object.isRequired,
        store: React.PropTypes.object.isRequired
    };

    state = {
        year: (new Date()).getFullYear(),
        branchId: this.props.auth.branchId
    };

    componentDidMount(){
        if (this.props.auth.isAuthenticated) {
            this.props.profile();
        }
    }

    onPrint = () => {
        let query = {
            reportName: 'ExpenseYearReport',
            reportQuery: {
                year: this.state.year || (new Date()).getFullYear(),
                branchId: this.state.branchId || 0
            }
        };

        this.props.html(query);
    }

    onExport = () => {
        let query = {
            reportName: 'ExpenseYearReport',
            reportQuery: {
                year: this.state.year || (new Date()).getFullYear(),
                branchId: this.state.branchId || 0
            }
        };

        this.props.excel(query);
    }

    render = () => (
        <div style={{margin:20}}>
            <div className="row form-group">
                <div className="col-sm-2">
                    <label>Год</label>
                </div>
                <div className="col-sm-4">
                    <input type="number" min="2015" max="2020" className="form-control" onChange={e => {
                        this.setState({
                            year: e.target.value
                        });
                    }} value={this.state.year} />
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
                        <option selected={!this.state.branchId} value="0">Филиал</option>
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
}, { profile, html, excel })(ExpenseYearReport);