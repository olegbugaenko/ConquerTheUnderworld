import heroReducer from './hero/reducer';
import goldReducer from './gold/reducer';
import manaReducer from './mana/reducer';
import {
    combineReducers,
} from 'redux';

export default combineReducers({
    hero: heroReducer,
    gold: goldReducer,
    mana: manaReducer,
})