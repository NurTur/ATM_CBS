import * as ActionTypes from '../actions/actionTypes';

const initialState = () => {
    return {
        query: null,
        current: null,
        list: null,
        card: null
    };
};

export function insurance(state = initialState(), action) {
    switch (action.type) {
        case ActionTypes.INSURANCE_CHANGE:
            let changed = !action.data || !state.current || state.current !== action.data;
            if (changed) {
                return Object.assign({}, state, {
                    query: null,
                    current: action.data,
                    list: null,
                    card: null
                });
            } else return state;
            break;
        case ActionTypes.INSURANCE_LIST:
            return Object.assign({}, state, {
                query: action.query,
                list: action.data
            });
            break;
        case ActionTypes.INSURANCE_CARD:
            return Object.assign({}, state, {
                card: action.data
            });
            break;
    }

    return state;
}