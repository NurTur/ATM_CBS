import React from 'react';
import { Button, Glyphicon } from 'react-bootstrap';
import { connect } from 'react-redux';
import { profile } from '../../actions/security';
import { html, excel } from '../../actions/common';

class DelayReport extends React.Component {
    static contextTypes = {
        router: React.PropTypes.object.isRequired,
        store: React.PropTypes.object.isRequired
    };

    state = {
        beginDelayCount: 1,
        endDelayCount: 5,
        collateralType: 10,
        branchId: this.props.auth.branchId
    };

    componentDidMount(){
        if (this.props.auth.isAuthenticated) {
            this.props.profile();
        }
    }

    onPrint = () => {
        let query = {
            reportName: 'DelayReport',
            reportQuery: {
                beginDelayCount: this.state.beginDelayCount || null,
                endDelayCount: this.state.endDelayCount || null,
                collateralType: this.state.collateralType || null,
                branchId: this.state.branchId || null
            }
        };

        this.props.html(query);
    }

    onExport = () => {
        let query = {
            reportName: 'DelayReport',
            reportQuery: {
                beginDelayCount: this.state.beginDelayCount || null,
                endDelayCount: this.state.endDelayCount || null,
                collateralType: this.state.collateralType || null,
                branchId: this.state.branchId || null
            }
        };

        this.props.excel(query);
    }

    render = () => (
        <div style={{margin:20}}>
            <div className="row form-group">
                <div className="col-sm-2">
                    <label>Дней просрочки с</label>
                </div>
                <div className="col-sm-4">
                    <input type="number" min="1" max="200" className="form-control" onChange={e => {
                        this.setState({
                            beginDelayCount: e.target.value
                        });
                    }} value={this.state.beginDelayCount} />
                </div>
                <div className="col-sm-2">
                    <label>по</label>
                </div>
                <div className="col-sm-4">
                    <input type="number" min="1" max="200" className="form-control" onChange={e => {
                        this.setState({
                            endDelayCount: e.target.value
                        });
                    }} value={this.state.endDelayCount} />
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
                        <option selected={this.state.collateralType == 10} value="10">Золото</option>
                        <option selected={this.state.collateralType == 20} value="20">Автотранспорт</option>
                        <option selected={this.state.collateralType == 30} value="30">Товары</option>
                        <option selected={this.state.collateralType == 40} value="40">Спецтехника</option>
                    </select>
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
        auth: auth,
    }
}, { profile, html, excel })(DelayReport);