import { BigNumber } from "@waves/bignumber";

export const manaUnits = [{
    id: 'mage0',
    name: 'Skeleton Mage',
    cost: {
        energy: new BigNumber(1),
        gold: new BigNumber(5000),
        mana: new BigNumber(40)
    },
    production: {
        mana: new BigNumber(1)
    }
},{
    id: 'mage1',
    name: 'Tiny Skeleton Mage Summoner',
    cost: {
        energy: new BigNumber(10),
        gold: new BigNumber('2.5e6'),
        mana: new BigNumber(2000),
        unit: {
            mage0: new BigNumber(100)
        }
    },
    production: {
        unit: {
            mage0: new BigNumber(1)
        }
    }
},{
    id: 'mage2',
    name: 'Small Skeleton Mage Summoner',
    cost: {
        energy: new BigNumber(100),
        gold: new BigNumber('9.e9'),
        mana: new BigNumber(4000000),
        unit: {
            mage1: new BigNumber(2000)
        }
    },
    production: {
        unit: {
            mage1: new BigNumber(2)
        }
    }
},{
    id: 'mage3',
    name: 'Small Skeleton Mage Summoner 2',
    cost: {
        energy: new BigNumber(2000),
        gold: new BigNumber('7e13'),
        mana: new BigNumber('9e9'),
        unit: {
            mage2: new BigNumber(40000)
        }
    },
    production: {
        unit: {
            mage2: new BigNumber(3)
        }
    }
},{
    id: 'mage4',
    name: 'Small Skeleton Mage Summoner 3',
    cost: {
        energy: new BigNumber(20000),
        gold: new BigNumber('9e17'),
        mana: new BigNumber('1.2e13'),
        unit: {
            mage2: new BigNumber(40000)
        }
    },
    production: {
        unit: {
            mage2: new BigNumber(3)
        }
    }
}]

export const manaUnitsUpgrades = [{
    id: 'mage0Effiency',
    targetId: 'mage0',
    name: 'Effiency',
    cost: (level) => ({
        unit: {
            mage0: new BigNumber(36).pow(level.add(1)).roundTo(0),
        }
    }),
    effect: (level) => new BigNumber(2).pow(level),
},{
    id: 'mage1Effiency',
    targetId: 'mage1',
    name: 'Effiency',
    cost: (level) => ({
        unit: {
            mage1: new BigNumber(49).pow(level.add(1)).roundTo(0),
        }
    }),
    effect: (level) => new BigNumber(2).pow(level),
},{
    id: 'mage2Effiency',
    targetId: 'mage2',
    name: 'Effiency',
    cost: (level) => ({
        unit: {
            mage2: new BigNumber(64).pow(level.add(1)).roundTo(0),
        }
    }),
    effect: (level) => new BigNumber(2).pow(level),
},{
    id: 'mage3Effiency',
    targetId: 'mage3',
    name: 'Effiency',
    cost: (level) => ({
        unit: {
            mage3: new BigNumber(81).pow(level.add(1)).roundTo(0),
        }
    }),
    effect: (level) => new BigNumber(2).pow(level),
},{
    id: 'mage4Effiency',
    targetId: 'mage4',
    name: 'Effiency',
    cost: (level) => ({
        unit: {
            mage4: new BigNumber(101).pow(level.add(1)).roundTo(0),
        }
    }),
    effect: (level) => new BigNumber(2).pow(level),
}]