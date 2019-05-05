import { CALL_API } from '../middleware/api';

export const save = query => dispatch => {
    return dispatch({
        data: query,
        [CALL_API]: {
            endpoint: 'clientFileRow/save'
        }
    });
};

export const remove = query => dispatch => {
    return dispatch({
        data: query,
        [CALL_API]: {
            endpoint: 'clientFileRow/delete'
        }
    });
};
