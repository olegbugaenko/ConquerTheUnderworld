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
import {prestiges} from "../../../database/prestige";

class GoldSaga {

    static *updateUpgradeConstrains(targetId, currentLevels = {}, upgradeId, qty) {
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
                qty,
            }, state);
        }));

    }


    static *updatePurchaseConstrains(unitId, qty) {
        const unitDataId = goldUnits.findIndex(one => one.id === unitId);
        if(unitDataId < 0) return null;
        const unitData = goldUnits[unitDataId];
        let discount = {};
        if(unitDataId < goldUnits.length - 1) {
            const upperTierId = goldUnits[unitDataId + 1].id;
            const upperTierAmount = yield select(state => state.game.gold.units[upperTierId] || new BigNumber(0));
            const prestige = yield select(state => state.game.prestige.upgrades);
            discount['energy'] = BigNumber.max(
                new BigNumber(0.25).pow(prestige?.hireCost1 || 0),
                new BigNumber(1).div(upperTierAmount.add(1).sqrt().sqrt())
            );

            // set discount to obj
            unitData.discount = discount;
        }

        return yield call(CalculateSaga.updatePurchaseConstrains, unitData, qty);
    }

    static *updateGold(DELAY) {
        const currentData = yield select(state => state.game.gold);
        const {hero, prestige, battle} = yield select(state => state.game);
        const { goldUnit, page } = yield select(state => state.ui);
        const ECP = {};
        const units = [];

        const rage = yield call(CalculateSaga.getGlobalRageBonus,{ prestige, battle });

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

            let pB = new BigNumber(1.25)
                .pow(prestige.upgrades[`miner1_${goldUnits[i].id}`] || 0);

            pB = pB.mul((hero.necklaces.perUnit_gold[goldUnits[i].id] || new BigNumber(0)).mul(0.5).add(1));

            pB = pB.mul(
                rage
            )
            // console.log(goldUnits[i].id, bonus.toFixed(2));

            for(const key in goldUnits[i].production.unit || {}) {
                units.push({
                    id: key,
                    amount: unitAmount
                        .mul(bonus)
                        .mul(goldUnits[i].production.unit[key])
                        .mul(pB)
                        .mul(DELAY / 1000)
                });
                if(page === 'gold' && goldUnit === goldUnits[i].id) {
                    ECP.unit = {
                        ...(ECP.unit || {}),
                        [key]: unitAmount
                            .mul(bonus)
                            .mul(pB)
                            .mul(goldUnits[i].production.unit[key])
                            .roundTo(0)
                    }
                }
                // some further transforms, bonuses and so on should be in here
                /*yield put(GoldStateActions.updateUnit.make({
                    id: key,
                    amount: units[key],
                }))*/
            }
            if(goldUnits[i].production.gold) {
                const income = unitAmount
                    .mul(bonus)
                    .mul(goldUnits[i].production.gold)
                    .mul((prestige.upgrades.gold1 || new BigNumber(0)).add(1));
                const gold = income
                    .mul(DELAY / 1000);
                yield put(GoldStateActions.addGold.make(gold));
                if(page === 'gold' && goldUnit === goldUnits[i].id) {
                    ECP.gold = income.roundTo(0);
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
            new BigNumber(payload.amount)
        );
        // console.log('purchased', calculations);
        if(calculations.length && calculations[0].isAvailable) {
            yield call(CalculateSaga.subtractResources, calculations[0].costs);
            yield put(GoldStateActions.updateUnitUpgrade.make({
                id: payload.id,
                amount: calculations[0].qty,
            }))
        }
    }

    static *listener() {
        yield takeLatest(interactionActions.purchase.type, GoldSaga.purchaseUnit);
        yield takeLatest(interactionActions.purchaseUpgrade.type, GoldSaga.purchaseUpgrade);
    }

}

export default GoldSaga;