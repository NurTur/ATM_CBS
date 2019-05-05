import { CALL_API } from '../middleware/api';
import * as ActionTypes from './actionTypes';
import moment from 'moment';

export const list = query => dispatch => {
    return dispatch({
        data: query,
        [CALL_API]: {
            endpoint: 'remittance/list',
            actionType: ActionTypes.WORKSPACE_LIST
        }
    });
};

export const card = query => dispatch => {
    if (query == 0) {
        return dispatch({
            data: {
                sendDate: moment().startOf('day')
            },
            type: ActionTypes.WORKSPACE_CARD
        });
    }
    return dispatch({
        data: query,
        [CALL_API]: {
            endpoint: 'remittance/card',
            actionType: ActionTypes.WORKSPACE_CARD
        }
    });
};

export const save = query => dispatch => {
    return dispatch({
        data: query,
        [CALL_API]: {
            endpoint: 'remittance/save',
            actionType: ActionTypes.WORKSPACE_CARD
        }
    });
};

export const remove = query => dispatch => {
    return dispatch({
        data: query,
        [CALL_API]: {
            endpoint: 'remittance/delete',
            actionType: ActionTypes.WORKSPACE_CARD
        }
    });
};

export const receive = query => dispatch => {
    return dispatch({
        data: query,
        [CALL_API]: {
            endpoint: 'remittance/receive',
            actionType: ActionTypes.WORKSPACE_CARD
        }
    });
};

export const receiveCancel = query => dispatch => {
    return dispatch({
        data: query,
        [CALL_API]: {
            endpoint: 'remittance/receiveCancel'
        }
    });
};
