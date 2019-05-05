import React from 'react';
import { Table, Column } from '../controls/table';
import { ButtonGroup, Button, Glyphicon, InputGroup } from 'react-bootstrap';
import { connect } from 'react-redux';
import { list as listLoad, card as cardLoad, remove as removeItem } from '../../actions/insurances';
import Restrict from '../controls/restrict';
import DateInput from '../controls/form/dateInput';
import permissions from '../../engine/permissions'
import { profile } from '../../actions/security';
import Confirmation from '../controls/confirmation';
import moment from 'moment';

class Insurances extends React.Component {
    static contextTypes = {
        router: React.PropTypes.object.isRequired,
        store: React.PropTypes.object.isRequired
    };

    filter = {
        beginDate: null,
        endDate: null,
        status: null,
    };

    componentDidMount(){
        if (this.props.auth.isAuthenticated) {
            this.props.profile();
        }
        this.onLoad();
    }

    onLoad = query => {
        if (!query) {
            query = this.props.query || {};
        }

        if (query.clean) {
            this.filter = {
                beginDate: null,
                endDate: null,
                status: null
            };
            query.clean = undefined;
        }

        query.model = {
            beginDate: this.filter.beginDate || null,
            endDate: this.filter.endDate || null,
            status: this.filter.collateralType || null
        };
        this.props.listLoad(query);
    };

    _confirmation = null;
    render = () => (
        <div>
            <Table data={this.props.list} query={this.props.query}
                   onLoad={this.onLoad} filters={this.renderFilters()}>
                <Column name="contract.contractDate" title="Дата кредита" sort="desc" type="date" template={
                    row => moment(row.contract.contractDate).format('L')
                } />
                <Column name="insuranceNumber" title="№" sort={true} template={
                    row => <a onClick={e => this.context.router.push(`/insurances/${row.id}`)}>{row.insuranceNumber}</a>
                } />
                <Column name="contract.contractData.client.fullname" title="Клиент" sort={true} template={
                    row => <a onClick={e => this.context.router.push(`/insurances/${row.id}`)}>{row.contract.contractData.client.fullname}</a>
                } />
                <Column name="insuranceCost" title="Сумма" sort={true} type="number" />
                <Column name="status" title="Статус" sort={true} template={
                    row =>
                        row.status == 0 && <span>Черновик</span> ||
                        row.status == 10 && <span>Подписан</span> ||
                        row.status == 20 && <span>Оплачен</span> ||
                        row.status == 30 && <span>Закрыт</span>
                } />
                <Column actions={true} template={
                    row =>
                        <ButtonGroup bsSize="xs">
                            <Button onClick={e => this.context.router.push(`/insurances/${row.id}`)}><Glyphicon glyph="edit"/></Button>
                            <Restrict permissions={permissions.InsuranceManage}>
                                <Button onClick={e => {
                                    this._confirmation.show("Вы действительно хотите удалить запись?",
                                        () => this.props.removeItem(row.id)
                                            .then(action => this.onLoad(this.props.query))
                                    );
                                }} disabled={row.status > 0}><Glyphicon glyph="remove"/></Button>
                            </Restrict>
                        </ButtonGroup>
                } />
            </Table>

            <Confirmation ref={r => this._confirmation = r} />
        </div>
    );

    renderFilters = () => [
        <div className="row form-group">
            <div className="col-sm-4">
                <div style={{paddingLeft:5}}>
                    <DateInput className="form-control input-sm" placeholder="Дата с..." onChange={e => {
                        this.filter.beginDate = e;
                        this.onLoad();
                    }} value={this.filter.beginDate} />
                </div>
            </div>
            <div className="col-sm-4">
                <DateInput className="form-control input-sm" placeholder="Дата по..." onChange={e => {
                    this.filter.endDate = e;
                    this.onLoad();
                }} value={this.filter.endDate} />
            </div>
            <div className="col-sm-4">
                <InputGroup bsSize="sm" style={{width:'100%'}}>
                    <select className="form-control"
                            onChange={e => {
                                this.filter.status = e.target.value;
                                this.onLoad();
                            }}>
                        <option selected={!this.filter.status} value="">Статус</option>
                        <option selected={this.filter.status == 0} value="0">Черновик</option>
                        <option selected={this.filter.status == 10} value="10">Подписан</option>
                        <option selected={this.filter.status == 20} value="20">Оплачен</option>
                        <option selected={this.filter.status == 30} value="30">Закрыт</option>
                    </select>
                </InputGroup>
            </div>
        </div>,
    ];
}

export default connect((state) => {
    const { insurance, auth } = state;

    return {
        list: insurance.list,
        query: insurance.query,
        auth: auth,
    }
}, { listLoad, cardLoad, removeItem, profile })(Insurances);