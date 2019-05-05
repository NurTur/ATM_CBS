import { CALL_API } from '../middleware/api';

export const list = query => dispatch => {
    return dispatch({
        data: query,
        [CALL_API]: {
            endpoint: 'notificationLog/list',
        }
    });
};
