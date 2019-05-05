import { CALL_API } from '../middleware/api';
import * as ActionTypes from './actionTypes';

export const list = query => dispatch => {
    return dispatch({
        data: query,
        [CALL_API]: {
            endpoint: 'car/list',
            actionType: ActionTypes.WORKSPACE_LIST
        }
    });
};

export const card = query => dispatch => {
    if (query == 0) {
        return dispatch({
            data: {
                collateralType: 20
            },
            type: ActionTypes.WORKSPACE_CARD
        });
    }
    return dispatch({
        data: query,
        [CALL_API]: {
            endpoint: 'car/card',
            actionType: ActionTypes.WORKSPACE_CARD
        }
    });
};

export const save = query => dispatch => {
    query.name = query.transportNumber;

    return dispatch({
        data: query,
        [CALL_API]: {
            endpoint: 'car/save',
            actionType: ActionTypes.WORKSPACE_CARD
        }
    });
};

export const add = query => dispatch => {
    query.name = query.transportNumber;

    return dispatch({
        data: query,
        [CALL_API]: {
            endpoint: 'car/save'
        }
    });
};

export const remove = query => dispatch => {
    return dispatch({
        data: query,
        [CALL_API]: {
            endpoint: 'car/delete',
            actionType: ActionTypes.WORKSPACE_CARD
        }
    });
};

export const marks = query => dispatch => {
    return dispatch({
        [CALL_API]: {
            endpoint: 'car/marks',
            actionType: ActionTypes.DICT_CAR_MARKS
        }
    });
};

export const models = query => dispatch => {
    return dispatch({
        [CALL_API]: {
            endpoint: 'car/models',
            actionType: ActionTypes.DICT_CAR_MODELS
        }
    });
};

export const colors = query => dispatch => {
    return dispatch({
        [CALL_API]: {
            endpoint: 'car/colors',
            actionType: ActionTypes.DICT_CAR_COLORS
        }
    });
};
