import React from 'react';
import { Button, Glyphicon } from 'react-bootstrap';
import { connect } from 'react-redux';
import DateInput from '../controls/form/dateInput';
import { html, excel } from '../../actions/common';

class ConsolidateProfitReport extends React.Component {
    static contextTypes = {
        router: React.PropTypes.object.isRequired,
        store: React.PropTypes.object.isRequired
    };

    state = {
        beginDate: new Date(),
        endDate: new Date(),
        collateralType: 0
    };

    onPrint = () => {
        let query = {
            reportName: 'ConsolidateProfitReport',
            reportQuery: {
                beginDate: this.state.beginDate || new Date(),
                endDate: this.state.endDate || new Date(),
                collateralType: this.state.collateralType || 0
            }
        };

        this.props.html(query);
    }

    onExport = () => {
        let query = {
            reportName: 'ConsolidateProfitReport',
            reportQuery: {
                beginDate: this.state.beginDate || new Date(),
                endDate: this.state.endDate || new Date(),
                collateralType: this.state.collateralType || 0
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
                    <label>Вид залога</label>
                </div>
                <div className="col-sm-4">
                    <select className="form-control"
                            onChange={e => {
                                this.setState({
                                    collateralType: e.target.value
                                });
                            }}>
                        <option selected={!this.state.collateralType} value="0">Все</option>
                        <option selected={this.state.collateralType == 10} value="10">Золото</option>
                        <option selected={this.state.collateralType == 20} value="20">Авто</option>
                        <option selected={this.state.collateralType == 30} value="30">Товары</option>
                        <option selected={this.state.collateralType == 40} value="40">Спецтехника</option>
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
}, { html, excel })(ConsolidateProfitReport);