import {
    call,
    put, select, all, takeLatest
} from 'redux-saga/effects';

import {
    interactionActions,
    stateUpdaters as HeroStateActions
} from "./actions";
import { BigNumber } from "@waves/bignumber"
import CalculateSaga from "../calculate-saga";
import {stateUpdaters as UiStateActions} from "../../ui/actions";
import {skills} from "../../../database/skills";

class HeroSaga {

    static *updatePurchaseConstrains(currentLevels) {
        const allSkillsData = skills;
        const state = yield select(state => state.game)
        return yield all(
            allSkillsData.filter(u => u.id in currentLevels).map(function* (one) {

                return yield call(CalculateSaga.updateSkillOrUpgradeConstrains, {
                    ...one,
                    level: currentLevels[one.id] || new BigNumber(0),
                }, state);
            })
        );
    }

    static *updateHero(DELAY) {
        const currentData = yield select(state => state.game.hero);
        let E = new BigNumber(1000).mul(new BigNumber(2).pow(currentData.training.energyLevel)); // base value
        yield put(HeroStateActions.setMaxEnergy.make(E));

        let eRegen = new BigNumber(5).mul(new BigNumber(2).pow(currentData.training.energyRegenLevel));;
        yield put(HeroStateActions.regenEnergy.make(eRegen.mul(DELAY / 1000)));
        const calculations = yield call(HeroSaga.updatePurchaseConstrains, currentData.training);
        yield put(UiStateActions.setTrainingCalculated.make(calculations));
    }

    static *purchaseSkill({payload}) {
        const currentData = yield select(state => state.game.hero);
        const calculations = yield call(
            HeroSaga.updatePurchaseConstrains,
            {
                [payload.id]: currentData.training[payload.id],
            }
        );
        if(calculations.length && calculations[0].isAvailable) {
            yield call(CalculateSaga.subtractResources, calculations[0].costs);
            yield put(HeroStateActions.updateSkillLevel.make({
                id: payload.id,
                level: 1,
            }))
        }
        /*console.log(payload, calculations);
        if(calculations.perMax.qty.gte(payload.amount)) {
            const {cost, qty} = calculations.perFinal;
            yield call(CalculateSaga.subtractResources, cost);
            yield put(GoldStateActions.updateUnit.make({
                id: payload.id,
                amount: qty
            }))
        }*!/*/
    }

    static *listener() {
        yield takeLatest(interactionActions.purchaseSkill.type, HeroSaga.purchaseSkill);
    }

}

export default HeroSaga;