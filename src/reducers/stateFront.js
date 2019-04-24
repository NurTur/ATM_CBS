import { UPDATESTATE } from "actions/stateFront";
const InitalState = { submitCard: 0, city:"" };

function StateFront(state = InitalState, action) {
    switch (action.type) {
        case UPDATESTATE: return Object.assign({}, state, action.payload);
        default: return state;
    }
};

export default StateFront;
