import { CALL_API } from '../middleware/api';
import * as ActionTypes from './actionTypes';
import moment from 'moment';

export const list = query => dispatch => {
    return dispatch({
        data: query,
        [CALL_API]: {
            endpoint: 'cashOrder/list',
            actionType: ActionTypes.WORKSPACE_LIST
        }
    });
};

export const card = query => dispatch => {
    if (query == 0) {
        return dispatch({
            data: {
                orderType: 10,
                orderDate: moment().startOf('day'),
                createdToday: true
            },
            type: ActionTypes.WORKSPACE_CARD
        });
    }
    return dispatch({
        data: query,
        [CALL_API]: {
            endpoint: 'cashOrder/card',
            actionType: ActionTypes.WORKSPACE_CARD
        }
    });
};

export const get = query => dispatch => {
    return dispatch({
        data: query,
        [CALL_API]: {
            endpoint: 'cashOrder/card',
        }
    });
};

export const find = query => dispatch => {
    return dispatch({
        data: query,
        [CALL_API]: {
            endpoint: 'cashOrder/find'
        }
    });    
};

export const copy = query => dispatch => {
    return dispatch({
        data: query,
        [CALL_API]: {
            endpoint: 'cashOrder/copy',
            actionType: ActionTypes.WORKSPACE_CARD
        }
    });
};

export const save = query => dispatch => {
    return dispatch({
        data: query,
        [CALL_API]: {
            endpoint: 'cashOrder/save',
            actionType: ActionTypes.WORKSPACE_CARD
        }
    });
};

export const approve = query => dispatch => {
    return dispatch({
        data: query,
        [CALL_API]: {
            endpoint: 'cashOrder/approve',
            actionType: ActionTypes.WORKSPACE_CARD
        }
    });
};

export const prohibit = query => dispatch => {
    return dispatch({
        data: query,
        [CALL_API]: {
            endpoint: 'cashOrder/prohibit',
            actionType: ActionTypes.WORKSPACE_CARD
        }
    });
};

export const remove = query => dispatch => {
    return dispatch({
        data: query,
        [CALL_API]: {
            endpoint: 'cashOrder/delete',
            actionType: ActionTypes.WORKSPACE_CARD
        }
    });
};

export const undoRemove = query => dispatch => {
    return dispatch({
        data: query,
        [CALL_API]: {
            endpoint: 'cashOrder/undoDelete',
            actionType: ActionTypes.WORKSPACE_CARD
        }
    });
};

export const excel = query => dispatch => {
    return dispatch({
        data: query,
        [CALL_API]: {
            endpoint: 'cashOrder/export'
        }
    });
};