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
import {BigNumber} from "@waves/bignumber";
import {goldUnits} from "../../../database/gold";

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

        const unitDataId = manaUnits.findIndex(one => one.id === unitId);
        if(unitDataId < 0) return null;
        const unitData = manaUnits[unitDataId];
        let discount = {};
        if(unitDataId < manaUnits.length - 1) {
            const upperTierId = manaUnits[unitDataId + 1].id;
            const upperTierAmount = yield select(state => state.game.mana.units[upperTierId] || new BigNumber(0));
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

    static *updateMana(DELAY) {
        const currentData = yield select(state => state.game.mana);
        const prestige = yield select(state => state.game.prestige);
        const {hero, battle} = yield select(state => state.game);
        const { manaUnit, page } = yield select(state => state.ui);
        const units = [];
        const ECP = {};
        for(let i = manaUnits.length - 1; i>-1; i--) {
            const unitAmount = currentData.units[manaUnits[i].id];
            if(!unitAmount) continue;
            // relying on thats already BigNumber
            let bonus = yield CalculateSaga.getEffiencyBonus(
                manaUnits[i],
                currentData.upgrades,
                manaUnitsUpgrades
            );
            let pB = new BigNumber(1).add((prestige.upgrades.rage1 || new BigNumber(0))
                .mul((battle.maxLevel || new BigNumber(0)))
                .mul(new BigNumber(0.01)));

            pB = pB.mul((hero.necklaces.perUnit_mana[manaUnits[i].id] || new BigNumber(0)).mul(0.5).add(1));

            for(const key in manaUnits[i].production.unit || {}) {
                // some further transforms, bonuses and so on should be in here
                const income = unitAmount
                    .mul(bonus)
                    .mul(pB)
                    .mul(manaUnits[i].production.unit[key])
                    .mul((prestige.upgrades.allManaUnits1 || new BigNumber(0)).mul(0.2).add(1));
                units.push({
                    id: key,
                    amount: income
                        .mul(DELAY / 1000)
                });
                if(page === 'mana' && manaUnit === manaUnits[i].id) {
                    ECP.unit = {
                        ...(ECP.unit || {}),
                        [key]: income,
                    }
                }
                // some further transforms, bonuses and so on should be in here
                /*yield put(GoldStateActions.updateUnit.make({
                    id: key,
                    amount: units[key],
                }))*/
            }
            if(manaUnits[i].production.mana) {
                const income = unitAmount
                    .mul(bonus)
                    .mul(pB)
                    .mul(manaUnits[i].production.mana)
                    .mul((prestige.upgrades.mana1 || new BigNumber(0)).add(1));
                const mana = income.mul(DELAY / 1000);
                if(page === 'mana' && manaUnit === manaUnits[i].id) {
                    ECP.mana = income;
                }
                yield put(ManaStateActions.addMana.make(mana));
            }
        }
        yield put(ManaStateActions.updateManyUnits.make(units));
        const calculations = yield call(ManaSaga.updatePurchaseConstrains, manaUnit);
        // console.log('calculations', calculations, UiStateActions.setGoldUnitCalculated.make(calculations));
        yield put(UiStateActions.setManaUnitCalculated.make({...calculations, ECP}));
        // get goldUpdates available
        if(page === 'mana') {
            const ups = yield call(ManaSaga.updateUpgradeConstrains, manaUnit, currentData.upgrades);
            yield put(UiStateActions.setUnitUpgradesAvailable.make(ups));
        }
    }

    static *purchaseUnit({payload}) {
        const calculations = yield call(ManaSaga.updatePurchaseConstrains, payload.id, payload.amount);
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
        const currentData = yield select(state => state.game.mana);
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