import React from 'react';

export default class DictInput extends React.Component {
    static propTypes = {
        dictionary: React.PropTypes.string.isRequired,
        onLoad: React.PropTypes.func.isRequired,

        display: React.PropTypes.func,
        identity: React.PropTypes.func,

        readOnly: React.PropTypes.bool,
        dataList: React.PropTypes.bool
    };

    static contextTypes = {
        store: React.PropTypes.object.isRequired
    };

    static defaultProps = {
        display: row => row.name,
        identity: row => row.id
    };

    state = {
        list: []
    };

    _getList(dictionary) {
        let state = this.context.store.getState();
        let list = state.dictionary[dictionary];
        return list || [];
    }

    _onStoreChange() {
        let { dictionary } = this.props;

        let list = this._getList(dictionary);
        if (list.length > 0){
            if (this._unsubscribe) {
                this._unsubscribe()
            }
            this.setState({
                list: list
            })
        }
    }

    _unsubscribe = null;
    componentDidMount() {
        let store = this.context.store;
        let { dictionary, onLoad } = this.props;

        let list = this._getList(dictionary);
        if (list.length == 0){
            this._unsubscribe = store.subscribe(() => this._onStoreChange());
            store.dispatch(onLoad());
        } else {
            this.setState({
                list: list
            })
        }
    }

    componentWillUnmount() {
        if (this._unsubscribe) {
            this._unsubscribe()
        }
    }

    render() {
        let { dictionary, input, identity, display, readOnly, dataList, disabled, className } = this.props;
        let list = this.state.list;
        readOnly = readOnly || disabled;

        if (dataList) return (
            <span>
                <input type="text" value={input.value} onChange={input.onChange} className={className} disabled={readOnly} list={dictionary} />
                <datalist id={dictionary}>
                    {list.map((row, i) => {
                        let id = identity(row, i);
                        return  <option key={id}>{display(row, i)}</option>
                    })}
                </datalist>
            </span>
        );
        return (
            <select value={input.value} onChange={input.onChange} className={className} disabled={readOnly}>
                <option value="">Не выбрано</option>
                {list.map((row, i) => {
                    let id = identity(row, i);
                    return  <option key={id} value={id}>{display(row, i)}</option>
                })}
            </select>
        );
    }
}