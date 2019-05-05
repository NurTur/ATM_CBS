import React from 'react';
import { reduxForm, Field, FieldArray, formValueSelector } from 'redux-form';
import { Tabs, Tab } from 'react-bootstrap';
import PermissionList from './permissionList';

const RoleTabContent = (readOnly) =>
    <div className="panel-body">
        <fieldset className="form-group" disabled={readOnly}>
            <label htmlFor="name" className="col-sm-3">Наименование</label>
            <div className="col-sm-9">
                <Field name="name" component="input" type="text" className="form-control" />
            </div>
        </fieldset>        
    </div>;

class RoleForm extends React.Component {
    render = () => {
        let { readOnly } = this.props;
        return (
            <form onSubmit={this.props.handleSubmit} className="form-horizontal">
                <Tabs defaultActiveKey="role" id="roleCardTabs">
                    <Tab eventKey="role" title="Роль">
                        {RoleTabContent(readOnly)}
                    </Tab>
                    <Tab eventKey="permissions" title="Права">
                        <FieldArray name="permissions.permissions" readOnly={readOnly}
                                    all={this.props.permissions} selected={this.props.selectedPermissions}
                                    component={PermissionList} />
                    </Tab>
                </Tabs>
                    <div className="panel-footer">
                        <button type="button" className="btn btn-warning" onClick={() => history.back()}>Назад</button>
                        {readOnly ||
                            <button type="submit" className="btn btn-primary">Сохранить</button>
                        }
                    </div>
            </form>
        );
    }
}

export default reduxForm({
    form: 'ContractForm'
})(RoleForm);

export const selector = formValueSelector('ContractForm');