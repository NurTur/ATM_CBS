import React from 'react';
import { Redirect } from 'react-router';

class BasePage extends React.Component {
 state={ direction: null }

 handleClick=(event)=>
 {
   event.preventDefault();
   this.setState({direction:"SecondPage"});
 } 

 render()
 {
  if (this.state.direction==="SecondPage") {
    return <Redirect to={`/communal`} />
} else {
   return (<div>Nurbolat<button onClick={this.handleClick}>Button</button></div>) 
 } 
}
}

export default BasePage;