import React, { PropTypes } from 'react';
import { Table, Column } from '../controls/table';
import { ButtonGroup, Button, Glyphicon, InputGroup } from 'react-bootstrap';
import { connect } from 'react-redux';
import { list as listLoad, excel as excelLoad } from '../../actions/eventLogs';
import { downloadTemp } from '../../actions/common';
import DateInput from '../controls/form/dateInput';
import { profile } from '../../actions/security';
import classnames from 'classnames';
import { eventCodes as eventCodesLoad } from '../../actions/dictionaries';
import DictInput from '../controls/form/dictInput';
import Dialog from '../controls/dialog';
import EventLogForm from './eventLogForm';

class EventLogs extends React.Component {
    static contextTypes = {
        router: React.PropTypes.object.isRequired,
        store: React.PropTypes.object.isRequired
    };

    filter = {
        branchId: null,
        eventCode: null,
        beginDate: null,
        endDate: null,
        entityType: null,
        entityId: null
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
                branchId: null,
                eventCode: null,
                beginDate: null,
                endDate: null,
                entityType: null,
                entityId: null
            };
            query.clean = undefined;
        }

        query.filter = null;
        query.model = {
            branchId: this.filter.branchId || null,
            eventCode: this.filter.eventCode || null,
            beginDate: this.filter.beginDate || null,
            endDate: this.filter.endDate || null,
            entityType: this.props.entityType || this.filter.entityType || null,
            entityId: this.props.entityId || this.filter.entityId || null,
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

    _eventLogDialog = null;
    onEventDetails(row) {
        if (this._eventLogDialog) {
            this._eventLogDialog.show(null, true, row);
        }
    }

    render = () => (
        <div>
            <Table data={this.props.list} query={this.props.query}
                   onLoad={this.onLoad} actions={this.renderActions()} filters={this.renderFilters()}>
                <Column name="createDate" title="Дата" sort="desc" type="date" />
                <Column name="eventDescription" title="Событие" sort={true} />
                <Column name="branchName" title="Филиал" sort={true} />
                <Column name="userName" title="Пользователь" sort={true} />
                <Column name="address" title="IP адрес" sort={true} />
                <Column name="eventStatus" title="Статус" sort={true} template={
                    row =>
                        row.eventStatus == 0 && <span>Успешно</span> ||
                        row.eventStatus == 1 && <span>Не удачно</span>
                } />
                <Column actions={true} template={
                    row =>
                        <ButtonGroup bsSize="xs">
                            <Button onClick={e => this.onEventDetails(row)}><Glyphicon glyph="edit"/></Button>
                        </ButtonGroup>
                }/>
            </Table>

            <Dialog ref={r => this._eventLogDialog = r} title="Событие" form={true}>
                <EventLogForm />
            </Dialog>
        </div>
    );

    renderActions = () =>
        <ButtonGroup bsSize="sm">
            <Button onClick={e => this.onExport()}><Glyphicon glyph="print"/> Excel</Button>
        </ButtonGroup>;

    renderFilters = () => [
        <div className="row">
            <div className={classnames("col-sm-3", {
                "hidden": this.props.entityView,
            })}>
                <InputGroup bsSize="sm" style={{width:'100%', paddingLeft:5}}>
                    <select className="form-control"
                            onChange={e => {
                                this.filter.branchId = e.target.value;
                                this.onLoad();
                            }}>
                        <option selected={!this.filter.branchId} value="">Филиалы</option>
                        {this.props.auth.profile.branches.map(b =>
                            <option selected={this.filter.branchId == b.id} value={b.id}>{b.displayName}</option>)}
                    </select>
                </InputGroup>                
            </div>
            <div className={classnames("col-sm-3", {
                "hidden": this.props.entityView,
            })}>
                <DictInput className="form-control input-sm" dictionary="eventCodes" onLoad={eventCodesLoad}
                    display={(row, i) => row.name} input={{ value: this.filter.eventCode, onChange: e => { 
                            this.filter.eventCode = e.target.value;
                            this.onLoad(); 
                    } }} />
            </div>
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
        </div>,
        <div className="row">
        </div>
    ];
}

export default connect((state) => {
    const { workspace, auth } = state;

    return {
        list: workspace.list,
        query: workspace.query,
        auth: auth,
    }
}, { listLoad, excelLoad, eventCodesLoad, profile })(EventLogs);