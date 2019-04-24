import { CREATEPERSACC } from "actions/persAcc";

const InitalState = [];

function PersAcc(state = InitalState, action) {
    switch (action.type) {
        case CREATEPERSACC: return action.payload;
        default: return state;
    }
};

export default PersAcc;
