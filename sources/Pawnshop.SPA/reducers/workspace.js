import * as ActionTypes from '../actions/actionTypes';

const initialState = () => {
    return {
        query: null,
        current: null,
        list: null,
        card: null
    };
};

export function workspace(state = initialState(), action) {
    switch (action.type) {
        case ActionTypes.WORKSPACE_CHANGE:
            let changed = !action.data || !state.current || state.current.link !== action.data.link;
            if (changed) {
                return Object.assign({}, state, {
                    query: null,
                    current: action.data,
                    list: null,
                    card: null
                });
            } else return state;
            break;
        case ActionTypes.WORKSPACE_LIST:
            return Object.assign({}, state, {
                query: action.query,
                list: action.data
            });
            break;
        case ActionTypes.WORKSPACE_CARD:
            return Object.assign({}, state, {
                card: action.data
            });
            break;
    }

    return state;
}