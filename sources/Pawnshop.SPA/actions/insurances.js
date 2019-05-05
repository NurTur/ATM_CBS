import { CALL_API } from '../middleware/api';
import * as ActionTypes from './actionTypes';

export const list = query => dispatch => {
    return dispatch({
        data: query,
        [CALL_API]: {
            endpoint: 'insurance/list',
            actionType: ActionTypes.INSURANCE_LIST
        }
    });
};

export const card = query => dispatch => {
    return dispatch({
        data: query,
        [CALL_API]: {
            endpoint: 'insurance/card',
            actionType: ActionTypes.INSURANCE_CARD
        }
    });
};

export const find = query => dispatch => {
    return dispatch({
        data: query,
        [CALL_API]: {
            endpoint: 'insurance/find',
            actionType: ActionTypes.INSURANCE_CARD
        }
    });
};

export const save = query => dispatch => {
    return dispatch({
        data: query,
        [CALL_API]: {
            endpoint: 'insurance/save',
            actionType: ActionTypes.INSURANCE_CARD
        }
    });
};

export const remove = query => dispatch => {
    return dispatch({
        data: query,
        [CALL_API]: {
            endpoint: 'insurance/delete',
            actionType: ActionTypes.INSURANCE_CARD
        }
    });
};

export const actionSign = query => dispatch => {
    return dispatch({
        data: query,
        [CALL_API]: {
            endpoint: 'insuranceAction/sign'
        }
    });
};

export const actionCancel = query => dispatch => {
    return dispatch({
        data: query,
        [CALL_API]: {
            endpoint: 'insuranceAction/cancel'
        }
    });
};