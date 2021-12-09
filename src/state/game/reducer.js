import reduceReducer from 'reduce-reducers';
import heroReducer from './hero/reducer';
import goldReducer from './gold/reducer';
import manaReducer from './mana/reducer';
import armyReducer from './army/reducer';
import battleReducer from './battle/reducer';
import prestigeReducer from './prestige/reducer';
import {
    combineReducers,
} from 'redux';
import {makeReducer, on} from "../state-manager";
import {stateUpdaters} from "./actions";
import {prestiges} from "../../database/prestige";

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
    battle: battleReducer,
    prestige: prestigeReducer,
}), mainReducer);