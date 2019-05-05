import { CALL_API } from '../middleware/api';
import * as ActionTypes from './actionTypes';

export const list = query => dispatch => {
    return dispatch({
        data: query,
        [CALL_API]: {
            endpoint: 'loanPercent/list',
            actionType: ActionTypes.WORKSPACE_LIST
        }
    });
};

export const card = query => dispatch => {
    if (query == 0) {
        return dispatch({
            data: {},
            type: ActionTypes.WORKSPACE_CARD
        });
    }
    return dispatch({
        data: query,
        [CALL_API]: {
            endpoint: 'loanPercent/card',
            actionType: ActionTypes.WORKSPACE_CARD
        }
    });
};

export const find = query => dispatch => {
    return dispatch({
        data: query,
        [CALL_API]: {
            endpoint: 'loanPercent/find'
        }
    });
};

export const save = query => dispatch => {
    return dispatch({
        data: query,
        [CALL_API]: {
            endpoint: 'loanPercent/save',
            actionType: ActionTypes.WORKSPACE_CARD
        }
    });
};

export const remove = query => dispatch => {
    return dispatch({
        data: query,
        [CALL_API]: {
            endpoint: 'loanPercent/delete',
            actionType: ActionTypes.WORKSPACE_CARD
        }
    });
};