import React from 'react';
import { connect } from "react-redux";
import { Redirect } from 'react-router';
import AuthRequest from "./organisms/authRequest";

import "style/loginPage.scss"

class Authenticate extends React.Component {
    state = { password: "",card_number:"" }

    handleCard = (event) => this.setState({ card_number: event.target.value });
      
    render() {
        if (this.props.StateFront.submitCard === 20) {
            return <Redirect to={`/cities`} />
        } else {
            const { card_number } = this.state;

            let  resultSubmit;
            const opacity = ((card_number.length > 0) ? "2" : "1");
            const submitView = `submit opacity${opacity} color1`;

            const request = { card_number, submitView };

            if (this.props.StateFront.submitCard === 0) {
                resultSubmit = <div className="alert"><p>Wellcome,</p><p>please</p><p>card number</p></div> }
            else if (this.props.StateFront.submitCard === 10) {
                resultSubmit = <div className="alert" style={{color:"red"}}><p>Card</p><p>number</p><p>not true</p></div> }
            else  { resultSubmit = <div className="alert"><p>Wellcome</p></div> }

           

            return (<div id="LoginPage">        
                    <main id="formContainer">
                        <section id="sec1">{resultSubmit}</section>
                        <section id="sec2">
                            <form className="ui-form">
                                <div className="form-row">
                                    <input type="text" id="username" onChange={this.handleCard} value={card_number} required />
                                    <label htmlFor="username">NUMBER OF CARD</label>
                                </div>  
                                                        
                            </form>  
                       {opacity === "2" ? <AuthRequest Request={request} /> :<input type="submit" className={submitView} value={"LOG IN"} />}                         
                        </section>
                </main>
            </div>
            )
        }
    }
}

export default connect(state => ({ Card: state.Card, StateFront: state.StateFront }))(Authenticate);

