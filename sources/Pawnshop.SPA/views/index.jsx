import React from 'react';
import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import { render } from 'react-dom';

import thunk from 'redux-thunk';
import api from '../middleware/api';
import file from '../middleware/file';
import print from '../middleware/print';
import createLogger from 'redux-logger';
import { reducer as formReducer } from 'redux-form';
import { reducer as notificationsReducer } from 'react-notification-system-redux';

import Root from './routes/root';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export function init({ containerId, reducers }) {
    reducers.form = formReducer;
    reducers.notifications = notificationsReducer;

    render(Root({
        store: createStore(
            combineReducers(reducers),
            composeEnhancers(
                applyMiddleware(
                    thunk,
                    api,
                    file,
                    print,
                    createLogger())
            )
        )
    }), document.getElementById(containerId));
}