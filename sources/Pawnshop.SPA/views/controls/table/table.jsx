import React, { PropTypes, Children } from 'react';
import { ButtonToolbar } from 'react-bootstrap';
import classnames from 'classnames';
import SearchGroup from './searchGroup';
import PagerGroup from './pagerGroup';

export default class PawnshopTable extends React.Component {
    static propTypes = {
        onLoad: PropTypes.func,

        data: PropTypes.any,
        query: PropTypes.object,
        pageSize: PropTypes.number,

        actions: PropTypes.object,

        showPager: PropTypes.bool,
        showFilter: PropTypes.bool,
        showActions: PropTypes.bool,

        empty: PropTypes.any,
        simple: PropTypes.bool
    };

    static defaultProps = {
        onLoad: null,

        data: null,
        query: null,
        pageSize: 20,

        actions: null,

        showPager: true,
        showFilter: true,
        showActions: true,

        empty: 'Нет данных',
        simple: false
    };

    state = {
        data: null
    };

    componentDidMount() {
        this._init(this.props);
    }

    componentWillReceiveProps(props) {
        this._init(props);
    }

    _init(props) {
        let data = props.data;
        if (!data) return;

        if (props.simple) {
            this.setState({
                data: {
                    list: data,
                    count: data.length
                }
            })
        } else {
            this.setState({
                data: data
            })
        }
    }

    onFilter = filter => this.onLoad(0, filter, this.props.query && this.props.query.sort);
    onPaging = offset => this.onLoad(offset, this.props.query && this.props.query.filter, this.props.query && this.props.query.sort);
    onClean = () => this.onLoad(0, null, null, true);
    onSorting = sort => this.onLoad(0, this.props.query && this.props.query.filter, sort);

    onLoad = (offset, filter, sort, clean) => {
        if (this.props.onLoad) {
            this.props.onLoad({
                page: { offset: offset, limit: this.props.pageSize },
                filter: filter,
                sort: sort,
                clean: clean
            })
        }
    };

    render = () => {

        let loadEnabled = !!this.props.onLoad;
        let dataEnabled = !!this.state.data && !!this.state.data.count;
        let pagerEnabled = this.props.showPager && loadEnabled;
        let filterEnabled = this.props.showFilter && loadEnabled;
        let actionsEnabled = this.props.showActions && !!this.props.actions;
        let dataLoaded = dataEnabled && this.state.data.list && this.state.data.list.length;

        return (
            <table className={classnames('table table-bordered', this.props.className)}>
                <thead>
                    {this.renderTools(pagerEnabled, filterEnabled, actionsEnabled)}
                    {this.props.filters && this.renderFilters()}
                    {this.renderHeadRow()}
                </thead>
                <tbody>
                    {dataLoaded ? this.state.data.list.map(this.renderBodyRow) : this.renderBodyEmpty()}
                </tbody>
                <tfoot>
                    {this.renderTools(pagerEnabled, false, false)}
                </tfoot>
            </table>
        );
    };

    renderTools = (pagerEnabled, filterEnabled, actionsEnabled) => {
        if (!pagerEnabled && !filterEnabled && !actionsEnabled) return undefined;

        let offset = (this.props.query && this.props.query.page) ? this.props.query.page.offset : 0;
        return (
            <tr>
                <th colSpan={Children.count(this.props.children)}>
                    <ButtonToolbar bsSize="sm">
                        {filterEnabled ? <SearchGroup className="input-group-sm" onFilter={this.onFilter} /> : undefined}
                        {actionsEnabled ? this.props.actions : undefined}
                        {pagerEnabled ? <PagerGroup className="btn-group-sm pull-right" onPaging={this.onPaging} onClean={this.onClean}
                                                    offset={offset} limit={this.props.pageSize} 
                                                    count={this.state.data && this.state.data.count || 0} /> : undefined}
                    </ButtonToolbar>
                </th>
            </tr>
        );
    };

    renderFilters = () => {
        return (
            <tr>
                <th colSpan={Children.count(this.props.children)}>
                    <ButtonToolbar bsSize="sm">
                        {Children.map(this.props.filters, (filter, i) => <filter.type {...filter.props} key={i} />)}
                    </ButtonToolbar>
                </th>
            </tr>
        );
    };

    renderHeadRow = () => {
        let activeSort = (this.props.query && this.props.query.sort) ? this.props.query.sort : null;
        return (
            <tr>
                {Children.map(this.props.children, (col, k) => {
                    let sort = col.props.sort;
                    if (!!activeSort) {
                        if (activeSort.name === col.props.name) {
                            sort = activeSort.direction;
                        } else if (col.props.sort !== false) {
                            sort = true;
                        }
                    }
                    return <col.type {...col.props} key={k} sort={sort} _head={true} _onSorting={this.onSorting}/>
                })}
            </tr>
        );
    };

    renderBodyRow = (row, i) =>
        <tr key={i}>
            {Children.map(this.props.children, (col, k) => <col.type {...col.props} key={k} _head={false} _row={row} _index={i} _data={this.state.data} />)}
        </tr>;

    renderBodyEmpty = () =>
        <tr>
            <td colSpan={Children.count(this.props.children)}>
                {this.props.empty}
            </td>
        </tr>;
}