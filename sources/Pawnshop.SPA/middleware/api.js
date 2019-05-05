import * as ActionTypes from '../actions/actionTypes';
import { requestFail } from '../actions/common';
import { signOut } from '../actions/security';

const BASE_URL = '/api/';

function callApi(endpoint, data) {
    let token = localStorage.getItem('id_token') || null;
    let branch = localStorage.getItem('id_branch') || null;
    let config = {
        method: "post",
        body: JSON.stringify(data),
        headers: {
            'content-type': 'application/json; charset=utf-8'
        }
    };

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    if (branch) {
        config.headers.Branch = branch;
    }

    return fetch(BASE_URL + endpoint, config)
        .then(response => {
            let contentType = response.headers.get('content-type');
            let result;
            if (contentType && contentType.indexOf('json') !== -1) {
                result = response.json();
            } else {
                result = response.text();
            }

            if (!response.ok) {
                return result.then(data => Promise.reject({
                    data: data,
                    status: response.status
                }));
            }

            return result;
        })
}

export const CALL_API = Symbol('Call API');

export default store => next => action => {
    const callAPI = action[CALL_API];
    const data = action.data;

    // So the middleware doesn't get applied to every single action
    if (typeof callAPI === 'undefined') {
        return next(action)
    }

    let { endpoint, actionType } = callAPI;

    next({
        type: ActionTypes.REQUEST_BEGIN
    });

    // Passing the authenticated boolean back in our data will let us distinguish between normal and secret quotes
    return callApi(endpoint, data).then(
        response => {
            let action = {
                query: data,
                data: response,
                type: actionType
            };

            next({
                type: ActionTypes.REQUEST_END
            });
            if (actionType) {
                next(action);
                return action;
            } else {
                return action;
            }
        },
        error => {
            switch (error.status) {
                case 401:
                    store.dispatch(signOut());
                    break;
            }
            store.dispatch(requestFail(error));
            next({
                data: error.data,
                type: ActionTypes.REQUEST_FAIL
            });
            return Promise.reject({
                data: error.data,
            });
        }
    )
}