import {
    select,
    call,
    put
} from 'redux-saga/effects';
import {BigNumber} from "@waves/bignumber";
import {stateUpdaters as GoldStateUpdaters} from "./gold/actions";
import {stateUpdaters as HeroStateUpdaters} from "./hero/actions";
import {stateUpdaters as ManaStateUpdaters} from "./mana/actions";
import {stateUpdaters as TerritoryStateUpdaters} from "./territory/actions";
import {goldUnits, goldUnitsUpgrades} from "../../database/gold";

class CalculateSaga{

    static *getEffiencyBonus(unit, upgrades, list) {
        let bonus = new BigNumber(1.0);
        list.filter(
            one => Array.isArray(one.targetId)
                ? one.targetId.includes(unit.id)
                : one.targetId === unit.id
        ).forEach(item => {
            if(!upgrades[item.id] || !item.effect) return;
            const eff = item.effect(upgrades[item.id]);
            if(!eff) return;
            bonus = bonus.mul(eff);
        });
        return bonus;
    }

    static *updateSkillOrUpgradeConstrains(skill, state) {
        const { gold, mana, territory, hero, secondary } = state;
        let maxAmount = new BigNumber('1.e+999999');
        const costs = {};
        const levelCosts = skill.cost(skill.level)
        for(const key in levelCosts) {
            if(key !== 'unit') {
                costs[key] = levelCosts[key];
                let actualAmount = 0;
                if(key === 'gold') {
                    actualAmount = gold?.gold;
                } else
                if(key === 'mana') {
                    actualAmount = mana?.mana;
                } else
                if(key === 'territory') {
                    actualAmount = territory?.territory;
                } else
                if(key === 'energy') {
                    actualAmount = hero?.energy?.value;
                } else {
                    actualAmount = secondary ? secondary[key] : new BigNumber(0)
                }
                maxAmount = BigNumber.min(
                    maxAmount,
                    actualAmount.div(costs[key])
                )
            } else {
                for(const costUnitId in levelCosts.unit) {
                    costs['unit'] = {
                        ...costs['unit'],
                        [costUnitId]: levelCosts.unit[costUnitId],
                    }
                    let units = gold?.units[costUnitId]
                        || mana?.units[costUnitId]
                        || territory?.units[costUnitId];
                    if(!units) {
                        maxAmount = new BigNumber(0);
                    } else {
                        maxAmount = BigNumber.min(
                            maxAmount,
                            units.div(levelCosts.unit[costUnitId])
                        )
                    }
                }
            }
        }
        return {
            isAvailable: maxAmount.gte(1),
            id: skill.id,
            costs: levelCosts,
        }
    }

    static *subtractResources(costs) {
        const { gold, mana, territory, hero, secondary } = yield select(state => state.game);
        for(const key in costs) {
            if(key !== 'unit') {
                let cost = costs[key];
                if(key === 'gold') {
                    yield put(GoldStateUpdaters.useGold.make(cost));
                } else
                if(key === 'mana') {
                    yield put(ManaStateUpdaters.useMana.make(cost));
                    // actualAmount = mana?.mana;
                } else
                if(key === 'territory') {
                    yield put(TerritoryStateUpdaters.useTerritory.make(cost));
                    // actualAmount = territory?.territory;
                } else
                if(key === 'energy') {
                    yield put(HeroStateUpdaters.useEnergy.make(cost));
                } else {
                    // actualAmount = secondary ? secondary[key] : new BigNumber(0)
                }
            } else {
                for(const costUnitId in costs.unit) {
                    let unit = gold?.units[costUnitId];
                    if(unit) {
                        yield put(GoldStateUpdaters.updateUnit.make({
                            id: costUnitId,
                            amount: costs.unit[costUnitId].mul(-1),
                        }));
                        continue;
                    }
                    unit = mana?.units[costUnitId];
                    if(unit) {
                        yield put(ManaStateUpdaters.updateUnit.make({
                            id: costUnitId,
                            amount: costs.unit[costUnitId].mul(-1),
                        }));
                        continue;
                    }
                    unit = territory?.units[costUnitId];
                    if(unit) {
                        yield put(TerritoryStateUpdaters.updateUnit.make({
                            id: costUnitId,
                            amount: costs.unit[costUnitId].mul(-1),
                        }));
                        continue;
                    }
                }
            }
        }
    }

    static *calcForQty(costs, qty) {
        const result = {};
        for(const key1 in costs) {
            if(key1 !== 'unit')
                result[key1] = costs[key1].mul(qty);
            else {
                result['unit'] = {};
                for(const key2 in costs.unit) {
                    result.unit[key2] = costs.unit[key2].mul(qty);
                }
            }
        }
        return {
            qty,
            cost: result,
        };
    }

    static *updatePurchaseConstrains(unitData, qty) {
        let maxAmount = new BigNumber('1.e+999999');
        if(!unitData) return {
            perUnit: {},
            per10percent: {},
            perMax: {},
            final: {}
        }
        const { gold, mana, territory, hero, secondary } = yield select(state => state.game);
        const costs = {};
        for(const key in unitData.cost) {
            if(key !== 'unit') {
                costs[key] = unitData.cost[key];
                let actualAmount = 0;
                if(key === 'gold') {
                    actualAmount = gold?.gold;
                } else
                if(key === 'mana') {
                    actualAmount = mana?.mana;
                } else
                if(key === 'territory') {
                    actualAmount = territory?.territory;
                } else
                if(key === 'energy') {
                    actualAmount = hero?.energy?.value;
                } else {
                    actualAmount = secondary ? secondary[key] : new BigNumber(0)
                }
                maxAmount = BigNumber.min(
                    maxAmount,
                    actualAmount.div(costs[key])
                )
            } else {
                for(const costUnitId in unitData.cost['unit']) {
                    costs['unit'] = {
                        ...costs['unit'],
                        [costUnitId]: unitData.cost.unit[costUnitId],
                    }
                    let units = gold?.units[costUnitId]
                        || mana?.units[costUnitId]
                        || territory?.units[costUnitId];
                    if(!units) {
                        maxAmount = new BigNumber(0);
                    } else {
                        maxAmount = BigNumber.min(
                            maxAmount,
                            units.div(unitData.cost.unit[costUnitId])
                        )
                    }
                }
            }
        }
        const perUnit = yield call(CalculateSaga.calcForQty, costs, 1);
        const per10Percent = yield call(CalculateSaga.calcForQty, costs, maxAmount.mul(0.1).roundTo(0, 1));
        const perMax = yield call(CalculateSaga.calcForQty, costs, maxAmount.roundTo(0, 1));
        const perFinal = yield call(CalculateSaga.calcForQty, costs, qty);
        return  {
            perUnit,
            per10Percent,
            perMax,
            perFinal
        }
    }
}

export default CalculateSaga;