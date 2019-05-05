import React from 'react';
import { reduxForm, Field, FieldArray, formValueSelector } from 'redux-form'
import { Tabs, Tab } from 'react-bootstrap';
import CheckBoxList from '../controls/form/checkBoxList';

const UserTabContent = (readOnly, organizations) => {
    return (<div className="panel-body">
        <fieldset className="form-group" disabled={readOnly}>
            <label htmlFor="member.login" className="col-sm-3">Имя пользователя</label>
            <div className="col-sm-9">
                <Field name="member.login" component="input" type="text" className="form-control" />
            </div>
        </fieldset>
        <fieldset className="form-group" disabled={readOnly}>
            <label htmlFor="member.identityNumber" className="col-sm-3">ИИН</label>
            <div className="col-sm-9">
                <Field name="member.identityNumber" component="input" type="text" className="form-control" />
            </div>
        </fieldset>
        <fieldset className="form-group" disabled={readOnly}>
            <label htmlFor="member.fullname" className="col-sm-3">Полное имя</label>
            <div className="col-sm-9">
                <Field name="member.fullname" component="input" type="text" className="form-control" />
            </div>
        </fieldset>
        <fieldset className="form-group" disabled={readOnly}>
            <label htmlFor="member.email" className="col-sm-3">Электронная почта</label>
            <div className="col-sm-9">
                <Field name="member.email" component="input" type="email" className="form-control" />
            </div>
        </fieldset>
        <fieldset className="form-group" disabled={readOnly}>
            <label htmlFor="member.organizationId" className="col-sm-3">Организация</label>
            <div className="col-sm-9">
                <Field name="member.organizationId" component="select" className="form-control">
                {organizations.map(b =>
                            <option  value={b.id}>{b.name}</option>
                        )}
                </Field>
            </div>
        </fieldset>
        <fieldset className="form-group" disabled={readOnly}>
            <div className="col-sm-offset-3 col-sm-9">
                <div className="checkbox">
                    <label>
                        <Field name="member.locked" component="input" type="checkbox"/> Заблокирован
                    </label>
                </div>
            </div>
        </fieldset>
    </div>);
}

class UserForm extends React.Component {
    render = () => {
        let { readOnly, handleSubmit, groups, roles, organizations } = this.props;

        return (
            <form onSubmit={handleSubmit} className="form-horizontal">
                <Tabs defaultActiveKey="user" id="userCardTabs">
                    <Tab eventKey="user" title="Профиль">
                        {UserTabContent(readOnly, organizations)}
                    </Tab>
                    <Tab eventKey="groups" title="Группы">
                        <FieldArray name="groups" all={groups} selected={this.props.selectedGroups}
                                    component={CheckBoxList} nameSelector={g => g.displayName} readOnly={readOnly} />
                    </Tab>
                    <Tab eventKey="roles" title="Роли">
                        <FieldArray name="roles" all={roles} selected={this.props.selectedRoles}
                                    component={CheckBoxList} nameSelector={r => r.name} readOnly={readOnly} />
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
    form: 'UserForm'
})(UserForm);

export const selector = formValueSelector('UserForm');