import { BigNumber } from "@waves/bignumber";

export const goldUnits = [{
    id: 'skeleton',
    name: 'Skeleton',
    cost: {
        energy: new BigNumber(1),
        gold: new BigNumber(5),
        mana: new BigNumber(1)
    },
    production: {
        gold: new BigNumber(1)
    }
},{
    id: 'sumonner0',
    name: 'Tiny Skeleton Summoner',
    cost: {
        energy: new BigNumber(1),
        gold: new BigNumber(100),
        mana: new BigNumber(2),
        unit: {
            skeleton: new BigNumber(100)
        }
    },
    production: {
        unit: {
            skeleton: new BigNumber(1)
        }
    }
},{
    id: 'sumonner1',
    name: 'Small Skeleton Summoner',
    cost: {
        energy: new BigNumber(1),
        gold: new BigNumber(1000),
        mana: new BigNumber(4),
        unit: {
            sumonner0: new BigNumber(2000)
        }
    },
    production: {
        unit: {
            sumonner0: new BigNumber(2)
        }
    }
},{
    id: 'sumonner2',
    name: 'Small Skeleton Summoner 2',
    cost: {
        energy: new BigNumber(1),
        gold: new BigNumber(10000),
        mana: new BigNumber(5),
        unit: {
            sumonner1: new BigNumber(40000)
        }
    },
    production: {
        unit: {
            sumonner1: new BigNumber(3)
        }
    }
}]

export const goldUnitsUpgrades = [{
    id: 'skeletonEffiency',
    targetId: 'skeleton',
    name: 'Effiency',
    cost: (level) => ({
        unit: {
            skeleton: new BigNumber(25).pow(level.add(1)).roundTo(0),
        }
    }),
    effect: (level) => new BigNumber(2).pow(level),
},{
    id: 'sumonner0Effiency',
    targetId: 'sumonner0',
    name: 'Effiency',
    cost: (level) => ({
        unit: {
            sumonner0: new BigNumber(30).pow(level.add(1)).roundTo(0),
        }
    }),
    effect: (level) => new BigNumber(2).pow(level),
},{
    id: 'sumonner1Effiency',
    targetId: 'sumonner1',
    name: 'Effiency',
    cost: (level) => ({
        unit: {
            sumonner1: new BigNumber(35).pow(level.add(1)).roundTo(0),
        }
    }),
    effect: (level) => new BigNumber(2).pow(level),
}]