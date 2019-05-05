import React, { PropTypes } from 'react';
import { Table, Column } from '../controls/table';
import { ButtonGroup, Button, Glyphicon } from 'react-bootstrap';
import { connect } from 'react-redux';
import { list as listLoad, remove as removeItem } from '../../actions/machineries';
import Confirmation from '../controls/confirmation';
import Restrict from '../controls/restrict';
import permissions from '../../engine/permissions';

class Machineries extends React.Component {
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
                <Column name="mark" title="Марка" sort={true} />
                <Column name="model" title="Модель" sort={true} />
                <Column name="releaseYear" title="Год выпуска" sort={true} />
                <Column name="transportNumber" title="Гос номер" sort="asc" />
                <Column name="motorNumber" title="№ двигателя" sort={true} />
                <Column name="bodyNumber" title="№ кузова" sort={true} />
                <Column name="techPassportNumber" title="№ техспаспорта" sort={true} />
                <Column name="color" title="Цвет" sort={true} />
                <Column actions={true} template={
                    row =>
                        <ButtonGroup bsSize="xs">
                            <Button onClick={e => this.context.router.push(`/machineries/${row.id}`)}><Glyphicon glyph="edit"/> Изменить</Button>
                            <Restrict permissions={permissions.MachineryManage}>
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
            <Restrict permissions={permissions.MachineryManage}>
                <Button onClick={e => this.context.router.push('/machineries/0')}><Glyphicon glyph="plus"/> Создать</Button>
            </Restrict>
        </ButtonGroup>
}

export default connect((state) => {
    const { list, query } = state.workspace;
    return { list, query }
}, { listLoad, removeItem })(Machineries);