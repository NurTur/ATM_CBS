import React from 'react';
import { reduxForm, submit, formValueSelector, FieldArray } from 'redux-form';
import ClientForm from './clientForm';
import { Tabs, Tab } from 'react-bootstrap';
import FileList from '../controls/form/fileList';
import Contracts from '../contract/contracts';

class PersonForm extends React.Component {
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
                    <Tab eventKey="contracts" title="Договоры">
                        <Contracts ref={r => this._contracts = r} clientId={this.props.params.id} readOnly={readOnly} />
                    </Tab>
                    <Tab eventKey="files" title="Файлы">
                        <FieldArray name="files" component={FileList} readOnly={readOnly || this.props.id == 0} allowUpload={this.props.id > 0}
                                    onSave={fileRowId => this.props.onFileSave({ clientId: this.props.id, fileRowId: fileRowId })}
                                    onRemove={fileRowId => this.props.onFileRemove({ clientId: this.props.id, fileRowId: fileRowId })} />
                    </Tab>
                </Tabs>
            </form>
        );
    }

    renderForm(readOnly) {
        return (
            <div className={this.props.className}>
                <ClientForm readOnly={readOnly} identityNumberLabel="ИИН" fillnameLabel="Ф.И.О." />
            </div>
        );
    }
}

export default reduxForm({
    form: 'PersonForm'
})(PersonForm);

export const selector = formValueSelector('PersonForm');
export const submitForm = dispatch => dispatch(submit('PersonForm'));