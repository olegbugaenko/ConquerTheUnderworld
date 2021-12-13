import { BigNumber } from "@waves/bignumber";

export const armyUnits = [{
    id: 'warrior0',
    name: 'Skeleton warrior',
    cost: {
        energy: new BigNumber(1000),
        gold: new BigNumber(5000000000000),
        mana: new BigNumber(1000000000),
        unit: {
            skeleton: new BigNumber(1),
        }
    },
    stats: {
        hp: new BigNumber(10),
        at: new BigNumber(4),
        df: new BigNumber(2),
    }
},{
    id: 'warrior1',
    name: 'Skeleton trainer',
    cost: {
        energy: new BigNumber(4000),
        gold: new BigNumber(3.e+15),
        mana: new BigNumber(2.e+13),
        unit: {
            warrior0: new BigNumber(100)
        }
    },
    production: {
        unit: {
            warrior0: new BigNumber(1)
        }
    }
},{
    id: 'warrior2',
    name: 'Skeleton sergeant',
    cost: {
        energy: new BigNumber(16000),
        gold: new BigNumber(6.e+21),
        mana: new BigNumber(4.e+18),
        unit: {
            warrior1: new BigNumber(2000)
        }
    },
    production: {
        unit: {
            warrior1: new BigNumber(2)
        }
    }
},{
    id: 'warrior3',
    name: 'Skeleton lieutenant',
    cost: {
        energy: new BigNumber(25000),
        gold: new BigNumber(9.e+30),
        mana: new BigNumber(7.e+26),
        unit: {
            warrior2: new BigNumber(40000)
        }
    },
    production: {
        unit: {
            warrior2: new BigNumber(3)
        }
    }
},{
    id: 'warrior4',
    name: 'Skeleton captain',
    cost: {
        energy: new BigNumber(25000),
        gold: new BigNumber(9.e+48),
        mana: new BigNumber(7.e+52),
        unit: {
            warrior3: new BigNumber(9000000)
        }
    },
    production: {
        unit: {
            warrior3: new BigNumber(4)
        }
    }
},{
    id: 'warrior5',
    name: 'Skeleton major',
    cost: {
        energy: new BigNumber(25000),
        gold: new BigNumber(4.e+72),
        mana: new BigNumber(6.e+104),
        unit: {
            warrior4: new BigNumber('7.e+11')
        }
    },
    production: {
        unit: {
            warrior4: new BigNumber(5)
        }
    }
},{
    id: 'warrior6',
    name: 'Skeleton major 2',
    cost: {
        energy: new BigNumber(49000),
        gold: new BigNumber(4.e+132),
        mana: new BigNumber(6.e+194),
        unit: {
            warrior5: new BigNumber('5.e+16')
        }
    },
    production: {
        unit: {
            warrior5: new BigNumber(5)
        }
    }
}]

export const armyUnitsUpgrades = [{
    id: 'warrior0_at',
    targetId: 'warrior0',
    name: 'Attack',
    cost: (level) => ({
        unit: {
            skeleton: new BigNumber(25*Math.pow(1.01, level)).pow(level.add(1)).roundTo(0),
        }
    }),
    effect: (level) => new BigNumber(1.2).pow(level),
},{
    id: 'warrior0_df',
    targetId: 'warrior0',
    name: 'Defense',
    cost: (level) => ({
        unit: {
            skeleton: new BigNumber(25*Math.pow(1.01, level)).pow(level.add(1)).roundTo(0),
        }
    }),
    effect: (level) => new BigNumber(1.2).pow(level),
},
    ...(()=>{
        const result = [];
        for(let i = 1; i < armyUnits.length; i++) {
            result.push({
                id: `warrior${i}Effiency`,
                targetId: `warrior${i}`,
                name: 'Effiency',
                cost: (level) => ({
                    unit: {
                        [`warrior${i}`]: new BigNumber((25 + 5*i)*Math.pow(1.01, level)).pow(level.add(1)).roundTo(0),
                    }
                }),
                effect: (level) => new BigNumber(2).pow(level),
            })
        }
        return result;
    })()];