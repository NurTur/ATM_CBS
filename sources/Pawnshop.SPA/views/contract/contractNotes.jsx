import React, { PropTypes } from 'react';
import { Table, Column } from '../controls/table';
import { ButtonGroup, Button, Glyphicon } from 'react-bootstrap';
import { connect } from 'react-redux';
import { list as listLoad, remove as removeItem, card as cardLoad, save as cardSave } from '../../actions/contractNotes';
import { profile } from '../../actions/security';
import Dialog from '../controls/dialog';
import Restrict from '../controls/restrict';
import permissions from '../../engine/permissions';
import ContractNoteForm from './contractNoteForm';
import Confirmation from '../controls/confirmation';

class ContractNotes extends React.Component {
    static contextTypes = {
        router: PropTypes.object.isRequired
    };

    state = {
        notes: null
    };

    componentDidMount(){
        if (this.props.auth.isAuthenticated) {
            this.props.profile();
        }
        this.onLoad();
    }

    onLoad = query => {
        if (!query) {
            query = this.props.query || {};
        }

        query.model = {
            contractId: this.props.contractId || null,
            clientId: this.props.clientId || null,
        };
        this.props.listLoad(query).then(action => {
            this.setState({
                notes: action.data
            });
        });
    };

    _noteDialog = null;
    onEdit = id => {
        if (id == 0) {
            if (this._noteDialog) {
                this._noteDialog.show(data => {
                    data.contractId = this.props.contractId;
                    return this.props.cardSave(data).then(() => {
                        this.onLoad(this.props.query);
                    });
                }, !this.props.contractId);
            }
        } else {
            this.props.cardLoad(id).then(action => {
                if (action && action.data && this._noteDialog) {
                    this._noteDialog.show(data => {
                        data.contractId = this.props.contractId;
                        return this.props.cardSave(data).then(() => {
                            this.onLoad(this.props.query);
                        });
                    }, !this.props.contractId, action.data);
                }
            });
        }
    };

    _confirmation = null;
    render = () => (
        <div>
            <Table data={this.state.notes} query={this.props.query}
                   onLoad={this.onLoad} actions={this.renderActions()}>
                <Column name="noteDate" title="Дата" sort="desc" type="date" />
                <Column name="note" title="Примечание" sort={true} />
                <Column name="author.fullname" title="Автор" sort={true} template={
                    row => row.author.fullname
                } />
                <Column actions={true} template={
                    row =>
                        <ButtonGroup bsSize="xs">
                            <Restrict permissions={permissions.ContractManage}>
                                <Button onClick={e => this.onEdit(row.id)}><Glyphicon glyph="edit"/></Button>
                            </Restrict>
                            <Restrict permissions={permissions.ContractManage}>
                                <Button onClick={e => {
                                    this._confirmation.show("Вы действительно хотите удалить запись?",
                                        () => this.props.removeItem(row.id)
                                            .then(action => this.onLoad(this.props.query))
                                    );
                                }}><Glyphicon glyph="remove"/></Button>
                            </Restrict>
                        </ButtonGroup>
                } />
            </Table>

            <Confirmation ref={r => this._confirmation = r} />

            <Dialog ref={r => this._noteDialog = r} title="Примечание" form={true}>
                <ContractNoteForm />
            </Dialog>
        </div>
    );

    renderActions = () =>
        <ButtonGroup bsSize="sm">
            <Restrict permissions={permissions.ContractManage}>
                <Button onClick={e => this.onEdit(0)}><Glyphicon glyph="plus"/> Создать</Button>
            </Restrict>
        </ButtonGroup>;
}

export default connect((state) => {
    const { workspace, auth } = state;

    return {
        query: workspace.query,
        auth: auth,
    }
}, { listLoad, removeItem, cardSave, cardLoad, profile })(ContractNotes);