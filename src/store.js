import { combineReducers } from "redux";
import Card from "reducers/card";
import StateFront from "reducers/stateFront";
import PersAcc from "reducers/PersAcc";

const store = combineReducers({ Card, StateFront,PersAcc });
export default store;
