import React from 'react';
import classnames from 'classnames';
import { Glyphicon } from 'react-bootstrap';

const ActionPositions = ({ fields, positions, onChange, readOnly }) => (
    <div className="list-group">
        {positions.map((row) => {
            let selectedRows = fields.getAll();
            let found = selectedRows && selectedRows.indexOf(row);
            if (found === undefined) found = -1;
            return (
                <button key={row.id} type="button" className="list-group-item" disabled={readOnly} onClick={e => {
                    if (found >= 0) {
                        fields.remove(found);
                    } else {
                        fields.push(row);
                    }
                    onChange();
                }}>
                    <Glyphicon glyph={classnames({
                        "check": found >= 0,
                        "unchecked": found < 0
                    })}/> {row.position.name} ({row.loanCost} тг.)
                </button>
        )})}
    </div>
);

export default ActionPositions;