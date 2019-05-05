import React from 'react';
import { Modal } from 'react-bootstrap';

export default class Confirmation extends React.Component {
    static defaultProps = {
        title: 'Подтверждение',
    };

    state = {
        visible: false,
        callback: null,
        title: null,
        content: null
    };

    show(title, content, callback) {
        if (!content) {
            callback = title;
            content = null;
            title= null;
        }
        else if (!callback) {
            callback = content;
            content = title;
            title = null;
        }

        this.setState({
            visible: true,
            callback: callback,
            title: title,
            content: content
        });
    }

    hide() {
        this.setState({
            visible: false,
            callback: null,
            title: null,
            content: null
        });
    }

    onSubmit() {
        if (this.state.callback) {
            let result = this.state.callback();
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
        return (
            <Modal show={this.state.visible} bsSize="lg">
                <Modal.Header>
                    <Modal.Title>{this.state.title || this.props.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {this.state.content || this.props.children}
                </Modal.Body>
                <Modal.Footer>
                    {!this.state.callback ||
                    <div className="btn-group">
                        <button type="button" className="btn btn-primary" onClick={e => this.onSubmit()}>OK</button>
                        <button type="button" className="btn btn-default" onClick={e => this.onCancel()}>Отмена</button>
                    </div>
                    }
                    {!this.state.callback &&
                    <div className="btn-group">
                        <button type="button" className="btn btn-default" onClick={e => this.onCancel()}>OK</button>
                    </div>
                    }
                </Modal.Footer>
            </Modal>
        );
    }
}