import React, { PropTypes } from 'react';
import { Table, Column } from '../controls/table';
import { ButtonGroup, Button, Glyphicon } from 'react-bootstrap';
import { connect } from 'react-redux';
import { list as listLoad, remove as removeItem } from '../../actions/loanPercents';
import Confirmation from '../controls/confirmation';

import Restrict from '../controls/restrict';
import permissions from '../../engine/permissions';

class LoanPercents extends React.Component {
    constructor(props, context, queue) {
        super(props, context, queue);

        this.onLoad({});
    }
    static contextTypes = {
        router: PropTypes.object.isRequired
    };

    onLoad = query => this.props.listLoad(query);

    _confirmation = null;
    render = () => (
        <div>
            <Table data={this.props.list} query={this.props.query}
                   onLoad={this.onLoad} actions={this.renderActions()}>
                <Column name="branch.displayName" title="Филиал" sort={true} template={
                    row => row.branch.displayName
                } />
                <Column name="collateralType" title="Вид залога" sort="asc" template={
                    row =>
                    row.collateralType == 0 && <span>Все</span> ||
                    row.collateralType == 10 && <span>Золото</span> ||
                    row.collateralType == 20 && <span>Автотранспорт</span> ||
                    row.collateralType == 30 && <span>Товар</span> ||
                    row.collateralType == 40 && <span>Спецтехника</span>
                } />
                <Column name="cardType" title="Тип карты" sort={true} template={
                    row =>
                    row.cardType == 0 && <span>Все</span> ||
                    row.cardType == 10 && <span>Standard</span> ||
                    row.cardType == 20 && <span>Bronze</span> ||
                    row.cardType == 30 && <span>Silver</span> ||
                    row.cardType == 40 && <span>Gold</span> ||
                    row.cardType == 50 && <span>Platinum</span>
                } />
                <Column name="loanCostFrom" title="Ссуда от" sort={true} type="number" />
                <Column name="loanCostTo" title="Ссуда до" sort={true} type="number" />
                <Column name="loanPeriod" title="Срок залога (дней)" sort={true} />
                <Column name="minLoanPeriod" title="Мин срок залога (дней)" sort={true} />
                <Column name="loanPercent" title="% кредита" sort={true} />
                <Column name="penaltyPercent" title="% штрафа" sort={true} />
                <Column actions={true} template={
                    row =>
                        <ButtonGroup bsSize="xs">
                            <Button onClick={e => this.context.router.push(`/loanPercents/${row.id}`)}><Glyphicon glyph="edit"/> Изменить</Button>
                            <Restrict permissions={permissions.LoanPercentSettingManage}>
                                <Button onClick={e => {
                                    this._confirmation.show("Вы действительно хотите удалить запись?",
                                        () => this.props.removeItem(row.id)
                                            .then(action => this.onLoad(this.props.query))
                                    );
                                }}><Glyphicon glyph="remove"/> Удалить</Button>
                            </Restrict>
                        </ButtonGroup>
                } />
            </Table>

            <Confirmation ref={r => this._confirmation = r} />
        </div>
    );

    renderActions = () =>
        <ButtonGroup bsSize="sm">
            <Restrict permissions={permissions.LoanPercentSettingManage}>
                <Button onClick={e => this.context.router.push('/loanPercents/0')}><Glyphicon glyph="plus"/> Создать</Button>
            </Restrict>
        </ButtonGroup>
}

export default connect((state) => {
    const { list, query } = state.workspace;
    return { list, query }
}, { listLoad, removeItem })(LoanPercents);