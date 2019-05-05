import { CALL_API } from '../middleware/api';
import * as ActionTypes from './actionTypes';

export const list = query => dispatch => {
    return dispatch({
        data: query,
        [CALL_API]: {
            endpoint: 'eventLog/list',
            actionType: ActionTypes.WORKSPACE_LIST
        }
    });
};

export const excel = query => dispatch => {
    return dispatch({
        data: query,
        [CALL_API]: {
            endpoint: 'eventLog/export'
        }
    });
};