import * as ActionTypes from '../actions/actionTypes';

const initialState = () => {
    return {
        query: null,
        current: null,
        list: null,
        card: null
    };
};

export function receiver(state = initialState(), action) {
    switch (action.type) {
        case ActionTypes.RECEIVER_CHANGE:
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
        case ActionTypes.RECEIVER_LIST:
            return Object.assign({}, state, {
                query: action.query,
                list: action.data
            });
            break;
        case ActionTypes.RECEIVER_CARD:
            return Object.assign({}, state, {
                card: action.data
            });
            break;
    }

    return state;
}