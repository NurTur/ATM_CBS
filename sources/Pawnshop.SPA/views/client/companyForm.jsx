import React from 'react';
import { reduxForm, formValueSelector, submit, FieldArray, Field } from 'redux-form';
import ClientForm from './clientForm';
import { Tabs, Tab } from 'react-bootstrap';
import FileList from '../controls/form/fileList';
import DictInput from '../controls/form/dictInput';

import { banks } from '../../actions/dictionaries';

class CompanyForm extends React.Component {
    render() {
        let { readOnly, formOnly } = this.props;
        if (!!formOnly) {
            return (
                <form onSubmit={this.props.handleSubmit} className="form-horizontal">
                    {this.renderForm(readOnly)}
                </form>
            );
        }
        return (
            <form onSubmit={this.props.handleSubmit} className="form-horizontal">
                <Tabs defaultActiveKey="card" id="personCardTabs">
                    <Tab eventKey="card" title="Клиент">
                        {this.renderForm(readOnly)}
                    </Tab>
                    <Tab eventKey="files" title="Файлы">
                        <FieldArray name="files" component={FileList} readOnly={readOnly || this.props.id == 0} allowUpload={this.props.id > 0}
                                    onSave={fileRowId => this.props.onFileSave({ clientId: this.props.id, fileRowId: fileRowId })}
                                    onRemove={fileRowId => this.props.onFileRemove({ clientId: this.props.id, fileRowId: fileRowId })}/>
                    </Tab>
                </Tabs>
            </form>
        );
    }

    renderForm(readOnly) {
        return (
            <div className={this.props.className}>
                <ClientForm readOnly={readOnly} identityNumberLabel="БИН" fillnameLabel="Имя" />
                <fieldset className="form-group" disabled={readOnly}>
                    <label htmlFor="bankId" className="col-sm-2">Банк</label>
                    <div className="col-sm-4">
                        <Field name="bankId" component={DictInput} className="form-control" dictionary="banks" onLoad={banks} />
                    </div>
                    <label htmlFor="kbe" className="col-sm-1">Кбе</label>
                    <div className="col-sm-5">
                        <Field name="kbe" component="input" type="text" className="form-control" />
                    </div>
                </fieldset>
            </div>
        );
    }
}

export default reduxForm({
    form: 'CompanyForm'
})(CompanyForm);

export const selector = formValueSelector('CompanyForm');
export const submitForm = dispatch => dispatch(submit('CompanyForm'));
