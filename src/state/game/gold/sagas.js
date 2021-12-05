import {
    put,
    select,
    call,
    takeLatest,
    all,
} from 'redux-saga/effects';

import {
    interactionActions,
    stateUpdaters as GoldStateActions
} from "./actions";
import {
    stateUpdaters as UiStateActions
} from "./../../ui/actions";
import { BigNumber } from "@waves/bignumber"
import { goldUnits, goldUnitsUpgrades} from "../../../database/gold";
import CalculateSaga from "../calculate-saga";
import {stateUpdaters as HeroStateActions} from "../hero/actions";
import {armyUnits} from "../../../database/army";

class GoldSaga {

    static *updateUpgradeConstrains(targetId, currentLevels = {}, upgradeId) {
        const state = yield select(state => state.game);
        const flt = upgradeId
            ? u => upgradeId ? u.id === upgradeId : true
            : one => Array.isArray(one.targetId)
                ? one.targetId.includes(targetId)
                : one.targetId === targetId;
        return yield all(goldUnitsUpgrades.filter(flt).map(function* (one) {

            return yield call(CalculateSaga.updateSkillOrUpgradeConstrains, {
                ...one,
                level: currentLevels[one.id] || new BigNumber(0),
            }, state);
        }));

    }


    static *updatePurchaseConstrains(unitId, qty) {
        const unitData = goldUnits.find(one => one.id === unitId);
        return yield call(CalculateSaga.updatePurchaseConstrains, unitData, qty);
    }

    static *updateGold(DELAY) {
        const currentData = yield select(state => state.game.gold);
        const { goldUnit, page } = yield select(state => state.ui);
        const ECP = {};
        const units = [];
        for(let i = goldUnits.length - 1; i>-1; i--) {
            const unitAmount = currentData.units[goldUnits[i].id];
            if(!unitAmount) continue;
            // relying on thats already BigNumber

            //effect bonuses. TODO: make universal
            let bonus = yield CalculateSaga.getEffiencyBonus(
                goldUnits[i],
                currentData.upgrades,
                goldUnitsUpgrades
            );

            // console.log(goldUnits[i].id, bonus.toFixed(2));

            for(const key in goldUnits[i].production.unit || {}) {
                units.push({
                    id: key,
                    amount: unitAmount
                        .mul(bonus)
                        .mul(goldUnits[i].production.unit[key])
                        .mul(DELAY / 1000)
                });
                if(page === 'gold' && goldUnit === goldUnits[i].id) {
                    ECP.unit = {
                        ...(ECP.unit || {}),
                        [key]: unitAmount
                            .mul(bonus)
                            .mul(goldUnits[i].production.unit[key])
                    }
                }
                // some further transforms, bonuses and so on should be in here
                /*yield put(GoldStateActions.updateUnit.make({
                    id: key,
                    amount: units[key],
                }))*/
            }
            if(goldUnits[i].production.gold) {
                const gold = unitAmount
                    .mul(bonus)
                    .mul(goldUnits[i].production.gold)
                    .mul(DELAY / 1000);
                yield put(GoldStateActions.addGold.make(gold));
                if(page === 'gold' && goldUnit === goldUnits[i].id) {
                    ECP.gold = unitAmount
                        .mul(bonus)
                        .mul(goldUnits[i].production.gold);
                }
            }
        }
        yield put(GoldStateActions.updateManyUnits.make(units));

        const calculations = yield call(GoldSaga.updatePurchaseConstrains, goldUnit);
        // console.log('calculations', calculations, UiStateActions.setGoldUnitCalculated.make(calculations));
        yield put(UiStateActions.setGoldUnitCalculated.make({...calculations, ECP}));

        // get goldUpdates available
        if(page === 'gold') {
            const ups = yield call(GoldSaga.updateUpgradeConstrains, goldUnit, currentData.upgrades);
            yield put(UiStateActions.setUnitUpgradesAvailable.make(ups));
        }
    }

    static *purchaseUnit({payload}) {
        const calculations = yield call(GoldSaga.updatePurchaseConstrains, payload.id, payload.amount);
        if(calculations.perMax.qty.gte(payload.amount)) {
            const {cost, qty} = calculations.perFinal;
            yield call(CalculateSaga.subtractResources, cost);
            yield put(GoldStateActions.updateUnit.make({
                id: payload.id,
                amount: qty
            }))
        }
    }

    static *purchaseUpgrade({payload}) {
        const currentData = yield select(state => state.game.gold);
        const calculations = yield call(
            GoldSaga.updateUpgradeConstrains,
            null,
            currentData.upgrades,
            payload.id,
        );
        // console.log('purchased', calculations);
        if(calculations.length && calculations[0].isAvailable) {
            yield call(CalculateSaga.subtractResources, calculations[0].costs);
            yield put(GoldStateActions.updateUnitUpgrade.make({
                id: payload.id,
                amount: 1,
            }))
        }
    }

    static *listener() {
        yield takeLatest(interactionActions.purchase.type, GoldSaga.purchaseUnit);
        yield takeLatest(interactionActions.purchaseUpgrade.type, GoldSaga.purchaseUpgrade);
    }

}

export default GoldSaga;