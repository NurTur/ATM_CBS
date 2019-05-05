import React from 'react';
import { connect } from 'react-redux';

import { signIn, signOut, profile } from '../../actions/security';
import { changeWorkspace, changeBranch } from '../../actions/workspace';
import { navigation } from '../../engine/permissions';
import { warning as notify } from '../../actions/common';

import Header from './header';
import MenuBar from './menubar';
import Auth from './auth';
import LoadIndicator from './loadIndicator';
import Notifications from 'react-notification-system-redux';
import { dictionary } from '../../reducers';

import { messages as messagesLoad } from '../../actions/dictionaries'

class Layout extends React.Component {
    static contextTypes = {
        router: React.PropTypes.object
    };

    componentDidMount() {
        let { auth, profile, changeWorkspace } = this.props;

        if (auth.isAuthenticated) {
            profile();
        }
        this.props.messagesLoad();
        changeWorkspace(navigation.find(this.props.location.pathname));
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.auth.branchId !== prevProps.auth.branchId) {
            this.props.messagesLoad();
        }
    }

    _onLogin(cred) {
        this.props.signIn(cred)
            .then(this.props.profile)
            .then(() => {
                if (this.props.auth.profile && this.props.auth.profile.user.expireDay <= 5) {
                    this.props.notify('Пароль истечет через ' + this.props.auth.profile.user.expireDay + ' дней');
                }
                this._onNavigate('/');
            });
    }

    _onLogout() {
        this.context.router.push('/');
        this.props.changeWorkspace();
        this.props.signOut();
        window.scrollTo(0, 0);
    }

    _onNavigate(item) {
        if (this.props.auth.profile && this.props.auth.profile.user.expireDay <= 0) {
            this.context.router.push('/profile/password');
            this.props.changeWorkspace();
        } else if (typeof item === "string") {
            this.context.router.push(item);
            this.props.changeWorkspace();
        } else {
            this.context.router.push(item.link);
            this.props.changeWorkspace(item);
        }
        window.scrollTo(0, 0);
    }

    _onBranchChange(branch) {
        this.props.changeBranch(branch);
        this.context.router.push('/');
        this.props.changeWorkspace();
        window.scrollTo(0, 0);
    };

    render() {
        let { auth, workspace, request, notifications, children, messages } = this.props;
        let content = auth.isAuthenticated
            ? (auth.profile
                ? (<div className='container-fluid workspace'>
                    <div className='col-sm-2 workspace-menu'>
                        <MenuBar permissions={auth.permissions} branch={auth.branchProfile}
                            workspace={workspace.current}
                            onNavigate={e => this._onNavigate(e)} />
                    </div>
                    <div className='col-sm-10 workspace-content'>
                        {children}
                    </div>
                </div>)
                : (<div></div>))
            : (<div className='authspace'>
                <Auth onLogin={e => this._onLogin(e)} onNavigate={e => this._onNavigate(e)} />
            </div>);
        return (
            <div className='layout'>
                <div className='header'>
                    <Header profile={auth.profile} branch={auth.branchProfile} permissions={auth.permissions} workspace={workspace.current}
                        onLogout={() => this._onLogout()} onNavigate={e => this._onNavigate(e)}
                        notify={e => this.props.notify(e)} onBranchChange={e => this._onBranchChange(e)}
                        messages={messages} />
                </div>
                {content}

                <LoadIndicator inProgress={request.inProgress} />
                <Notifications notifications={notifications} />

            </div>


        );
    }
}

export default connect((state) => {
    const { auth, workspace, request, notifications, dictionary } = state;
    return {
        auth,
        workspace,
        request,
        notifications,
        messages: dictionary.messages
    }
}, { profile, signIn, signOut, changeWorkspace, changeBranch, notify, messagesLoad })(Layout);