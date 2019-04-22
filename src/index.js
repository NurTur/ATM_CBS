import React from 'react';
import ReactDOM from 'react-dom';
import BasePage from "components/organisms/basePage.jsx";
import SecondPage from "components/organisms/SecondPage.jsx";
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

class Main extends React.Component {
    render() {
    return (
       <Router>
          <Switch>
            <Route exact path="/" component={BasePage} />
            <Route path="/communal" component={SecondPage} />
          </Switch>
        </Router>)
  }
}


ReactDOM.render(<Main />,
  document.getElementById("app")
)
