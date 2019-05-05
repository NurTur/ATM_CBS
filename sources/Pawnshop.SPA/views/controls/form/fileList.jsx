import React from 'react';
import UploadButton from '../uploadButton';
import FileInput from '../fileInput';

const FileList = ({ fields, readOnly, allowUpload, onSave, onRemove }) => (
    <div className="panel-body">
        {(!readOnly || allowUpload) &&
            <div className="form-group">
                <div className="col-xs-12">
                    <div className="pull-right">
                        <UploadButton onUpload={f => {
                            fields.push(f);
                            if (onSave != null) {
                                onSave(f.id);
                            }
                        }}/>
                    </div>
                </div>
            </div>
        }
        {fields.map((f, i) => (
            <div key={i} className="form-group">
                <div className="col-xs-12">
                    <FileInput disableUpload value={fields.get(i)} onChange={() => {
                        fields.remove(i);
                        if (onRemove != null) {
                            onRemove(fields.get(i).id);
                        }
                    }} readonly={readOnly} />
                </div>
            </div>
        ))}
    </div>
);

export default FileList;