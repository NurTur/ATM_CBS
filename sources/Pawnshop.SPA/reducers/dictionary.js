import * as ActionTypes from '../actions/actionTypes';

const initialState = () => {
    return {
        permissions: [],
        groups: [],
        users: [],
        roles: [],
        banks: [],
        carMarks: [],
        carModels: [],
        carColors: [],
        machineryMarks: [],
        machineryModels: [],
        machineryColors: [],
        categories: [],
        carCategories: [],
        goldCategories: [],
        goodCategories: [],
        machineryCategories: [],
        accounts: [],
        purities: [],
        eventCodes: [],
        expenseGroups: [],
        expenseTypes: [],
        organizations: [],
        messages: []
    };
};

export function dictionary(state = initialState(), action) {
    switch (action.type) {
        case ActionTypes.DICT_PERMISSION:
            return Object.assign({}, state, {
                permissions: action.data
            });
        case ActionTypes.DICT_GROUPS:
            return Object.assign({}, state, {
                groups: action.data
            });
        case ActionTypes.DICT_USERS:
            return Object.assign({}, state, {
                users: action.data
            });
        case ActionTypes.DICT_ROLES:
            return Object.assign({}, state, {
                roles: action.data
            });
        case ActionTypes.DICT_BANKS:
            return Object.assign({}, state, {
                banks: action.data
            });
        case ActionTypes.DICT_CAR_MARKS:
            return Object.assign({}, state, {
                carMarks: action.data
            });
        case ActionTypes.DICT_CAR_MODELS:
            return Object.assign({}, state, {
                carModels: action.data
            });
        case ActionTypes.DICT_CAR_COLORS:
            return Object.assign({}, state, {
                carColors: action.data
            });
        case ActionTypes.DICT_MACHINERY_MARKS:
            return Object.assign({}, state, {
                machineryMarks: action.data
            });
        case ActionTypes.DICT_MACHINERY_MODELS:
            return Object.assign({}, state, {
                machineryModels: action.data
            });
        case ActionTypes.DICT_MACHINERY_COLORS:
            return Object.assign({}, state, {
                machineryColors: action.data
            });
        case ActionTypes.DICT_CATEGORIES:
            return Object.assign({}, state, {
                categories: action.data
            });
        case ActionTypes.DICT_CATEGORIES_CAR:
            return Object.assign({}, state, {
                carCategories: action.data
            });
        case ActionTypes.DICT_CATEGORIES_GOOD:
            return Object.assign({}, state, {
                goodCategories: action.data
            });
        case ActionTypes.DICT_CATEGORIES_GOLD:
            return Object.assign({}, state, {
                goldCategories: action.data
            });
        case ActionTypes.DICT_CATEGORIES_MACHINERY:
            return Object.assign({}, state, {
                machineryCategories: action.data
            });
        case ActionTypes.DICT_ACCOUNTS:
            return Object.assign({}, state, {
                accounts: action.data
            });
        case ActionTypes.DICT_PURITIES:
            return Object.assign({}, state, {
                purities: action.data
            });
        case ActionTypes.DICT_EVENT_CODES:
            return Object.assign({}, state, {
                eventCodes: action.data
            });
        case ActionTypes.DICT_EXPENSE_GROUPS:
            return Object.assign({}, state, {
                expenseGroups: action.data
            });
        case ActionTypes.DICT_EXPENSE_TYPES:
            return Object.assign({}, state, {
                expenseTypes: action.data.list
            });
        case ActionTypes.DICT_BLACK_VIN:
            return Object.assign({}, state, {
                blackVIN : action.data.list
            });
        case ActionTypes.DICT_BLACK_CUSTOMER:
            return Object.assign({}, state, {
                blackCustomer : action.data.list
            });
        case ActionTypes.DICT_BLACK_REASON:
            return Object.assign({}, state, {
                reasons: action.data
            });
        case ActionTypes.DICT_ORGANIZATIONS:
            return Object.assign({}, state, {
                organizations: action.data.list
            })
        case ActionTypes.DICT_MESSAGES:
            return Object.assign({}, state, {
                messages: action.data.list
            })
    }

    return state;
}