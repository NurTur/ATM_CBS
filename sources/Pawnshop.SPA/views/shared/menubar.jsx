import React from 'react';
import { Panel, ListGroup, ListGroupItem } from 'react-bootstrap';
import { navigation } from '../../engine/permissions';

export default class MenuBar extends React.Component {
    static propTypes = {
        permissions: React.PropTypes.array.isRequired,
        onNavigate: React.PropTypes.func.isRequired
    };

    state = { };

    _resolveMenu(permissions) {
        let result = [];
        if (!permissions || !permissions.length) return result;

        for (let group of navigation.map) {
            if (group.props.ignore) continue;
            if (group.props.branchDepended && !this.props.branch) continue;

            let items = [];
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
            if (items.length) {
                result.push({
                    name: group.name,
                    props: group.props,
                    items: items
                })
            }
        }
        return result;
    };

    componentDidMount() {
        this.setState({
            menu: this._resolveMenu(this.props.permissions)
        })
    }

    componentWillReceiveProps(props) {
        this.setState({
            menu: this._resolveMenu(props.permissions)
        })
    }

    render() {
        if (!this.state.menu) return null;
        return (
            <div>
                {this.state.menu.map((group, i) => {
                    return (
                        <Panel key={i} collapsible defaultExpanded header={group.name}>
                            <ListGroup fill>
                                {group.items.map((item, i) =>
                                    <ListGroupItem key={i} active={this.props.workspace && this.props.workspace.link == item.link}
                                                   onClick={() => this.props.onNavigate(item)}>{item.name}</ListGroupItem>
                                )}
                            </ListGroup>
                        </Panel>
                    );
                })}
            </div>
        );
    }
}