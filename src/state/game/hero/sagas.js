import {
    call,
    put, select, all, takeLatest
} from 'redux-saga/effects';

import {
    interactionActions, stateUpdaters,
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
                    discount: new BigNumber(0.95).pow(state.prestige.upgrades.trainingCost1 || new BigNumber(0)),
                }, state);
            })
        );
    }

    static *updateHero(DELAY) {
        const prestige = yield select(state => state.game.prestige);
        const currentData = yield select(state => state.game.hero);
        let E = new BigNumber(5000)
            .mul((prestige.upgrades.maxEnergy1 || new BigNumber(0)).add(1))
            .mul(new BigNumber(1.3).pow(prestige.upgrades.maxEnergy2 || new BigNumber(0)))
            .mul(new BigNumber(2).pow(currentData.training.energyLevel || new BigNumber(0))); // base value
        yield put(HeroStateActions.setMaxEnergy.make(E));

        let eRegen = new BigNumber(5)
            .mul((prestige.upgrades.energy1 || new BigNumber(0)).add(1))
            .mul(new BigNumber(1.3).pow(prestige.upgrades.energy2 || new BigNumber(0)))
            .mul(new BigNumber(2).pow(currentData.training.energyRegenLevel || new BigNumber(0)));

        yield put(HeroStateActions.regenEnergy.make(eRegen.mul(DELAY / 1000)));
        const calculations = yield call(HeroSaga.updatePurchaseConstrains, currentData.training);
        if(prestige.upgrades.autoTrain && prestige.upgrades.autoTrain.gt(0)) {
            for(const cost of calculations) {
                if(cost.isAvailable && currentData.training.autoPurchase[cost.id]) {
                    yield put(interactionActions.purchaseSkill.make(cost.id));
                }
            }
        }
        yield put(UiStateActions.setTrainingCalculated.make(calculations));
        const necklaces = yield call(HeroSaga.getNecklacePrices);
        yield put(UiStateActions.setNecklacesCalculated.make({
            prices: necklaces,
            free: {
                gold: Object.values(currentData.necklaces.perUnit_gold).reduce(
                    (acc, item) => acc.sub(item),
                    new BigNumber(currentData.necklaces.gold)
                ),
                mana: Object.values(currentData.necklaces.perUnit_mana).reduce(
                    (acc, item) => acc.sub(item),
                    new BigNumber(currentData.necklaces.mana)
                ),
            }
        }));
    }

    static *getNecklacePrices() {
        const currentData = yield select(state => state.game.hero);
        return {
            gold: new BigNumber(10).pow((currentData.necklaces.gold || new BigNumber(0)).pow(2).add(3)),
            mana: new BigNumber(10).pow((currentData.necklaces.mana || new BigNumber(0)).pow(2).add(2))
        }
    }

    static *purchaseNecklace({payload}) {
        const currentData = yield select(state => state.game);
        const price = yield call(HeroSaga.getNecklacePrices);
        let pricePerUp = price[payload.id];
        if(payload.id === 'gold' && currentData.gold.gold.lt(pricePerUp)) return;
        if(payload.id === 'mana' && currentData.mana.mana.lt(pricePerUp)) return;
        yield call(CalculateSaga.subtractResources, {
            [payload.id]: pricePerUp,
        });
        yield put(HeroStateActions.addNecklace.make({
            id: payload.id,
        }))
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
        yield takeLatest(interactionActions.purchaseNecklace.type, HeroSaga.purchaseNecklace)
    }

}

export default HeroSaga;