import React from 'react';
import { connect } from 'react-redux';

class Restrict extends React.Component {
    static propTypes = {
        permissions : React.PropTypes.any.isRequired,
        pass : React.PropTypes.bool,
        passField : React.PropTypes.string
    };
    static defaultProps = {
        pass : false,
        passField : 'readOnly'
    };

    access(userPermissions, permissions) {
        for (let p of permissions) {
            if (userPermissions.indexOf(p) < 0)
                return false;
        }
        return true;
    }

    render() {
        let child = this.props.children;
        let access = false;
        let { permissions, userPermissions, pass, passField } = this.props;
        if (typeof permissions === 'function') {
            access = permissions(userPermissions);
        } else {
            if (typeof permissions === 'string') {
                permissions = [ permissions ];
            }
            access = this.access(userPermissions, permissions);
        }
        access = access === true || access === undefined;
        if (access || pass) {
            let props = Object.assign({}, this.props, child.props);
            if (pass && !access) {
                props[passField] = !access;
            }

            return <child.type {...props} />
        }
        return null;
    }
}

export default connect(state => {
    const { auth } = state;
    return {
        userPermissions: auth.permissions
    }
})(Restrict)