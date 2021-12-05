import {
    applyMiddleware,
    combineReducers,
    compose,
    createStore,
} from 'redux';

import createSagaMiddleware from 'redux-saga';
import GameSagas from './game/sagas';
import gameReducer from './game/reducer';
import uiReducer from './ui/reducer';
import GoldSaga from "./game/gold/sagas";
import ManaSaga from "./game/mana/sagas";
import HeroSaga from "./game/hero/sagas";
import ArmySaga from "./game/army/sagas";


const mainReducer = combineReducers({
    game: gameReducer,
    ui: uiReducer,
});

const composeEnhancers = (typeof window !== 'undefined'
        && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__)
    || compose;

const sagaMiddleware = createSagaMiddleware();

export const store = createStore(
    mainReducer,
    composeEnhancers(applyMiddleware(sagaMiddleware)),
);

[
    GameSagas.runProcess,
    GameSagas.listener,
    GoldSaga.listener,
    ManaSaga.listener,
    HeroSaga.listener,
    ArmySaga.listener,
].map(saga => sagaMiddleware.run(saga));
