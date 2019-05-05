import React, { PropTypes } from 'react';
import { Form, FormGroup, ControlLabel, FormControl, Col, Button, Panel } from 'react-bootstrap';

export default class Auth extends React.Component {
    state = {
        username: null,
        password: null
    };

    handleSignIn(e) {
        e.preventDefault();

        this.props.onLogin(this.state);
    }

    render() {
        return (
            <div className="container">
                <Col sm={6} smOffset={3}>
                    <Panel header="Вход в систему">
                        <Form horizontal className="form-signin">
                            <FormGroup controlId="username">
                                <Col sm={4} componentClass={ControlLabel}>
                                    Пользователь
                                </Col>
                                <Col sm={8}>
                                    <FormControl type="text" onChange={e => this.setState({
                                        username: e.target.value
                                    })} />
                                </Col>
                            </FormGroup>
                            <FormGroup controlId="password">
                                <Col sm={4} componentClass={ControlLabel}>
                                    Пароль
                                </Col>
                                <Col sm={8}>
                                    <FormControl type="password" onChange={e => this.setState({
                                        password: e.target.value
                                    })} />
                                </Col>
                            </FormGroup>
                            <FormGroup>
                                <Col smOffset={4} sm={8}>
                                    <Button bsStyle="primary" type="submit" onClick={e => this.handleSignIn(e)}>
                                        Войти
                                    </Button>
                                </Col>
                            </FormGroup>
                        </Form>
                    </Panel>
                </Col>
            </div>
        );
    }
}