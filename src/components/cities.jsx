import React from 'react';
import { Redirect } from 'react-router';
import "style/cities.scss";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { SetSTATEFRONT } from "actions/stateFront";

class Cities extends React.Component {
 state={ direction: null }

 handleClick=(event)=>
 {
   event.preventDefault();
   this.setState({direction:"SecondPage"});
 } 

 render()
 {
  if (this.props.StateFront.city!=="") {
    return <Redirect to={`/personalAccount`} />
} else {
   return (<div className = "wrapper">
   <div className = "center">
     <div className = "button-wrap">
       <button className = "rad-button wwt flat" onClick={()=>this.props.SetSTATEFRONT({city:"almaty"})}>Алматы</button>
     </div>
     <div className = "button-wrap">
       <button className = "rad-button wwt flat" onClick={()=>this.props.SetSTATEFRONT({city:"astana"})}>Астана</button>
     </div>
     <div className = "button-wrap">
       <button className = "rad-button wwt flat" onClick={()=>this.props.SetSTATEFRONT({city:"shymkent"})}>Шымкент</button>
     </div>
   </div>
 </div>) 
 } 
}
}

export default connect(state => ({ StateFront: state.StateFront }),
    dispatch => bindActionCreators({ SetSTATEFRONT }, dispatch))(Cities);
