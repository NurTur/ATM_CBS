import React, { PropTypes } from 'react';
import { Table, Column } from '../controls/table';
import { ButtonGroup, Button, Glyphicon, InputGroup, Dropdown, MenuItem } from 'react-bootstrap';
import { connect } from 'react-redux';
import { list as listLoad, card as cardLoad, cancel as cancelItem, excel as excelLoad } from '../../actions/sellings';
import { card as cashOrderLoad } from '../../actions/cashOrders';
import { purities as puritiesLoad } from '../../actions/dictionaries';
import { downloadTemp, print } from '../../actions/common';
import moment from 'moment';
import CashInOrderPrint from '../cashOrder/cashInOrderPrint';
import Confirmation from '../controls/confirmation';

import Restrict from '../controls/restrict';
import permissions from '../../engine/permissions'
import { profile } from '../../actions/security';
import DateInput from '../controls/form/dateInput';

class Sellings extends React.Component {
    static contextTypes = {
        router: React.PropTypes.object.isRequired,
        store: React.PropTypes.object.isRequired
    };

    filter = {
        beginDate: null,
        endDate: null,
        collateralType: null,
        status: null
    };

    componentDidMount(){
        if (this.props.auth.isAuthenticated) {
            this.props.profile();
        }
        if (!this.props.purities.length) {
            this.props.puritiesLoad();
        }
        this.onLoad({});
    }

    onLoad = query => {
        if (!query) {
            query = this.props.query || {};
        }

        if (query.clean) {
            this.filter = {
                beginDate: null,
                endDate: null,
                collateralType: null,
                status: null
            };
            query.clean = undefined;
        }

        query.model = {
            beginDate: this.filter.beginDate || null,
            endDate: this.filter.endDate || null,
            collateralType: this.filter.collateralType || null,
            status: this.filter.status || null,
        };
        this.props.listLoad(query);
    };

    onExport = () => {
        this.props.excelLoad(this.props.list.list)
            .then(action => {
                if (action && action.data) {
                    this.context.store.dispatch(downloadTemp(action.data));
                }
            });
    };

    onPrintCashOrder = (row) => {
        if (!row.cashOrderId) return;

        this.props.cashOrderLoad(row.cashOrderId).then(action => {
            if (action && action.data) {
                this.props.print(<CashInOrderPrint data={action.data} auth={this.props.auth} />);
            }
        });
    };

    _confirmation = null;
    render = () => (
        <div>
            <Table data={this.props.list} query={this.props.query}
                   onLoad={this.onLoad} actions={this.renderActions()} filters={this.renderFilters()}>
                <Column name="collateralType" title="Вид залога" sort={true} template={
                    row =>
                    row.collateralType == 10 && <span>Золото</span> ||
                    row.collateralType == 20 && <span>Автотранспорт</span> ||
                    row.collateralType == 30 && <span>Товар</span> ||
                    row.collateralType == 40 && <span>Спецтехника</span>
                } />
                <Column name="createDate" title="Дата" sort="desc" type="date" />
                <Column name="position.name" title="Изделие" sort={true} template={
                    row => row.position.name
                } />
                <Column name="priceCost" title="Себестоимость" sort={true} />
                <Column name="positionSpecific" title="Общий вес" template={
                    row => row.positionSpecific ? row.positionSpecific.collateralTotalWeight : null
                } />
                <Column name="positionSpecific" title="Чистый вес" template={
                    row => row.positionSpecific ? row.positionSpecific.collateralSpecificWeight : null
                } />
                <Column name="positionSpecific" title="Проба" template={
                    row => row.positionSpecific ?
                        (
                            row.positionSpecific.purityId ?
                                this.props.purities[this.props.purities.map(e => e.id).indexOf(row.positionSpecific.purityId)].name :
                                null
                        ) :
                        null
                } />
                <Column name="note" title="Примечания" sort={true} />
                <Column name="sellingCost" title="Цена продажи" sort={true} type="number" />
                <Column name="sellingDate" title="Дата продажи" sort={true} template={
                    row => row.sellingDate ? moment(row.sellingDate).format('L') : null
                } />
                <Column name="status" title="Статус" sort={true} template={
                    row =>
                    row.status == 10 && <span>В наличии</span> ||
                    row.status == 20 && <span>Продано</span>
                } />
                <Column actions={true} template={
                    row =>
                        <ButtonGroup bsSize="xs">
                            <Button onClick={e =>
                                this.onPrintCashOrder(row)
                            } disabled={row.status < 20}><Glyphicon glyph="print" title="Печать кассового ордера"/></Button>
                            <Restrict permissions={permissions.SellingManage}>
                                <Button onClick={e =>
                                    this.context.router.push(`/sellings/${row.id}`)
                                } disabled={row.status > 10}><Glyphicon glyph="ok" title="Продано"/></Button>
                            </Restrict>
                            <Restrict permissions={permissions.SellingManage}>
                                <Button onClick={e => {
                                    this._confirmation.show("Вы действительно хотите отменить продажу?",
                                        () => this.props.cancelItem(row.id)
                                            .then(action => this.onLoad(this.props.query))
                                    );
                                }} disabled={row.status < 20}><Glyphicon glyph="remove" title="Отмена"/></Button>
                            </Restrict>
                        </ButtonGroup>
                } />
            </Table>

            <Confirmation ref={r => this._confirmation = r} />
        </div>
    );

    renderActions = () =>
        <ButtonGroup bsSize="sm">
            <Button onClick={e => this.onExport()}><Glyphicon glyph="print"/> Excel</Button>
        </ButtonGroup>;

    renderFilters = () => [
        <div className="row">
            <div className="col-sm-3">
                <div style={{paddingLeft:5}}>
                    <DateInput className="form-control input-sm" placeholder="Дата с..." onChange={e => {
                        this.filter.beginDate = e;
                        this.onLoad();
                    }} value={this.filter.beginDate} />
                </div>
            </div>
            <div className="col-sm-3">
                <DateInput className="form-control input-sm" placeholder="Дата по..." onChange={e => {
                    this.filter.endDate = e;
                    this.onLoad();
                }} value={this.filter.endDate} />
            </div>
            <div className="col-sm-3">
                <InputGroup bsSize="sm" style={{width:'100%'}}>
                    <select className="form-control"
                            onChange={e => {
                                this.filter.collateralType = e.target.value;
                                this.onLoad();
                            }}>
                        <option selected={!this.filter.collateralType} value="">Вид залога</option>
                        <option selected={this.filter.collateralType == 10} value="10">Золото</option>
                        <option selected={this.filter.collateralType == 20} value="20">Автотранспорт</option>
                        <option selected={this.filter.collateralType == 30} value="30">Товар</option>
                        <option selected={this.filter.collateralType == 40} value="40">Спецтехника</option>
                    </select>
                </InputGroup>
            </div>
            <div className="col-sm-3">
                <InputGroup bsSize="sm" style={{width:'100%'}}>
                    <select className="form-control"
                            onChange={e => {
                                this.filter.status = e.target.value;
                                this.onLoad();
                            }}>
                        <option selected={!this.filter.status} value="">Статус</option>
                        <option selected={this.filter.status == 10} value="10">В наличии</option>
                        <option selected={this.filter.status == 20} value="20">Продано</option>
                    </select>
                </InputGroup>
            </div>
        </div>,
    ];
}

export default connect((state) => {
    const { workspace, dictionary, auth } = state;
    
    return { 
        list: workspace.list,
        query: workspace.query, 
        purities: dictionary.purities,
        auth: auth,
    }
}, { listLoad, cardLoad, cancelItem, excelLoad, puritiesLoad, cashOrderLoad, print, profile })(Sellings);