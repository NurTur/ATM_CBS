import React from 'react';
import { browserHistory } from 'react-router';
import { Navbar, Nav, NavDropdown, MenuItem, Glyphicon, Button } from 'react-bootstrap';
import { connect } from 'react-redux';

class Messages extends React.Component {
    static propTypes = {
        messages: React.PropTypes.array.isRequired
    };
    static defaultProps = {
        messages: []
    };

    state = { clickCount: 0 }

    /*shouldComponentUpdate(nextProps, nextState) {
        console.log("*******************", this.props.auth.branchId, '  ', nextProps.auth.branchId);
        console.log("*******************", this.state.clickCount, '  ', nextState.clickCount);
        if ((this.state.clickCount !== nextState.clickCount) || (this.props.auth.branchId != nextProps.auth.branchId)) {
            console.log("fgghfgghf");
            return true;
        }
        return false;
    }*/

    style = { position: "absolute", right: 5, marginTop: 5, width: 10, height: 10, borderRadius: '50%' };
    styleRed = Object.assign({}, this.style, { background: 'red' });
    styleYellow = Object.assign({}, this.style, { background: 'yellow' });
    styleGreen = Object.assign({}, this.style, { background: 'green' });

    changeStatusOfMessage(i) {
        const item = this.props.dictionary.messages[i];
        if (item.status === 10) {
            this.props.dictionary.messages[i].status = 20;
            this.setState(function (prevState, props) {
                return { clickCount: prevState.clickCount + 1 }
            });
        }
        else if (item.status === 0) {
            this.props.dictionary.messages[i].status = 10;
            this.setState({ clickCount: this.state.clickCount + 1 });
            browserHistory.push(`/contracts/${item.entityId}`);
        }
    }

    render() {
        let messages = this.props.dictionary.messages;
        console.log("----------------------------------------------------------------------", this.props.auth.branchId, '    ', messages);

        return (
            <NavDropdown eventKey={4} noCaret title={<Glyphicon className={(messages.length > 0) && "text-primary" || "text-secondary"} glyph="envelope" />} id="quick-menu">
                {(messages.length > 0)
                    ? messages.map((item, i) =>
                        <MenuItem key={i} eventKey={i} onClick={() => this.changeStatusOfMessage(i)}>
                            <div>
                                {item.status === 0 ? <div style={this.styleRed}></div> :
                                    (item.status === 10 ? <div style={this.styleYellow}></div> :
                                        <div style={this.styleGreen}></div>)}
                                {item.message}
                            </div>
                        </MenuItem>) : <MenuItem key={1} eventKey={1}> <div>Нет непрочитанных уведомлений.</div></MenuItem>}
            </NavDropdown>
        );
    };
}

export default connect(state => ({ dictionary: state.dictionary, auth: state.auth }))(Messages);