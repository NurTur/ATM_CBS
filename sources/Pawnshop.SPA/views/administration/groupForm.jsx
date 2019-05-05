import React from 'react';
import { reduxForm, Field, FieldArray, formValueSelector } from 'redux-form'
import { Tabs, Tab } from 'react-bootstrap';
import CheckBoxList from '../controls/form/checkBoxList';

const GroupTabContent = (readOnly) =>
    <div className="panel-body">
        <fieldset className="form-group" disabled={readOnly}>
            <label htmlFor="member.name" className="col-sm-3">Код</label>
            <div className="col-sm-9">
                <Field name="member.name" component="input" type="text" className="form-control" />
            </div>
        </fieldset>
        <fieldset className="form-group" disabled={readOnly}>
            <label htmlFor="member.displayName" className="col-sm-3">Наименование</label>
            <div className="col-sm-9">
                <Field name="member.displayName" component="input" type="text" className="form-control" />
            </div>
        </fieldset>
        <fieldset className="form-group" disabled={readOnly}>
            <label htmlFor="member.bitrixCategoryId" className="col-sm-3">Идентификатор в Bitrix24</label>
            <div className="col-sm-9">
                <Field name="member.bitrixCategoryId" component="input" type="int" className="form-control" />
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
        <fieldset className="form-group" disabled={readOnly}>
            <label htmlFor="member.type" className="col-sm-3">Тип</label>
            <div className="col-sm-9">
                <Field name="member.type" component="select" className="form-control">
                    <option disabled>Не выбран</option>
                    <option value={10}>Группа</option>
                    <option value={20}>Филиал</option>
                </Field>
            </div>
        </fieldset>
    </div>;

class GroupForm extends React.Component {
    render = () => {
        let { readOnly } = this.props;
        return (
            <form onSubmit={this.props.handleSubmit} className="form-horizontal">
                <Tabs defaultActiveKey="group" id="groupCardTabs">
                    <Tab eventKey="group" title="Профиль">
                        {GroupTabContent(readOnly)}
                    </Tab>
                    <Tab eventKey="groups" title="Группы">
                        <FieldArray name="groups" all={this.props.groups} selected={this.props.selectedGroups}
                                    component={CheckBoxList} nameSelector={g => g.displayName} readOnly={readOnly} />
                    </Tab>
                    <Tab eventKey="roles" title="Роли">
                        <FieldArray name="roles" all={this.props.roles} selected={this.props.selectedRoles}
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
    form: 'GroupForm'
})(GroupForm);

export const selector = formValueSelector('GroupForm');