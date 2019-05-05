import { CALL_API } from '../middleware/api';
import * as ActionTypes from './actionTypes';

export const list = query => dispatch => {
    return dispatch({
        data: query,
        [CALL_API]: {
            endpoint: 'notificationReceiver/list',
            actionType: ActionTypes.RECEIVER_LIST
        }
    });
};

export const save = query => dispatch => {
    return dispatch({
        data: query,
        [CALL_API]: {
            endpoint: 'notificationReceiver/save',
            actionType: ActionTypes.RECEIVER_CARD
        }
    });
};

export const remove = query => dispatch => {
    return dispatch({
        data: query,
        [CALL_API]: {
            endpoint: 'notificationReceiver/delete',
            actionType: ActionTypes.RECEIVER_CARD
        }
    });
};

export const select = query => dispatch => {
    return dispatch({
        data: query,
        [CALL_API]: {
            endpoint: 'notificationReceiver/select'
        }
    });
};

export const change = receiver => dispatch => {
    return dispatch({
        type: ActionTypes.RECEIVER_CHANGE,
        data: receiver
    });
};