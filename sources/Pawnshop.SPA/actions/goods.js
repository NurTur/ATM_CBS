import { CALL_API } from '../middleware/api';
import * as ActionTypes from './actionTypes';

export const list = query => dispatch => {
    return dispatch({
        data: query,
        [CALL_API]: {
            endpoint: 'goods/list',
            actionType: ActionTypes.WORKSPACE_LIST
        }
    });
};

export const card = query => dispatch => {
    if (query == 0) {
        return dispatch({
            data: {
                collateralType: 30
            },
            type: ActionTypes.WORKSPACE_CARD
        });
    }
    return dispatch({
        data: query,
        [CALL_API]: {
            endpoint: 'goods/card',
            actionType: ActionTypes.WORKSPACE_CARD
        }
    });
};

export const save = query => dispatch => {
    return dispatch({
        data: query,
        [CALL_API]: {
            endpoint: 'goods/save',
            actionType: ActionTypes.WORKSPACE_CARD
        }
    });
};

export const add = query => dispatch => {
    return dispatch({
        data: query,
        [CALL_API]: {
            endpoint: 'goods/save'
        }
    });
};

export const remove = query => dispatch => {
    return dispatch({
        data: query,
        [CALL_API]: {
            endpoint: 'goods/delete',
            actionType: ActionTypes.WORKSPACE_CARD
        }
    });
};