import { CALL_API } from '../middleware/api';
import * as ActionTypes from './actionTypes';

export const permissions = query => dispatch => {
    return dispatch({
        data: query,
        [CALL_API]: {
            endpoint: 'dictionary/permissions',
            actionType: ActionTypes.DICT_PERMISSION
        }
    });
};

export const groups = query => dispatch => {
    return dispatch({
        data: query,
        [CALL_API]: {
            endpoint: 'dictionary/groups',
            actionType: ActionTypes.DICT_GROUPS
        }
    });
};

export const reasons = query => dispatch =>{
    return dispatch({
        data: query,
        [CALL_API]: {
            endpoint: 'dictionary/blackReasons',
            actionType: ActionTypes.DICT_BLACK_REASON
        }
    })
};

export const users = query => dispatch => {
    return dispatch({
        data: query,
        [CALL_API]: {
            endpoint: 'dictionary/users',
            actionType: ActionTypes.DICT_USERS
        }
    });
};

export const roles = query => dispatch => {
    return dispatch({
        data: query,
        [CALL_API]: {
            endpoint: 'dictionary/roles',
            actionType: ActionTypes.DICT_ROLES
        }
    });
};

export const banks = query => dispatch => {
    return dispatch({
        data: query,
        [CALL_API]: {
            endpoint: 'dictionary/banks',
            actionType: ActionTypes.DICT_BANKS
        }
    });
};

export const clients = query => dispatch => {
    return dispatch({
        data: query,
        [CALL_API]: {
            endpoint: 'dictionary/clients'
        }
    });
};

export const positions = query => dispatch => {
    return dispatch({
        data: query,
        [CALL_API]: {
            endpoint: 'dictionary/positions'
        }
    });
};

export const cars = query => dispatch => {
    return dispatch({
        data: query,
        [CALL_API]: {
            endpoint: 'dictionary/cars'
        }
    });
};

export const machineries = query => dispatch => {
    return dispatch({
        data: query,
        [CALL_API]: {
            endpoint: 'dictionary/machineries'
        }
    });
};

export const categories = query => dispatch => {
    return dispatch({
        data: query,
        [CALL_API]: {
            endpoint: 'dictionary/categories',
            actionType: ActionTypes.DICT_CATEGORIES
        }
    });
};

export const carCategories = query => dispatch => {
    query = query || {};
    query.model = { collateralType: 20 };

    return dispatch({
        data: query,
        [CALL_API]: {
            endpoint: 'dictionary/categories',
            actionType: ActionTypes.DICT_CATEGORIES_CAR
        }
    });
};

export const goldCategories = query => dispatch => {
    query = query || {};
    query.model = { collateralType: 10 };

    return dispatch({
        data: query,
        [CALL_API]: {
            endpoint: 'dictionary/categories',
            actionType: ActionTypes.DICT_CATEGORIES_GOLD
        }
    });
};

export const goodCategories = query => dispatch => {
    query = query || {};
    query.model = { collateralType: 30 };

    return dispatch({
        data: query,
        [CALL_API]: {
            endpoint: 'dictionary/categories',
            actionType: ActionTypes.DICT_CATEGORIES_GOOD
        }
    });
};

export const machineryCategories = query => dispatch => {
    query = query || {};
    query.model = { collateralType: 40 };

    return dispatch({
        data: query,
        [CALL_API]: {
            endpoint: 'dictionary/categories',
            actionType: ActionTypes.DICT_CATEGORIES_MACHINERY
        }
    });
};

export const accounts = query => dispatch => {
    return dispatch({
        data: query,
        [CALL_API]: {
            endpoint: 'dictionary/accounts',
            actionType: ActionTypes.DICT_ACCOUNTS
        }
    });
};

export const purities = query => dispatch => {
    return dispatch({
        data: query,
        [CALL_API]: {
            endpoint: 'dictionary/purities',
            actionType: ActionTypes.DICT_PURITIES
        }
    });
};

export const eventCodes = query => dispatch => {
    return dispatch({
        data: query,
        [CALL_API]: {
            endpoint: 'dictionary/eventCodes',
            actionType: ActionTypes.DICT_EVENT_CODES
        }
    });
};

export const expenseGroups = query => dispatch => {
    return dispatch({
        data: query,
        [CALL_API]: {
            endpoint: 'dictionary/expenseGroups',
            actionType: ActionTypes.DICT_EXPENSE_GROUPS
        }
    });
};

export const expenseTypes = query => dispatch => {
    return dispatch({
        data: query,
        [CALL_API]: {
            endpoint: 'dictionary/expenseTypes',
            actionType: ActionTypes.DICT_EXPENSE_TYPES
        }
    });
};

export const organizations = query => dispatch => {
    return dispatch({
        data: query,
        [CALL_API]: {
            endpoint: 'dictionary/organizations',
            actionType: ActionTypes.DICT_ORGANIZATIONS
        }
    });
};

export const clientBlackListReasons = query => dispatch => {
    return dispatch({
        data: query,
        [CALL_API]: {
            endpoint: 'dictionary/clientBlackListReasons',
            actionType: ActionTypes.DICT_CLIENT_BLACK_REASONS
        }
    });
};

export const messages = query => dispatch => {
    return dispatch({
        data: query,
        [CALL_API]: {
            endpoint: 'dictionary/messages',
            actionType: ActionTypes.DICT_MESSAGES
        }
    });
};