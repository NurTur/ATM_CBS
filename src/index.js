import React from 'react';
import ReactDOM from 'react-dom';
import Authenticate from "components/authenticate.jsx";
import Cities from "components/cities.jsx";
import PersonalAccount from "components/personalAccount.jsx";
import DataPersAcc from "components/dataPersAcc.jsx";

import Store from "store";
import { createStore } from 'redux';
import { Provider } from "react-redux";
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';


const store = createStore(Store);
store.subscribe(() => console.log(store.getState()));


const Roster = () => (
  <Switch>
    <Route exact path="/personalAccount" component={PersonalAccount} />
    <Route path='/personalAccount/:id' component={DataPersAcc}/> 
  </Switch>
)

class Main extends React.Component {
    render() {
    return (
      <Provider store={store}>
       <Router>
          <Switch>
            <Route exact path="/" component={Authenticate} />
            <Route path="/cities" component={Cities} />
            <Route path="/personalAccount" component={Roster} />         
          </Switch>
        </Router>
      </Provider>)
  }
}


ReactDOM.render(<Main />,
  document.getElementById("app")
)
