import { BigNumber } from "@waves/bignumber";

export const armyUnits = [{
    id: 'warrior0',
    name: 'Skeleton warrior',
    cost: {
        energy: new BigNumber(1),
        gold: new BigNumber(5),
        mana: new BigNumber(1),
        unit: {
            skeleton: new BigNumber(1),
        }
    },
    stats: {
        hp: new BigNumber(10),
        at: new BigNumber(2),
        df: new BigNumber(1),
    }
},{
    id: 'warrior1',
    name: 'Skeleton trainer',
    cost: {
        energy: new BigNumber(1),
        gold: new BigNumber(5),
        mana: new BigNumber(1),
        unit: {
            warrior0: new BigNumber(100)
        }
    },
    production: {
        unit: {
            warrior0: new BigNumber(1)
        }
    }
}]

export const armyUnitsUpgrades = [];