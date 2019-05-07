import React from "react";
import { InputGroup, InputGroupAddon, Button, Input } from 'reactstrap';
import "../styles/header.less";

class Header extends React.Component {
    render() {
        return (
            <div id="headBox">
                <img src="/public/images/logo.png" />
                <h3 className="captionLogo">CBS Service</h3>
                <InputGroup>
                    <InputGroupAddon addonType="prepend">
                        <Button>To the Left!</Button>
                    </InputGroupAddon>
                    <Input />
                </InputGroup>
            </div>
        )

    }
}

export default Header;