import React from 'react';
import { Button, Glyphicon } from 'react-bootstrap';
import { connect } from 'react-redux';
import DateInput from '../controls/form/dateInput';
import { profile } from '../../actions/security';
import { html, excel } from '../../actions/common';

class SellingReport extends React.Component {
    static contextTypes = {
        router: React.PropTypes.object.isRequired,
        store: React.PropTypes.object.isRequired
    };

    state = {
        beginDate: new Date(),
        endDate: new Date(),
        branchId: this.props.auth.branchId,
        status: null,
    };

    componentDidMount(){
        if (this.props.auth.isAuthenticated) {
            this.props.profile();
        }
    }

    onPrint = () => {
        let query = {
            reportName: 'SellingReport',
            reportQuery: {
                beginDate: this.state.beginDate || null,
                endDate: this.state.endDate || null,
                branchId: this.state.branchId || null,
                status: this.state.status || null,
            }
        };

        this.props.html(query);
    }

    onExport = () => {
        let query = {
            reportName: 'SellingReport',
            reportQuery: {
                beginDate: this.state.beginDate || null,
                endDate: this.state.endDate || null,
                branchId: this.state.branchId || null,
                status: this.state.status || null,
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
                    <label>Статус</label>
                </div>
                <div className="col-sm-4">
                    <select className="form-control"
                            onChange={e => {
                                this.setState({
                                    status: e.target.value
                                });
                            }}>
                        <option selected={!this.state.status} value="">Все</option>
                        <option selected={this.state.status == 10} value="10">В наличии</option>
                        <option selected={this.state.status == 20} value="20">Продано</option>
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
        auth: auth,
    }
}, { profile, html, excel })(SellingReport);