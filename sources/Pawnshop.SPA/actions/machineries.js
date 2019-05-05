import { CALL_API } from '../middleware/api';
import * as ActionTypes from './actionTypes';

export const list = query => dispatch => {
    return dispatch({
        data: query,
        [CALL_API]: {
            endpoint: 'machinery/list',
            actionType: ActionTypes.WORKSPACE_LIST
        }
    });
};

export const card = query => dispatch => {
    if (query == 0) {
        return dispatch({
            data: {
                collateralType: 40
            },
            type: ActionTypes.WORKSPACE_CARD
        });
    }
    return dispatch({
        data: query,
        [CALL_API]: {
            endpoint: 'machinery/card',
            actionType: ActionTypes.WORKSPACE_CARD
        }
    });
};

export const save = query => dispatch => {
    query.name = query.transportNumber;

    return dispatch({
        data: query,
        [CALL_API]: {
            endpoint: 'machinery/save',
            actionType: ActionTypes.WORKSPACE_CARD
        }
    });
};

export const add = query => dispatch => {
    query.name = query.transportNumber;

    return dispatch({
        data: query,
        [CALL_API]: {
            endpoint: 'machinery/save'
        }
    });
};

export const remove = query => dispatch => {
    return dispatch({
        data: query,
        [CALL_API]: {
            endpoint: 'machinery/delete',
            actionType: ActionTypes.WORKSPACE_CARD
        }
    });
};

export const marks = query => dispatch => {
    return dispatch({
        [CALL_API]: {
            endpoint: 'machinery/marks',
            actionType: ActionTypes.DICT_MACHINERY_MARKS
        }
    });
};

export const models = query => dispatch => {
    return dispatch({
        [CALL_API]: {
            endpoint: 'machinery/models',
            actionType: ActionTypes.DICT_MACHINERY_MODELS
        }
    });
};

export const colors = query => dispatch => {
    return dispatch({
        [CALL_API]: {
            endpoint: 'machinery/colors',
            actionType: ActionTypes.DICT_MACHINERY_COLORS
        }
    });
};
