import React from 'react';
import { Glyphicon } from 'react-bootstrap';
import UploadButton from './uploadButton';
import { download } from '../../actions/common';
import classnames from 'classnames';

export default class FileInput extends React.Component {
    static propTypes = {
        readonly: React.PropTypes.bool,
        value: React.PropTypes.object,
        onChange: React.PropTypes.func,
        disableUpload: React.PropTypes.bool
    };

    static contextTypes = {
        store: React.PropTypes.object.isRequired
    };

    onDelete() {
        if (this.props.onChange) {
            this.props.onChange(null);
        }
    }

    onDownload() {
        this.context.store.dispatch(download(this.props.value));
    }

    onUpload(file) {
        if (this.props.onChange) {
            this.props.onChange(file);
        }
    }

    render() {
        return (
            <div className={classnames("input-group", this.props.className)}>
                <span className="form-control">{this.props.value ? this.props.value.fileName : ''}</span>
                <span className="input-group-btn">
                    {this.props.value && !this.props.readonly && <button type="button" className="btn btn-default" onClick={e => this.onDelete()} title="Удалить"><Glyphicon glyph="remove" /></button>}
                    {this.props.value && <button type="button" className="btn btn-default" onClick={e => this.onDownload()} title="Скачать"><Glyphicon glyph="cloud-download" /></button>}
                    {!this.props.readonly && !this.props.disableUpload && <UploadButton className="btn btn-default" onUpload={f => this.onUpload(f)} />}
                </span>
            </div>
        );
    }
}