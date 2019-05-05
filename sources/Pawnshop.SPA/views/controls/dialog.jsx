import React from 'react';
import { Modal } from 'react-bootstrap';

export default class Dialog extends React.Component {
    static defaultProps = {
        form: false
    };

    state = {
        visible: false,
        callback: null,
        readonly: false,
        data: null
    };

    show(callback, readonly, data) {
        this.setState({
            visible: true,
            callback: callback,
            readonly: readonly || false,
            data: data || null
        });
    }

    hide() {
        this.setState({
            visible: false,
            callback: null,
            readonly: false,
            data: null
        });
    }

    _children = [];
    onSubmit() {
        if (this.props.form) {
            for (let child of this._children) {
                if (child.submit) {
                    child.submit();
                }
            }
        } else {
            this.handleSubmit(null);
        }
    }

    handleSubmit(data) {
        if (this.state.callback) {
            let result = this.state.callback(data);
            Promise.resolve(result).then(val => {
                if (val !== false) {
                    this.hide();
                }
            }, () => {});
        } else {
            this.hide();
        }
    }

    onCancel() {
        this.hide();
    }

    render() {
        this._children = [];

        return (
            <Modal show={this.state.visible} bsSize="lg">
                <Modal.Header>
                    <Modal.Title>{this.props.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {React.Children.map(this.props.children, (child, k) =>
                        <child.type {...child.props} key={k} ref={r => this._children.push(r)} onSubmit={data => this.handleSubmit(data)} readOnly={this.state.readonly}
                                    initialValues={this.state.data} />
                    )}
                </Modal.Body>
                <Modal.Footer>
                    {this.state.readonly ||
                        <div className="btn-group">
                            <button type="button" className="btn btn-primary" onClick={e => this.onSubmit()}>Сохранить</button>
                            <button type="button" className="btn btn-default" onClick={e => this.onCancel()}>Отмена</button>
                        </div>
                    }
                    {this.state.readonly &&
                        <div className="btn-group">
                            <button type="button" className="btn btn-default" onClick={e => this.onCancel()}>Закрыть</button>
                        </div>
                    }
                </Modal.Footer>
            </Modal>
        );
    }
}