import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import NotificationForm from './notificationForm';
import { card as cardLoad, save as cardSave } from '../../actions/notifications';
import { select as selectItems, change as changeReceiver } from '../../actions/notificationReceivers';
import { list as logsLoad } from '../../actions/notificationLogs';
import Restrict from '../controls/restrict';
import permissions from '../../engine/permissions';
import Dialog from '../controls/dialog';
import SelectClientForm from './selectClientForm';
import NotificationLogs from './notificationLogs';

class NotificationCard extends React.Component {
    constructor(props, context, queue) {
        super(props, context, queue);
    }

    static contextTypes = {
        router: PropTypes.object.isRequired
    };

    componentWillMount = () => {
        this.onLoad(this.props.params.id);
        this.props.changeReceiver(this.props.params.id)
    };

    onLoad = id => this.props.cardLoad(id);
    onSave = account =>
        this.props
            .cardSave(account)
            .then(action => {
                if (action && action.data) {
                    this.context.router.push(`/notifications/${action.data.id}`);
                }
            });

    _selectDialog = null;
    onSelect() {
        if (this._selectDialog) {
            this._selectDialog.show(data => {
                data.notificationId = this.props.params.id;
                this.props.selectItems(data).then(action => this.onLoad(this.props.params.id));
            });
        }
    }

    _logsDialog = null;
    onLogs = receiverId => {
        if (this._logsDialog) {
            this.props.logsLoad({
                model: {
                    notificationReceiverId: receiverId
                }
            }).then(action => {
                if (action && action.data) {
                    this._logsDialog.show(null, true, action.data);
                }
            })
        }
    }

    render = () => {
        if (!this.props.card) return <div></div>;
        return (
            <div>
                <Restrict permissions={permissions.NotificationManage} pass>
                    <NotificationForm onSubmit={this.onSave} initialValues={this.props.card}
                                      id={this.props.params.id}
                                      enableReinitialize readOnly={this.props.card.status > 0}
                                      onSelect={e => this.onSelect()} onLogs={this.onLogs} />
                </Restrict>

                <Dialog ref={r => this._selectDialog = r} title="Выбор клиентов" form={true}>
                    <SelectClientForm />
                </Dialog>

                <Dialog ref={r => this._logsDialog = r} title="Журнал отправки уведомлений">
                    <NotificationLogs />
                </Dialog>
            </div>
        );
    };
}

export default connect(state => {
    const { workspace } = state;
    return {
        card: workspace.card
    }
}, { cardLoad, cardSave, selectItems, changeReceiver, logsLoad })(NotificationCard);