import {
    put,
    select,
    call,
    takeLatest, all,
} from 'redux-saga/effects';

import {
    interactionActions,
    stateUpdaters as ManaStateActions
} from "./actions";
import {
    stateUpdaters as UiStateActions
} from "./../../ui/actions";

import { manaUnits, manaUnitsUpgrades} from "../../../database/mana";
import CalculateSaga from "../calculate-saga";
import {goldUnits, goldUnitsUpgrades} from "../../../database/gold";
import {stateUpdaters as GoldStateActions} from "../gold/actions";
import {BigNumber} from "@waves/bignumber";

class ManaSaga {

    static *updateUpgradeConstrains(targetId, currentLevels = {}, upgradeId) {
        const state = yield select(state => state.game);
        const flt = upgradeId
            ? u => upgradeId ? u.id === upgradeId : true
            : one => Array.isArray(one.targetId)
                ? one.targetId.includes(targetId)
                : one.targetId === targetId;
        return yield all(manaUnitsUpgrades.filter(flt).map(function* (one) {

            return yield call(CalculateSaga.updateSkillOrUpgradeConstrains, {
                ...one,
                level: currentLevels[one.id] || new BigNumber(0),
            }, state);
        }));

    }

    static *updatePurchaseConstrains(unitId, qty) {
        const unitData = manaUnits.find(one => one.id === unitId);
        return yield call(CalculateSaga.updatePurchaseConstrains, unitData, qty);
    }

    static *updateMana(DELAY) {
        const currentData = yield select(state => state.game.mana);
        for(let i = manaUnits.length - 1; i>-1; i--) {
            const unitAmount = currentData.units[manaUnits[i].id];
            if(!unitAmount) continue;
            // relying on thats already BigNumber
            const units = [];
            let bonus = yield CalculateSaga.getEffiencyBonus(
                manaUnits[i],
                currentData.upgrades,
                manaUnitsUpgrades
            );
            for(const key in manaUnits[i].production.unit || {}) {
                // some further transforms, bonuses and so on should be in here
                units.push({
                    id: key,
                    amount: unitAmount
                        .mul(bonus)
                        .mul(manaUnits[i].production.unit[key])
                        .mul(DELAY / 1000)
                });
                // some further transforms, bonuses and so on should be in here
                /*yield put(GoldStateActions.updateUnit.make({
                    id: key,
                    amount: units[key],
                }))*/
            }
            yield put(ManaStateActions.updateManyUnits.make(units));
            if(manaUnits[i].production.mana) {
                const mana = unitAmount.mul(manaUnits[i].production.mana).mul(DELAY / 1000);
                yield put(ManaStateActions.addMana.make(mana));
            }
        }
        const { manaUnit, page } = yield select(state => state.ui);
        const calculations = yield call(ManaSaga.updatePurchaseConstrains, manaUnit);
        // console.log('calculations', calculations, UiStateActions.setGoldUnitCalculated.make(calculations));
        yield put(UiStateActions.setManaUnitCalculated.make(calculations));
        // get goldUpdates available
        if(page === 'mana') {
            const ups = yield call(ManaSaga.updateUpgradeConstrains, manaUnit, currentData.upgrades);
            console.log('ups', ups);
            yield put(UiStateActions.setUnitUpgradesAvailable.make(ups));
        }
    }

    static *purchaseUnit({payload}) {
        const calculations = yield call(ManaSaga.updatePurchaseConstrains, payload.id, payload.amount);
        console.log('', payload, calculations);
        if(calculations.perMax.qty.gte(payload.amount)) {
            const {cost, qty} = calculations.perFinal;
            yield call(CalculateSaga.subtractResources, cost);
            yield put(ManaStateActions.updateUnit.make({
                id: payload.id,
                amount: qty
            }))
        }
    }

    static *purchaseUpgrade({payload}) {
        const currentData = yield select(state => state.game.gold);
        const calculations = yield call(
            ManaSaga.updateUpgradeConstrains,
            null,
            currentData.upgrades,
            payload.id,
        );
        // console.log('purchased', calculations);
        if(calculations.length && calculations[0].isAvailable) {
            yield call(CalculateSaga.subtractResources, calculations[0].costs);
            yield put(ManaStateActions.updateUnitUpgrade.make({
                id: payload.id,
                amount: 1,
            }))
        }
    }

    static *listener() {
        yield takeLatest(interactionActions.purchase.type, ManaSaga.purchaseUnit);
        yield takeLatest(interactionActions.purchaseUpgrade.type, ManaSaga.purchaseUpgrade);
    }

}

export default ManaSaga;