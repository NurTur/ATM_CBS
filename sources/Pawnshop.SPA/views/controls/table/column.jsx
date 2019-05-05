import React, { PropTypes } from 'react';
import classnames from 'classnames';
import moment from 'moment';

export default class Column extends React.Component {
    static propTypes = {
        name: PropTypes.string,
        title: PropTypes.string,
        sort: PropTypes.any,
        template: PropTypes.func,
        width: PropTypes.number,
        type: PropTypes.string,

        _head: PropTypes.bool,
        _row: PropTypes.object,
        _onSorting: PropTypes.func
    };

    static defaultProps = {
        name: null,
        title: null,
        sort: false,
        template: null
    };

    state = {
        title: this.props.title || this.props.name,
        sortable: this.props.name && this.props.sort
    };

    onHeadClick = () => {
        if (!this.state.sortable) return;

        let sort = 'asc';
        if (this.props.sort === 'asc'){
            sort = 'desc';
        }
        this.props._onSorting({name: this.props.name, direction: sort});
    };

    render = () => this.props._head ? this.renderHeadCell() : this.renderBodyCell();

    renderHeadCell = () =>
        <th style={{width: this.props.width}} onClick={this.onHeadClick} className={classnames({
            "sortable": this.state.sortable,
            "actions": this.props.actions
        })}>
            {this.state.title}<span className={classnames('sort', {
                'glyphicon': this.state.sortable && (this.props.sort === 'asc' || this.props.sort === 'desc'),
                'glyphicon-triangle-bottom': this.state.sortable && this.props.sort === 'asc',
                'glyphicon-triangle-top': this.state.sortable && this.props.sort === 'desc'
            })} />
        </th>;

    renderBodyCell = () =>
        <td>
            {this.props.template ? this.props.template(this.props._row, this.props._index, this.props._data.count) : this.renderValue(this.props._row[this.props.name])}
        </td>;

    renderValue = value => {
        switch (this.props.type) {
            case "bool":
                return !!value ? "Да" : "Нет";
                break;
            case "date":
                return moment(value).format('L');
                break;
            case "number":
                return (value).toLocaleString('ru')
                break;
        }
        return value;
    };
}