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
import {stateUpdaters as ArmyStateUpdaters } from "./army/actions";
import {stateUpdaters as PrestigeStateUpdaters } from "./prestige/actions";
import {goldUnits, goldUnitsUpgrades} from "../../database/gold";
import {prestiges} from "../../database/prestige";

class CalculateSaga{

    static *getGlobalRageBonus({ prestige, battle }) {
        if(!prestige || !battle) {
            ({ prestige, battle } = yield select(state => state.game));
        }
        return new BigNumber(1).add((prestige.upgrades.rage1 || new BigNumber(0))
            .mul((battle.maxLevel || new BigNumber(0)))
            .mul(new BigNumber(0.01)))
    }

    static getEffiencyBonus(unit, upgrades, list) {
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

    static addCost(cost, cost2, mult = new BigNumber(1)) {
        if(!cost) cost = {};
        if(!cost2) cost2 = {};
        const rs = {};
        const keys = [...Object.keys(cost),...Object.keys(cost2)];
        for(const key of keys) {
            if(key === 'unit' || key === 'prestige') {
                for(const keyUnit in {...(cost[key] || {}), ...(cost2[key] || {})}) {
                    if(!rs[key]) {
                        rs[key] = {};
                    }
                    rs[key][keyUnit] = (
                        (cost[key] && cost[key][keyUnit]) || new BigNumber(0)
                    ).add(
                        ((cost2[key] && cost2[key][keyUnit]) || new BigNumber(0)).mul(mult)
                    )
                    /*if(keyUnit === 'skeleton') {
                        console.log('[skeleton]', cost[key][keyUnit].valueOf(), cost2);
                    }*/
                }
            } else {
                rs[key] = (
                    cost[key] || new BigNumber(0)
                ).add(
                    (cost2[key] || new BigNumber(0)).mul(mult)
                )
            }
        }
        return rs;
    }

    static *updateSkillOrUpgradeConstrains(skill, state) {
        const { gold, mana, territory, hero, secondary, prestige, army } = state;

        const costs = {};
        skill.discount = skill.discount || new BigNumber(1.0);
        // let levelCosts = skill.cost(skill.level);
        if(!skill.qty) skill.qty = new BigNumber(1);
        let oldLevelCosts = null;
        let levelCosts = null;
        let maxAmount = new BigNumber('1.e+999999');
        let il = skill.level;
        // for(let il = skill.level; il.lt(skill.level.add(skill.qty)); il.add(1))
        /*if((skill.id === 'energyLevel' || skill.id === 'energyRegenLevel')) {
            console.log('ENTER: '+il.valueOf()+' of '+skill.level.add(skill.qty).valueOf(), il.lt(skill.level.add(skill.qty)));
        }*/
        while(il.lt(skill.level.add(skill.qty))){
            maxAmount = new BigNumber('1.e+999999');
            oldLevelCosts = levelCosts ? CalculateSaga.addCost({}, {...levelCosts}) : null;
            levelCosts = CalculateSaga.addCost(levelCosts, skill.cost(il), skill.discount);
            /*if(skill.id === 'energyLevel' || skill.id === 'energyRegenLevel') {
                console.log('levelCost '+il.valueOf()+' of '+skill.qty.valueOf(), levelCosts);
                console.log('-=-=-: ', oldLevelCosts, skill.cost(il));


            }*/
            for(const key in levelCosts) {
                if(key === 'prestige') {
                    for(const prestigeId in levelCosts.prestige) {
                        costs['prestige'] = {
                            ...costs['prestige'],
                            [prestigeId]: levelCosts.prestige[prestigeId],
                        }
                        let actualAmount = prestige.prestige[prestigeId] || new BigNumber(0);
                        maxAmount = BigNumber.min(
                            maxAmount,
                            actualAmount.div(levelCosts.prestige[prestigeId])
                        );
                    }
                } else
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
                    } else
                    {
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
                            || army?.units[costUnitId]
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

            if(maxAmount.lt(1)) {
                skill.qty = new BigNumber(il).sub(skill.level);
                levelCosts = oldLevelCosts || levelCosts;
                /*if(skill.id === 'energyLevel' || skill.id === 'energyRegenLevel') {
                    console.log('nEnought: '+il.valueOf(), skill.qty.valueOf());
                }*/
                break;
            }
            il = il.add(1);
            /*if(skill.id === 'energyLevel' || skill.id === 'energyRegenLevel') {
                console.log('enought: '+il.valueOf(), il.lt(skill.level.add(skill.qty)), maxAmount.valueOf(),
                    gold?.gold?.valueOf(),
                    levelCosts?.gold?.valueOf()
                    );
            }*/
        }

        /*if(skill.id === 'energyLevel' || skill.id === 'energyRegenLevel') {
            console.log('skill.qty', skill.qty, skill.qty.gt);
        }*/

        return {
            isAvailable: il.gt(skill.level),
            id: skill.id,
            costs: levelCosts,
            qty: skill.qty,
        }
    }

    static *subtractResources(costs) {
        const { gold, mana, territory, hero, secondary, army } = yield select(state => state.game);
        for(const key in costs) {
            if(key === 'prestige') {
                for(const prestigeId in costs.prestige) {
                    let actualAmount = costs.prestige[prestigeId] || new BigNumber(0);
                    yield put(PrestigeStateUpdaters.addPrestige.make({
                        id: prestigeId,
                        amount: actualAmount.mul(-1)
                    }))
                }
            } else
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
                    console.log('costUnitIdGold', costUnitId, unit, costs.unit[costUnitId]);
                    if(unit) {
                        yield put(GoldStateUpdaters.updateUnit.make({
                            id: costUnitId,
                            amount: costs.unit[costUnitId].mul(-1),
                        }));
                        continue;
                    }
                    unit = mana?.units[costUnitId];
                    console.log('costUnitIdMana', costUnitId, unit, costs.unit[costUnitId]);
                    if(unit) {
                        yield put(ManaStateUpdaters.updateUnit.make({
                            id: costUnitId,
                            amount: costs.unit[costUnitId].mul(-1),
                        }));
                        continue;
                    }
                    unit = territory?.units[costUnitId];
                    console.log('costUnitIdTerr', costUnitId, unit, costs.unit[costUnitId]);
                    if(unit) {
                        yield put(TerritoryStateUpdaters.updateUnit.make({
                            id: costUnitId,
                            amount: costs.unit[costUnitId].mul(-1),
                        }));
                        continue;
                    }
                    unit = army?.units[costUnitId];
                    console.log('costUnitIdArmy', costUnitId, unit, costs.unit[costUnitId].mul(-1).valueOf());
                    if(unit) {
                        yield put(ArmyStateUpdaters.updateUnit.make({
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
        const { gold, mana, army, hero, secondary, territory } = yield select(state => state.game);
        const costs = {};
        for(const key in unitData.cost) {
            if(key !== 'unit') {
                costs[key] = unitData.cost[key];
                if(unitData.discount && (key in unitData.discount)) {
                    costs[key] = costs[key].mul(unitData.discount[key]);
                }
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
                        || army?.units[costUnitId];
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