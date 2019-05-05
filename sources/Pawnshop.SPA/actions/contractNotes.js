import { CALL_API } from '../middleware/api';
import * as ActionTypes from './actionTypes';

export const list = query => dispatch => {
    return dispatch({
        data: query,
        [CALL_API]: {
            endpoint: 'contractNote/list',
        }
    });
};

export const card = query => dispatch => {
    if (query == 0) {
        return dispatch({
            data: {},
        });
    }
    return dispatch({
        data: query,
        [CALL_API]: {
            endpoint: 'contractNote/card',
        }
    });
};

export const save = query => dispatch => {
    return dispatch({
        data: query,
        [CALL_API]: {
            endpoint: 'contractNote/save',
        }
    });
};

export const remove = query => dispatch => {
    return dispatch({
        data: query,
        [CALL_API]: {
            endpoint: 'contractNote/delete',
        }
    });
};