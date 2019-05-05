import React from 'react';
import classnames from 'classnames';
import { Glyphicon } from 'react-bootstrap';

const PermissionList = ({ fields, all, selected, readOnly }) => (
    <div className="panel-body">
        <table className="table table-bordered">
            <thead>
                <tr>
                    <th className="text-center">Право</th>
                    <th className="text-center">Не используется</th>
                    <th className="text-center">Разрешено</th>
                    <th className="text-center">Запрещено</th>
                </tr>
            </thead>
            <tbody>
                {all.map((item, i) => {
                    let found = undefined;
                    if (selected) {
                        for (let j = 0; j < selected.length; j++) {
                            if (selected[j].name == item.name) {
                                found = selected[j];
                                break;
                            }
                        }
                    }
                    return (
                        <tr key={i}>
                            <td>{item.displayName}</td>
                            <td className="text-center">
                                <button key={i} className="btn btn-link" disabled={readOnly} onClick={e => {
                                    e.preventDefault();
                                    let index = selected ? selected.map((item, i) => { return item.name; }).indexOf(item.name) : -1;
                                    if (index >= 0)
                                        fields.remove(index);
                                }}>
                                    <Glyphicon glyph={classnames({
                                        "check": !found || (found && found.grantType == 0),
                                        "unchecked": found && found.grantType != 0
                                    })}/>
                                </button>
                            </td>
                            <td className="text-center">
                                <button key={i} className="btn btn-link" disabled={readOnly} onClick={e => {
                                    e.preventDefault();
                                    let field = selected ? selected[selected.map((item, i) => { return item.name; }).indexOf(item.name)] : undefined;
                                    if (!field) {
                                        field = {
                                            name: item.name,
                                            grantType: 10,
                                        };
                                        fields.push(field);
                                    } else {
                                        field.grantType = 10;
                                    }
                                }}>
                                    <Glyphicon glyph={classnames({
                                        "check": found && found.grantType == 10,
                                        "unchecked": !found || (found && found.grantType != 10)
                                    })}/>
                                </button>
                            </td>
                            <td className="text-center">
                                <button key={i} className="btn btn-link" disabled={readOnly} onClick={e => {
                                    e.preventDefault();
                                    let field = selected ? selected[selected.map((item, i) => { return item.name; }).indexOf(item.name)] : undefined;
                                    if (!field) {
                                        let field = {
                                            name: item.name,
                                            grantType: 20,
                                        };
                                        fields.push(field);
                                    } else {
                                        field.grantType = 20;
                                    }
                                }}>
                                    <Glyphicon glyph={classnames({
                                        "check": found && found.grantType == 20,
                                        "unchecked": !found || (found && found.grantType != 20)
                                    })}/>
                                </button>
                            </td>
                        </tr>
                    )
                })}
            </tbody>
        </table>
    </div>
);

export default PermissionList;