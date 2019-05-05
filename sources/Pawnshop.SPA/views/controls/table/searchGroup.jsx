import React from 'react';
import { InputGroup, FormControl, Button, Glyphicon } from 'react-bootstrap';
import classnames from 'classnames';

export default class SearchGroup extends React.Component {
    state = {
        text: "",
        active: false
    };

    handleSearchClick = e => {
        e.preventDefault();
        if (this.state.text && this.state.text.length >= 3) {
            this.setState({active:true});
            this.props.onFilter(this.state.text);
        }
    };

    handleRemoveClick = e => {
        e.preventDefault();
        this.setState({text:"",active:false});
        this.props.onFilter(null);
    };

    handleInput = e => {
        this.setState({text: e.target.value});
    };

    handleKey = e => {
        if (e.key === 'Enter') {
            if (this.state.text && this.state.text.length >= 3) {
                this.setState({active:true});
                this.props.onFilter(this.state.text);
            }
        }
    };

    render = () =>
        <InputGroup className={this.props.className}>
            <FormControl type="text" value={this.state.text} onChange={this.handleInput} onKeyPress={this.handleKey} placeholder="Поиск..." />
            <InputGroup.Button style={{width:"inherit"}}>
                <Button className={classnames({hidden:!this.state.active})} onClick={this.handleRemoveClick}>
                    <Glyphicon glyph="remove" />
                </Button>
                <Button onClick={this.handleSearchClick}>
                    <Glyphicon glyph="search" />
                </Button>
            </InputGroup.Button>
        </InputGroup>
}
