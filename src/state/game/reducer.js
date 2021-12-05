import reduceReducer from 'reduce-reducers';
import heroReducer from './hero/reducer';
import goldReducer from './gold/reducer';
import manaReducer from './mana/reducer';
import armyReducer from './army/reducer';
import {
    combineReducers,
} from 'redux';
import {makeReducer, on} from "../state-manager";
import {stateUpdaters} from "./actions";

const mainReducer = makeReducer({}, on(
    stateUpdaters.load,
    (state, {payload}) => ({
        ...state,
        ...payload,
    })
))

export default reduceReducer({}, combineReducers({
    hero: heroReducer,
    gold: goldReducer,
    mana: manaReducer,
    army: armyReducer,
}), mainReducer);