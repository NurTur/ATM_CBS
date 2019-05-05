import { CALL_API } from '../middleware/api';
import * as ActionTypes from './actionTypes';
import moment from 'moment';

export const list = query => dispatch => {
    return dispatch({
        data: query,
        [CALL_API]: {
            endpoint: 'selling/list',
            actionType: ActionTypes.WORKSPACE_LIST
        }
    });
};

export const card = query => dispatch => {
    return dispatch({
        data: query,
        [CALL_API]: {
            endpoint: 'selling/card',
            actionType: ActionTypes.WORKSPACE_CARD
        }
    });
};

export const save = query => dispatch => {
    return dispatch({
        data: query,
        [CALL_API]: {
            endpoint: 'selling/save',
            actionType: ActionTypes.WORKSPACE_CARD
        }
    });
};

export const sell = query => dispatch => {
    return dispatch({
        data: query,
        [CALL_API]: {
            endpoint: 'selling/sell',
            actionType: ActionTypes.WORKSPACE_CARD
        }
    });
};

export const cancel = query => dispatch => {
    return dispatch({
        data: query,
        [CALL_API]: {
            endpoint: 'selling/cancel',
            actionType: ActionTypes.WORKSPACE_CARD
        }
    });
};

export const remove = query => dispatch => {
    return dispatch({
        data: query,
        [CALL_API]: {
            endpoint: 'selling/delete',
            actionType: ActionTypes.WORKSPACE_CARD
        }
    });
};

export const excel = query => dispatch => {
    return dispatch({
        data: query,
        [CALL_API]: {
            endpoint: 'selling/export'
        }
    });
};