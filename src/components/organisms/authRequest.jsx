import React from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { SetCARD } from "actions/card";
import PostLogin from "api/postLogin";

class AuthRequest extends React.Component {
    handleClick = (event) => {
        event.preventDefault();
        const { card_number } = this.props.Request;
        this.auth(card_number);
      }

    auth = async (obj) => {
        try {
            const result = await PostLogin(obj);
            if (result.card.length===1)
            {  this.props.StateFront.submitCard=20; } 
            else { this.props.StateFront.submitCard=10;}            
            await this.props.SetCARD(result.card);        
        }
        catch (error) {
            console.log(error);
        }
    }

    render() {
        const { submitView } = this.props.Request;
        return (<input type="submit" className={submitView} value={"LOG IN"} onClick={this.handleClick} />)
    }
}

export default connect(state => ({ Card: state.Card, StateFront: state.StateFront }),
    dispatch => bindActionCreators({ SetCARD }, dispatch))(AuthRequest);

