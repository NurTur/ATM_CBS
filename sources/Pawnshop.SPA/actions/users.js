import { CALL_API } from '../middleware/api';
import * as ActionTypes from './actionTypes';

export const list = query => dispatch => {
    return dispatch({
        data: query,
        [CALL_API]: {
            endpoint: 'user/list',
            actionType: ActionTypes.WORKSPACE_LIST
        }
    });
};

export const card = query => dispatch => {
    if (query == 0) {
        return dispatch({
            data: {
                member: {},
                groups: [],
                roles: []
            },
            type: ActionTypes.WORKSPACE_CARD
        });
    }
    return dispatch({
        data: query,
        [CALL_API]: {
            endpoint: 'user/card',
            actionType: ActionTypes.WORKSPACE_CARD
        }
    });
};

export const save = query => dispatch => {
    return dispatch({
        data: query,
        [CALL_API]: {
            endpoint: 'user/save',
            actionType: ActionTypes.WORKSPACE_CARD
        }
    });
};

export const reset = query => dispatch => {
    return dispatch({
        data: query,
        [CALL_API]: {
            endpoint: 'user/reset',
            actionType: ActionTypes.WORKSPACE_CARD
        }
    });
};