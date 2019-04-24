import { CREATECARD } from "actions/card";

const InitalState = [];

function Card(state = InitalState, action) {
    switch (action.type) {
        case CREATECARD: return action.payload;
        default: return state;
    }
};

export default Card;
