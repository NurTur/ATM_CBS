import React from 'react';
import classnames from 'classnames';
import { Glyphicon } from 'react-bootstrap';

const CheckBoxList = ({ fields, all, selected, nameSelector, idSelector, readOnly }) => (
    <div className="panel-body">
        <div className="list-group">
            {all.map((item, i) => {
                let found = -1;
                if (selected)
                    for (let i = 0; i < selected.length; i++) {
                        let selectedId = selected[i].id;
                        let itemId = item.id; 
                        if (idSelector) {
                            selectedId = idSelector(selected[i]);
                            itemId = idSelector(item);
                        }
                        if (selectedId == itemId) {
                            found = i;
                            break;
                        }
                    }
                return (
                    <button key={i} className="list-group-item" disabled={readOnly} onClick={e => {
                        e.preventDefault();
                        if (found < 0)
                            fields.push(item);
                        else
                            fields.remove(found);
                    }}>
                        <Glyphicon glyph={classnames({
                            "check": found >= 0,
                            "unchecked": found < 0
                        })}/> {nameSelector(item)}</button>
                )
            })}
        </div>
    </div>
);

export default CheckBoxList;