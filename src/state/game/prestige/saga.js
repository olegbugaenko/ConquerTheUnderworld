import {
    put,
    select,
    call,
    takeLatest,
    all,
} from 'redux-saga/effects';

import {
    interactionActions,
    stateUpdaters,
} from "./actions";

import {
    stateUpdaters as prestigeUpdaters
} from './../battle/actions';

import {
    stateUpdaters as UiActions
} from './../../ui/actions';

import {
    stateUpdaters as LoaderActions
} from './../actions';

import { prestiges, prophecies } from "../../../database/prestige";
import CalculateSaga from "../calculate-saga";
import {BigNumber} from "@waves/bignumber";
import {stateUpdaters as GoldStateActions} from "../gold/actions";

class PrestigeSaga{

    static *calculatePrestigeCosts({ payload: id }) {
        const game = yield select(state => state.game);
        console.log(id, prestiges);
        const calculations = yield all(prestiges
            .filter(u => !id || u.id === id)
            .map(function* (one) {
            return yield call(CalculateSaga.updateSkillOrUpgradeConstrains, {
                ...one,
                level: game.prestige.upgrades[one.id] || new BigNumber(0),
            }, game);
        }));
        if(!id) {
            yield put(UiActions.setPrestigeCalculated.make(calculations));
        }
        return calculations;
    }

    static *doPrestige() {
        const fame = yield select(state => state.game.battle.fame);
        const prophecy = yield select(state => state.game.prestige.prophecy);
        if(fame.gte(10)) {
            yield put(stateUpdaters.setIsPrestiging.make(true));
            yield put(stateUpdaters.addPrestige.make({
                amount: fame
            }));
            yield put(prestigeUpdaters.setFameAmount.make(0));
            yield put(UiActions.setPage.make(prophecy));
        }
    }

    static *purchaseUpgrade({payload}) {
        // const currentData = yield select(state => state.game.prestige);
        const calculations = yield call(
            PrestigeSaga.calculatePrestigeCosts,
            {payload},
        );
        // console.log('purchased', calculations);
        if(calculations.length && calculations[0].isAvailable) {
            yield call(CalculateSaga.subtractResources, calculations[0].costs);
            yield put(stateUpdaters.setUpgrade.make(payload));
            yield put(interactionActions.updateCosts.make());
        }
    }

    static *startRun() {
        const page = yield select(state => state.ui.page);
        const prestige = yield select(state => state.game.prestige);
        // yield put(stateUpdaters.setProphecy.make(page));
        // yield put(stateUpdaters.setIsPrestiging.make(false));
        yield put(LoaderActions.load.make({
            gold: {
                gold: new BigNumber(10),
                units: {},
                upgrades: {},
            },
            mana: {
                mana: new BigNumber(0),
                units: {
                    mage0: new BigNumber(1),
                },
                upgrades: {},
            },
            army: {
                units: {},
                upgrades: {},
            },
            hero: {
                energy: {
                    value: new BigNumber(0)
                },
                training: {},
                necklaces: {
                    mana: new BigNumber(0),
                    gold: new BigNumber(0),
                    perUnit_gold: {

                    },
                    perUnit_mana: {

                    }
                }
            },
            battle: {
                level: new BigNumber(0),
                maxLevel: new BigNumber(0),
                fame: new BigNumber(0),
                isBattleInProgress: false,
                battleStatus: {
                    round: new BigNumber(0),
                },
                enemy: null,
            },
            prestige: {
                ...prestige,
                isPrestiging: false,
                prophecy: page,
            }
        }))
    }

    static *listener() {
        yield takeLatest(interactionActions.doPrestige.type, PrestigeSaga.doPrestige);
        yield takeLatest(interactionActions.updateCosts.type, PrestigeSaga.calculatePrestigeCosts);
        yield takeLatest(interactionActions.purchase.type, PrestigeSaga.purchaseUpgrade);
        yield takeLatest(interactionActions.startRun.type, PrestigeSaga.startRun);
    }

}

export default PrestigeSaga;