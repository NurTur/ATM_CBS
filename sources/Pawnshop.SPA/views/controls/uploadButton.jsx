import React from 'react';
import { Glyphicon } from 'react-bootstrap';
import { upload, success } from '../../actions/common';

export default class UploadButton extends React.Component {
    static propTypes = {
        onUpload: React.PropTypes.func.isRequired
    };

    static defaultProps = {
        className: "btn btn-default"
    };

    static contextTypes = {
        store: React.PropTypes.object.isRequired
    };

    state = {
        busy: undefined
    };

    onInvoke() {
        this.refs.fileInput.click();
        return false;
    };

    onSelect(files) {
        if (!files || files.length == 0) return;

        this.context.store.dispatch(upload(files))
            .then(result => {
                if (result) {
                    let file = result[0];
                    this.context.store.dispatch(success(`Файл "${file.fileName}" загружен!`));

                    this.props.onUpload(file);
                }
                this.setState({
                    busy: undefined,
                    hook: !this.state.hook
                });
            });
        this.setState({ busy: true });
    };

    render() {
        return (
            <button type="button" className={this.props.className} onClick={e => {
                //e.preventDefault();
                this.onInvoke();
                return false;
            }} disabled={this.state.busy} title="Загрузить">
                {this.props.children || <Glyphicon glyph="cloud-upload" />}
                {this.state.hook && <input key='hook1' type="file" ref="fileInput" onChange={e => {
                    e.preventDefault();
                    this.onSelect(e.target.files);
                    return false;
                }} className="hidden" />}
                {!this.state.hook && <input key='hook2' type="file" ref="fileInput" onChange={e => {
                    e.preventDefault();
                    this.onSelect(e.target.files);
                    return false;
                }} className="hidden" />}
            </button>
        );
    }
}