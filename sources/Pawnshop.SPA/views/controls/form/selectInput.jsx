import React from 'react';
import { Glyphicon, Modal, Tabs, Tab, ButtonToolbar, ListGroup, ListGroupItem, Well } from 'react-bootstrap';
import SearchGroup from '../table/searchGroup';
import PagerGroup from '../table/pagerGroup';

export default class SelectInput extends React.Component {
    static propTypes = {
        title: React.PropTypes.string.isRequired,
        display: React.PropTypes.func.isRequired,
        identity: React.PropTypes.func,

        onSave: React.PropTypes.func,
        onLoad: React.PropTypes.func,

        readOnly: React.PropTypes.bool
    };

    static contextTypes = {
        store: React.PropTypes.object.isRequired
    };

    static defaultProps = {
        identity: row => row.id
    };

    state = {
        dialogShown: false,
        mode: 'list',
        selectedItem: null
    };

    _list = null;
    _forms = [];

    _onSearch() {
        let { input } = this.props;
        this.setState({
            dialogShown: true,
            mode: 'list',
            selectedItem: input && input.value
        });
    }

    _onSelect() {
        let { mode, selectedItem } = this.state;
        if (mode == 'list') {
            this._onSelectItem(selectedItem);
        } else {
            this.context.store.dispatch(this._forms[mode]);
        }
    }

    _onFormSubmit(obj, onSave) {
        this.context.store.dispatch(onSave(obj)).then(result => this._onSelectItem(result.data));
    }

    _onLoad(query) {
        return this.context.store.dispatch(this.props.onLoad(query));
    }

    _onSelectItem(item) {
        let { input } = this.props;
        if (input) {
            item.preventDefault = function () {};
            input.onChange(item);

            this.setState({
                dialogShown: false,
                selectedItem: null
            });
        } else {
            this.setState({
                dialogShown: false,
                selectedItem: null
            });
        }
    }

    _onCancel() {
        this.setState({
            dialogShown: false,
            selectedItem: null
        });
    }

    _onChangeMode(mode) {
        this.setState({
            mode: mode
        });
    }

    _onChangeSelected(item) {
        this.setState({
            selectedItem: item
        });
    }

    render() {
        let { input, button, display, readOnly, disabled } = this.props;
        readOnly = readOnly || disabled;
        let value = (input && input.value && display(input.value)) || 'Не выбрано';

        return (
            <div className="input-group">
                <span className={input && input.className || 'form-control'} readOnly={readOnly} style={input && input.style || null}>{value}</span>
                <span className="input-group-btn">
                    <button className={button && button.className || 'btn btn-default'} type="button" onClick={e => this._onSearch()} disabled={readOnly}>
                        <Glyphicon glyph="search" />
                    </button>
                </span>
                <Modal show={this.state.dialogShown} bsSize="lg">
                    <Modal.Header>
                        <Modal.Title>{this.props.title}</Modal.Title>
                    </Modal.Header>
                    <Tabs defaultActiveKey="list" id="selectInputTabs" onSelect={e => this._onChangeMode(e)}>
                        <Tab eventKey="list" title="Список">
                            <Modal.Body>
                                <List ref={r => this._list = r} selectedItem={this.state.selectedItem}
                                      onLoad={e => this._onLoad(e)} onSelect={e => this._onChangeSelected(e)}
                                      display={this.props.display} identity={this.props.identity} />
                            </Modal.Body>
                        </Tab>
                        {this.props.readOnly ||
                            React.Children.map(this.props.children, (child, i) => {
                                this._forms[i] = child.props.submitForm;
                                return (
                                    <Tab eventKey={i} key={i} title={child.props.title}>
                                        <Modal.Body>
                                            <child.type {...child.props}
                                                        onSubmit={e => this._onFormSubmit(e, child.props.onSave)}/>
                                        </Modal.Body>
                                    </Tab>
                                );
                            })
                        }
                    </Tabs>
                    <Modal.Footer>
                        <div className="btn-group">
                            <button className="btn btn-primary" type="button" onClick={e => this._onSelect()}>Выбрать</button>
                            <button className="btn btn-default" type="button" onClick={e => this._onCancel()}>Отмена</button>
                        </div>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}

class List extends React.Component {
    static propTypes = {
        pageSize: React.PropTypes.number,
        empty: React.PropTypes.any,
        selectedItem: React.PropTypes.any
    };

    static defaultProps = {
        pageSize: 10,
        empty: 'Нет данных',
        selectedItem: null
    };

    state = {
        query: null,
        data: {
            list: [],
            count: 0
        }
    };

    componentDidMount() {
        this._onLoad(0);
    }

    _onFilter(filter) {
        this._onLoad(0, filter);
    }

    _onPaging(offset) {
        this._onLoad(offset, this.state.query && this.state.query.filter);
    }

    _onLoad(offset, filter) {
        if (this.props.onLoad) {
            this.props.onLoad({
                page: { offset: offset, limit: this.props.pageSize },
                filter: filter,
            }).then(result => {
                this.setState({
                    query: result.query,
                    data: result.data
                })
            });
        }
    }

    render() {
        let { query, data } = this.state;
        let offset = (query && query.page) ? query.page.offset : 0;

        return (
            <div>
                <ButtonToolbar bsSize="sm" style={{ marginBottom: '15px' }}>
                    <SearchGroup className="input-group-sm" onFilter={e => this._onFilter(e)} />
                    <PagerGroup className="btn-group-sm pull-right" onPaging={e => this._onPaging(e)}
                                offset={offset} limit={this.props.pageSize} count={data.count} />
                </ButtonToolbar>
                {!data.count
                    ? this.renderBodyEmpty()
                    : this.renderBody(data.list)
                }
            </div>);
    }

    renderBody(data) {
        let { display, identity, selectedItem } = this.props;
        let selectedItemIdentity = !!selectedItem ? identity(selectedItem) : null;

        return (
            <ListGroup>
                {data.map((item, i) =>
                    <ListGroupItem key={i} onClick={e => this.props.onSelect(item)} active={identity(item) === selectedItemIdentity}>
                        {display(item, i)}
                    </ListGroupItem>
                )}
            </ListGroup>
        );
    }

    renderBodyEmpty() {
        return <Well bsSize="small">{this.props.empty}</Well>;
    }
}