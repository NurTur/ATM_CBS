import React, { PropTypes } from 'react';
import { Router, browserHistory } from 'react-router';
import { Provider } from 'react-redux';

import Routes from './routes';

const Root = ({ store }) => (
  <Provider store={store}>
    <Router history={browserHistory} routes={Routes()} />
  </Provider>
);

Root.propTypes = {
  store: PropTypes.object.isRequired,
};

export default Root;