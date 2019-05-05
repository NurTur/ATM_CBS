import React from 'react';
import { Button, Glyphicon } from 'react-bootstrap';
import { connect } from 'react-redux';
import { profile } from '../../actions/security';
import { html, excel } from '../../actions/common';

class ExpenseMonthReport extends React.Component {
    static contextTypes = {
        router: React.PropTypes.object.isRequired,
        store: React.PropTypes.object.isRequired
    };

    state = {
        month: (new Date()).getMonth() + 1,
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
            reportName: 'ExpenseMonthReport',
            reportQuery: {
                month: (new Date()).getMonth() + 1,
                year: (new Date()).getFullYear(),
                branchId: this.state.branchId || 0
            }
        };

        this.props.html(query);
    }

    onExport = () => {
        let query = {
            reportName: 'ExpenseMonthReport',
            reportQuery: {
                month: (new Date()).getMonth() + 1,
                year: (new Date()).getFullYear(),
                branchId: this.state.branchId || 0
            }
        };

        this.props.excel(query);
    }

    render = () => (
        <div style={{margin:20}}>
            <div className="row form-group">
                <div className="col-sm-2">
                    <label>Месяц</label>
                </div>
                <div className="col-sm-4">
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
}, { profile, html, excel })(ExpenseMonthReport);