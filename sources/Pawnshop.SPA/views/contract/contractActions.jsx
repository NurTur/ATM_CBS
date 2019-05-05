import React from 'react';
import { ButtonGroup, Button, Glyphicon } from 'react-bootstrap';
import { Table, Column } from '../controls/table';
import Restrict from '../controls/restrict';
import permissions from '../../engine/permissions';
import moment from 'moment';

const ContractActions = ( { fields, onOpen, onCancel, onCashOrderPrint, auth, branchId } ) => (
    <div className="panel-body">
        <Table showPager={false} showFilter={false} showActions={false} data={fields.getAll()} simple={true}>
            <Column title="Дата" name="date" type="date" />
            <Column title="Действие" template={r => {
                switch (r.actionType) {
                    case 10:
                        return "Продление";
                    case 20:
                        return "Выкуп";
                    case 30:
                        return "Частичный выкуп";
                    case 40:
                        return "Частичное гашение";
                    case 50:
                        return "Подписание";
                    case 60:
                        return "Реализация";
                    case 70:
                        return "Передача";
                    case 80:
                        return "Ежемесячное погашение";
                    case 90:
                        return "Добор";
                }
            }} />
            <Column title="Сумма" name="totalCost" />
            <Column actions={true} template={
                (row, index, count) =>
                    <ButtonGroup bsSize="xs">
                        <Button onClick={() => onOpen(row)}><Glyphicon glyph="folder-open"/> Открыть</Button>
                        <Button onClick={() => onCashOrderPrint(row)}><Glyphicon glyph="print"/> Печать</Button>
                        {moment(row.date).isSame(moment(), 'day') && auth.branchId==branchId && //row.data.branch!=null && row.data.branch.id==auth.branchId &&
                        //TODO: ДЛЯ ОПЛАТЫ ДРУГИМ ФИЛИАЛОМ
                            <Restrict permissions={permissions.ContractManage}>
                                <Button onClick={() => onCancel(row)} disabled={index < count - 1}>
                                    <Glyphicon glyph="remove"/> Отменить</Button>
                            </Restrict>
                        }
                    </ButtonGroup>
            } />
        </Table>
    </div>
);

export default ContractActions;