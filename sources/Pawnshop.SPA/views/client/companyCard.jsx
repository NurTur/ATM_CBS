import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import CompanyForm, { submitForm } from './companyForm';

import { card as cardLoad, save as cardSave } from '../../actions/companies';
import { save as fileSave, remove as fileRemove } from '../../actions/clientFileRow';

import Restrict from '../controls/restrict';
import permissions from '../../engine/permissions';

class CompanyCard extends React.Component {
    static contextTypes = {
        router: PropTypes.object.isRequired,
        store: PropTypes.object.isRequired
    };

    componentWillMount = () => {
        this.onLoad(this.props.params.id);
    };

    onLoad = id => this.props.cardLoad(id);
    onSave = company =>
        this.props
            .cardSave(company)
            .then(action => {
                if (action && action.data) {
                    this.context.router.push(`/companies/${action.data.id}`);
                }
            });

    onFileSave(fileRow) {
        return this.props.fileSave(fileRow);
    }

    onFileRemove(fileRow) {
        return this.props.fileRemove(fileRow);
    }

    render = () => {
        if (!this.props.card) return <div></div>;
        const { dispatch } = this.context.store;
        return (
            <div>
                <Restrict permissions={permissions.CompanyManage} pass>
                    <CompanyForm onSubmit={this.onSave} initialValues={this.props.card}
                                 enableReinitialize className="panel-body" id={this.props.params.id}
                                 onFileSave={e => this.onFileSave(e)} onFileRemove={e => this.onFileRemove(e)} />
                </Restrict>
                <div className="panel-footer">
                    <div className="btn-group btn-group-sm">
                        <button type="button" className="btn btn-warning" onClick={() => history.back()}>Назад</button>
                        <Restrict permissions={permissions.CompanyManage}>
                            <button type="button" className="btn btn-primary" onClick={() => dispatch(submitForm)}>Сохранить</button>
                        </Restrict>
                    </div>
                </div>
            </div>
        );
    };
}

export default connect((state) => {
    const { workspace } = state;
    return {
        card: workspace.card,
    }
}, { cardLoad, cardSave, fileSave, fileRemove })(CompanyCard);