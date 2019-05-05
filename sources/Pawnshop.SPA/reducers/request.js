import * as ActionTypes from '../actions/actionTypes';

const initialState = () => {
    return {
        inProgress: false,
        counter: 0,
        error: null
    };
};

export function request(state = initialState(), action) {
    let counter;
    switch (action.type) {
        case ActionTypes.REQUEST_BEGIN:
            counter = state.counter+1;
            return Object.assign({}, state, {
                counter: counter,
                inProgress: counter > 0
            });
            break;
        case ActionTypes.REQUEST_END:
            counter = state.counter-1;
            if (counter < 0) counter = 0;
            return Object.assign({}, state, {
                counter: counter,
                inProgress: counter > 0
            });
            break;
        case ActionTypes.REQUEST_FAIL:
            counter = state.counter-1;
            if (counter < 0) counter = 0;
            return Object.assign({}, state, {
                counter: counter,
                inProgress: counter > 0,
                error: action.data
            });
            break;
    }

    return state;
}