import React from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { SetPERSACC } from "actions/persAcc";
import GetPersAcc from "api/getPersAcc";


class PersAccRequest extends React.Component {

    handleClick = (event) => {
        event.preventDefault();
        const obj= {city:this.props.StateFront.city, schet:this.props.schet};
        this.onGetFromServer(obj);
      }

      onGetFromServer = async (obj) => {
        try {
            const result = await GetPersAcc(obj);
            this.props.SetPERSACC(result.schet);      
        }
        catch (error) {
            console.log(error);
        }
    }
    render() {
        return (<button onClick={this.handleClick}>Вперед</button>)
    }
}

export default connect(state => ({ PersAcc: state.PersAcc, StateFront: state.StateFront }),
    dispatch => bindActionCreators({ SetPERSACC }, dispatch))(PersAccRequest);