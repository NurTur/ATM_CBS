import React from 'react';
import { Navbar, Nav, NavDropdown, MenuItem, Glyphicon } from 'react-bootstrap';
import { navigation } from '../../engine/permissions';
import { warning as notify } from '../../actions/common';
import Messages from './messages';

export default class Header extends React.Component {
    _resolveMenu({ permissions, branch }) {
        let items = [];
        if (!permissions || !permissions.length) return items;

        for (let group of navigation.map) {
            if (!group.props.ignore) continue;
            if (group.props.branchDepended && !branch) continue;

            for (let item of group.items) {
                let include = true;
                for (let permission of item.permissions) {
                    if (permissions.indexOf(permission) == -1){
                        include = false;
                        break;
                    }
                }
                if (include) {
                    items.push(item);
                }
            }
        }
        return items;
    };

    componentDidMount() {
        this.setState({
            menu: this._resolveMenu(this.props)
        })
    }

    componentWillReceiveProps(props) {
        this.setState({
            menu: this._resolveMenu(props)
        })
    }

    render() {
        let { profile, workspace } = this.props;
        return (
            <Navbar fixedTop={true} fluid={true}>
                <Navbar.Header>
                    <Navbar.Brand>
                        <a href="/">
                            {(profile && profile.organization.name) || 'PAWNSHOP'}
                        </a>
                        {workspace && <span> // {workspace.name}</span>}
                    </Navbar.Brand>
                </Navbar.Header>
                {profile && this.renderProfileMenu(profile)}
            </Navbar>
        );
    };

    renderProfileMenu(profile) {
        let { branch, onNavigate, onBranchChange, onLogout, messages } = this.props;
        let { menu } = this.state;
       
        return (
            <Nav pullRight>
                {menu && menu.length > 0 &&
                    <NavDropdown eventKey={3} noCaret title={<Glyphicon className="text-primary" glyph="flash" />} id="quick-menu">
                        {this.state.menu.map((item, i) => <MenuItem key={i} eventKey={i} onClick={() => this.props.onNavigate(item)}>{item.name}</MenuItem>)}
                    </NavDropdown>
                }
                <Messages />
                {branch &&
                <NavDropdown eventKey={0} title={branch.displayName} id="branch-menu">
                    {profile.branches.map(b =>
                        <MenuItem key={b.id} eventKey={b.id} onClick={() => onBranchChange(b)}>{b.displayName}</MenuItem>)}
                </NavDropdown>}
                <NavDropdown eventKey={1} title={profile.user.fullname} id="profile-menu">
                    <MenuItem eventKey={1.1} onClick={() => onNavigate('/profile')}>
                        <Glyphicon glyph="user" /> Профиль
                    </MenuItem>
                    <MenuItem eventKey={1.2} onClick={() => onNavigate('/profile/password')}>
                        <Glyphicon glyph="lock" /> Сменить пароль
                    </MenuItem>
                    <MenuItem divider />
                    <MenuItem eventKey={1.3} onClick={() => onNavigate('/configuration/organization')}>
                        <Glyphicon glyph="cog" /> Конфигурация организации
                    </MenuItem>
                    {profile.branches && profile.branches.length > 0 &&
                        <MenuItem eventKey={1.4} onClick={() => onNavigate('/configuration/branch')}>
                            <Glyphicon glyph="cog"/> Конфигурация филиала
                        </MenuItem>
                    }
                    <MenuItem divider />
                    <MenuItem eventKey={1.100} onClick={onLogout}>
                        <Glyphicon glyph="log-out" /> Выход
                    </MenuItem>
                </NavDropdown>
            </Nav>
        );
    }
}