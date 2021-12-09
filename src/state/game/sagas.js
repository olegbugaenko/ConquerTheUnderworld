import { saveAs } from 'file-saver';
import {
    call,
    delay, put,
    select, takeLatest
} from 'redux-saga/effects';
import HeroSaga from "./hero/sagas";
import GoldSaga from "./gold/sagas";
import ManaSaga from "./mana/sagas";
import ArmySaga from "./army/sagas";
import {interactionActions, stateUpdaters} from "./actions";
import { BigNumber } from "@waves/bignumber";
import BattleSaga from "./battle/saga";


class GameSagas {

    static *ticker({ DELAY }) {
        const { isPrestiging } = yield select(state => state.game.prestige || {});
        if(!isPrestiging) {
            yield call(HeroSaga.updateHero, DELAY);
            yield call(GoldSaga.updateGold, DELAY);
            yield call(ManaSaga.updateMana, DELAY);
            yield call(ArmySaga.updateArmy, DELAY);
            yield call(BattleSaga.handleBattle, DELAY);
        }
    }

    static *runProcess() {
        const DELAY = 200;
        while(true) {
            yield delay(DELAY);
            yield call(GameSagas.ticker, { DELAY });
        }
    }

    static *saveGame() {
        const data = yield select(state => state.game);
        var blob = new Blob([JSON.stringify(data)], { type: "text/plain;charset=utf-8" });
        saveAs(blob, `conquer-underworld-${new Date()}.txt`);
    }

    static *loadGame({payload}) {
        const mapObject = (obj, cb) => Object.entries(obj || {}).reduce(
                (accum, [key, value]) => ({...accum, [key]: cb(value)}),
                {}
            );
        console.log('loadedContent: ', payload);
        try {
            const content = JSON.parse(payload);
            const result = {
                gold: {
                    gold: new BigNumber(content.gold.gold),
                    units: mapObject(content.gold.units, v => new BigNumber(v)),
                    upgrades: mapObject(content.gold.upgrades, v => new BigNumber(v)),
                },
                mana: {
                    mana: new BigNumber(content.mana.mana),
                    units: mapObject(content.mana.units, v => new BigNumber(v)),
                    upgrades: mapObject(content.mana.upgrades, v => new BigNumber(v)),
                },
                army: {
                    units: mapObject(content.army.units, v => new BigNumber(v)),
                    upgrades: mapObject(content.army.upgrades, v => new BigNumber(v)),
                },
                hero: {
                    energy: {
                        value: new BigNumber(content.hero.energy.value || 0)
                    },
                    training: mapObject(content.hero.training, v => new BigNumber(v)),
                    necklaces: {
                        mana: new BigNumber(content.hero.necklaces?.mana || 0),
                        gold: new BigNumber(content.hero.necklaces?.gold || 0),
                        perUnit_gold: mapObject(content.hero.necklaces?.perUnit_gold, v => new BigNumber(v)),
                        perUnit_mana: mapObject(content.hero.necklaces?.perUnit_mana, v => new BigNumber(v)),
                    }
                },
                battle: {
                    ...content.battle,
                    level: new BigNumber(content.battle?.level || 0),
                    maxLevel: new BigNumber(content.battle?.maxLevel || 0),
                    fame: new BigNumber(content.battle?.fame || 0),
                    isBattleInProgress: false,
                    battleStatus: {
                        round: new BigNumber(0),
                    },
                    enemy: null,
                },
                prestige: {
                    ...content.prestige,
                    prestige: mapObject(content.prestige?.prestige, v => new BigNumber(v || 0)),
                    isPrestiging: content.prestige?.isPrestiging || false,
                    prophecy: content.prestige?.prophecy || 'civilian',
                    upgrades: mapObject(content.prestige?.upgrades, v => new BigNumber(v || 0)),
                }
            }
            yield put(stateUpdaters.load.make(result));
        } catch (e) {
            console.error(e);
        }
    }

    static *listener() {
        yield takeLatest(interactionActions.save.type, GameSagas.saveGame);
        yield takeLatest(interactionActions.load.type, GameSagas.loadGame);
    }

}

export default GameSagas;