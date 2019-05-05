import React from 'react';
import { connect } from 'react-redux';
import { updateBranchConfig as update } from '../../actions/security';
import ConfigForm from './configForm';
import permissions from '../../engine/permissions';
import Restrict from '../controls/restrict';
import { accounts as accountsLoad, expenseTypes as expenseTypesLoad } from '../../actions/dictionaries';

class ConfigCard extends React.Component {
    componentWillMount() {
        if (this.props.accounts.length == 0) {
            this.props.accountsLoad();
        }
        if (this.props.expenseTypes.length == 0) {
            this.props.expenseTypesLoad();
        }
    }

    _onSave(config) {
        this.props.update(config);
    }

    render() {
        return (
            <div className="panel panel-default">
                <div className="panel-heading">
                    <h4 className="panel-title">Конфигурация филиала</h4>
                </div>
                <Restrict permissions={permissions.BranchConfigurationManage} pass>
                    <ConfigForm onSubmit={m => this._onSave(m)} enableReinitialize
                                initialValues={this.props.branch.configuration}
                                parent={this.props.organization.configuration}
                                accounts={this.props.accounts} expenseTypes={this.props.expenseTypes} />
                </Restrict>
            </div>
        );
    }
}

export default connect(state => {
    let { auth, dictionary } = state;
    return {
        branch: auth.branchProfile,
        organization: auth.profile.organization,
        accounts: dictionary.accounts,
        expenseTypes: dictionary.expenseTypes
    }
}, { update, accountsLoad, expenseTypesLoad })(ConfigCard)