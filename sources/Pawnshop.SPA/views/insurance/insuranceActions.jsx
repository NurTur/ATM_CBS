import React from 'react';
import { Table, Column } from '../controls/table';

const InsuranceActions = ( { fields } ) => (
    <div className="panel-body">
        <Table showPager={false} showFilter={false} showActions={false} data={fields.getAll()} simple={true}>
            <Column title="Дата" name="actionDate" type="date" />
            <Column title="Действие" template={r => {
                switch (r.actionType) {
                    case 10:
                        return "Подписать";
                    case 20:
                        return "Оплатить";
                }
            }} />
        </Table>
    </div>
);

export default InsuranceActions;