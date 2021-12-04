import {
    call,
    delay
} from 'redux-saga/effects';
import HeroSaga from "./hero/sagas";
import GoldSaga from "./gold/sagas";
import ManaSaga from "./mana/sagas";


class GameSagas {

    static *ticker({ DELAY }) {
        yield call(HeroSaga.updateHero, DELAY);
        yield call(GoldSaga.updateGold, DELAY);
        yield call(ManaSaga.updateMana, DELAY);
    }

    static *runProcess() {
        const DELAY = 200;
        while(true) {
            yield delay(DELAY);
            yield call(GameSagas.ticker, { DELAY });
        }
    }

}

export default GameSagas;