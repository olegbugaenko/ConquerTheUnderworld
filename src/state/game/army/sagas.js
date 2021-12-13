import {
    put,
    select,
    call,
    takeLatest,
    all,
} from 'redux-saga/effects';

import {
    interactionActions,
    stateUpdaters as ArmyStateActions
} from "./actions";
import {
    stateUpdaters as UiStateActions
} from "./../../ui/actions";
import { BigNumber } from "@waves/bignumber"
import { armyUnits, armyUnitsUpgrades} from "../../../database/army";
import CalculateSaga from "../calculate-saga";
import {stateUpdaters as HeroStateActions} from "../hero/actions";
import {goldUnits} from "../../../database/gold";

class ArmySaga {

    static *updateUpgradeConstrains(targetId, currentLevels = {}, upgradeId, qty) {
        const state = yield select(state => state.game);
        const flt = upgradeId
            ? u => upgradeId ? u.id === upgradeId : true
            : one => Array.isArray(one.targetId)
                ? one.targetId.includes(targetId)
                : one.targetId === targetId;
        /*if(upgradeId) {
            console.log('purchasing: ', upgradeId, flt, armyUnitsUpgrades.filter(flt), currentLevels);
        }*/

        return yield all(armyUnitsUpgrades.filter(flt).map(function* (one) {

            return yield call(CalculateSaga.updateSkillOrUpgradeConstrains, {
                ...one,
                level: currentLevels[one.id] || new BigNumber(0),
                qty
            }, state);
        }));

    }


    static *updatePurchaseConstrains(unitId, qty) {
        const unitData = armyUnits.find(one => one.id === unitId);
        return yield call(CalculateSaga.updatePurchaseConstrains, unitData, qty);
    }

    static *updateArmy(DELAY) {
        const currentData = yield select(state => state.game.army);
        const {prestige, battle} = yield select(state => state.game);
        const { armyUnit, page } = yield select(state => state.ui);
        const units = [];
        const ECP = {};
        const rage = yield call(CalculateSaga.getGlobalRageBonus,{ prestige, battle });

        for(let i = armyUnits.length - 1; i>-1; i--) {
            const unitAmount = currentData.units[armyUnits[i].id];
            if(!unitAmount) continue;
            // relying on thats already BigNumber

            //effect bonuses. TODO: make universal
            let bonus = yield CalculateSaga.getEffiencyBonus(
                armyUnits[i],
                currentData.upgrades,
                armyUnitsUpgrades
            );

            let pB = new BigNumber(1);

            pB = pB.mul(
                rage
            );

            // console.log(goldUnits[i].id, bonus.toFixed(2));

            for(const key in armyUnits[i].production?.unit || {}) {
                units.push({
                    id: key,
                    amount: unitAmount
                        .mul(bonus)
                        .mul(pB)
                        .mul(armyUnits[i].production.unit[key])
                        .mul(DELAY / 1000)
                });
                if(page === 'army' && armyUnit === armyUnits[i].id) {
                    ECP.unit = {
                        ...(ECP.unit || {}),
                        [key]: unitAmount
                            .mul(bonus)
                            .mul(pB)
                            .mul(armyUnits[i].production.unit[key])
                    }
                }
                // some further transforms, bonuses and so on should be in here
                /*yield put(GoldStateActions.updateUnit.make({
                    id: key,
                    amount: units[key],
                }))*/
            }
            if(armyUnits[i].stats) {
                const statsFinal = {};
                ['at','df','hp'].forEach(statKey => {
                    bonus = CalculateSaga.getEffiencyBonus(
                        armyUnits[i],
                        currentData.upgrades,
                        armyUnitsUpgrades.filter(u => u.id === `${armyUnits[i].id}_${statKey}`)
                    );

                    let stat = armyUnits[i].stats[statKey];
                    if(stat) {
                        stat = stat.mul(bonus);
                        if(statKey === 'at') {
                            stat = stat.mul(new BigNumber(1.2).pow(
                                prestige.upgrades.attack1 || new BigNumber(0)
                            ))
                        }
                        if(statKey === 'df') {
                            stat = stat.mul(new BigNumber(1.2).pow(
                                prestige.upgrades.defense1 || new BigNumber(0)
                            ))
                        }
                        statsFinal[statKey] = stat
                            .mul(unitAmount)
                            .mul(pB);
                        if(statKey === 'hp') {
                            statsFinal.hpPerUnit = stat;
                        }
                        if(page === 'army' && armyUnit === armyUnits[i].id) {
                            ECP.stats = {
                                ...(ECP.stats || {}),
                                [statKey]: statsFinal[statKey],
                            }
                        }
                    }
                })
                // console.log('statsFinal: ', statsFinal);
                yield put(ArmyStateActions.setStats.make(statsFinal));
            }
        }
        yield put(ArmyStateActions.updateManyUnits.make(units));
        const calculations = yield call(ArmySaga.updatePurchaseConstrains, armyUnit);
        // console.log('calculationsArmy', calculations, UiStateActions.setArmyUnitCalculated.make(calculations));
        yield put(UiStateActions.setArmyUnitCalculated.make({...calculations, ECP}));

        // get armyUpdates available
        if(page === 'army') {
            const ups = yield call(ArmySaga.updateUpgradeConstrains, armyUnit, currentData.upgrades);
            yield put(UiStateActions.setUnitUpgradesAvailable.make(ups));
        }
    }

    static *purchaseUnit({payload}) {
        const calculations = yield call(ArmySaga.updatePurchaseConstrains, payload.id, payload.amount);
        if(calculations.perMax.qty.gte(payload.amount)) {
            const {cost, qty} = calculations.perFinal;
            yield call(CalculateSaga.subtractResources, cost);
            yield put(ArmyStateActions.updateUnit.make({
                id: payload.id,
                amount: qty
            }))
        }
    }

    static *purchaseUpgrade({payload}) {
        const currentData = yield select(state => state.game.army);
        const calculations = yield call(
            ArmySaga.updateUpgradeConstrains,
            null,
            currentData.upgrades,
            payload.id,
            new BigNumber(payload.amount)
        );
        // console.log('purchased', calculations);
        if(calculations.length && calculations[0].isAvailable) {
            yield call(CalculateSaga.subtractResources, calculations[0].costs);
            yield put(ArmyStateActions.updateUnitUpgrade.make({
                id: payload.id,
                amount: calculations[0].qty,
            }))
        }
    }

    static *listener() {
        yield takeLatest(interactionActions.purchase.type, ArmySaga.purchaseUnit);
        yield takeLatest(interactionActions.purchaseUpgrade.type, ArmySaga.purchaseUpgrade);
    }

}

export default ArmySaga;