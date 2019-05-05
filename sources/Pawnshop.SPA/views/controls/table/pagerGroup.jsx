import React, { PropTypes } from 'react';
import { ButtonGroup, Button, Glyphicon } from 'react-bootstrap';

export default class PagerGroup extends React.Component {
    static PropTypes = {
        onPaging: PropTypes.func.isRequired,
        onClean: PropTypes.func.isRequired,

        offset: PropTypes.number,
        limit: PropTypes.number,
        count: PropTypes.number,
        shift: PropTypes.number
    };

    static defaultProps = {
        limit: 50,
        shift: 5
    };

    handleRefresh = e => {
        this.props.onPaging(0);
    };

    handleClean = e => {
        this.props.onClean();
    };

    handleNavigate = offset => {
        if (offset < 0 || offset >= this.props.count) {
            offset = 0;
        }
        this.props.onPaging(offset);
    };

    render = () => {
        let offset = this.props.offset;
        let limit = this.props.limit;
        let count = this.props.count;

        return (
            <ButtonGroup className={this.props.className}>
                {!!count &&
                    <Button onClick={e => this.handleNavigate(offset - limit)}
                            disabled={offset <= 0}>
                        <Glyphicon glyph="chevron-left"/>
                    </Button>}
                {!!count && this.renderPages(offset, limit, count)}
                {!!count &&
                    <Button onClick={e => this.handleNavigate(offset + limit)}
                            disabled={offset + limit >= count}>
                        <Glyphicon glyph="chevron-right"/>
                    </Button>
                }
                <Button onClick={this.handleClean}>
                    <Glyphicon glyph="remove"/>
                </Button>
                <Button onClick={this.handleRefresh}>
                    <Glyphicon glyph="refresh"/>
                </Button>
            </ButtonGroup>
        );
    };

    renderPages = (offset, limit, count) => {
        let page = offset / limit + 1;
        let pageCount = Math.ceil(count / limit);

        let pages = [];

        let pageStart = page - this.props.shift;
        let pageEnd = page + this.props.shift;
        if (pageStart <= 0) {
            pageEnd = pageEnd - pageStart + 1;
            pageStart = 1;
        }
        if (pageEnd > pageCount) {
            pageStart = pageStart - (pageEnd - pageCount);
            pageEnd = pageCount;
        }
        if (pageStart <= 0) {
            pageStart = 1;
        }

        for (let i = pageStart; i <= pageEnd; i++) {
            pages.push(<Button key={i} onClick={e => this.handleNavigate((i - 1) * limit)} active={page == i}>{i}</Button>);
        }
        return pages;
    };
}