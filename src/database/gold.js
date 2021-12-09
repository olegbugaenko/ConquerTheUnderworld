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
        mana: new BigNumber(10),
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
        mana: new BigNumber(2000),
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
        mana: new BigNumber(400000),
        unit: {
            sumonner1: new BigNumber(40000)
        }
    },
    production: {
        unit: {
            sumonner1: new BigNumber(3)
        }
    }
},
    ...(()=>{
        const result = [];
        for(let i = 3; i < 50; i++) {
            result.push({
                id: `sumonner${i}`,
                name: `Skeleton summoner ${i}`,
                cost: {
                    energy: new BigNumber(i),
                    gold: new BigNumber(10).pow(i*i),
                    mana: new BigNumber(10).pow(i*i).mul(i),
                    unit: {
                        [`sumonner${i-1}`]: new BigNumber(10).pow(i*i).mul(i+1)
                    }
                },
                production: {
                    unit: {
                        [`sumonner${i-1}`]: new BigNumber(i+1)
                    }
                }
            })
        }
        return result;
    })()]

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
},
    ...(()=>{
        const result = [];
        for(let i = 2; i < 50; i++) {
            result.push({
                id: `sumonner${i}Effiency`,
                targetId: `sumonner${i}`,
                name: 'Effiency',
                cost: (level) => ({
                    unit: {
                        [`sumonner${i}`]: new BigNumber(35 + 5*i).pow(level.add(1)).roundTo(0),
                    }
                }),
                effect: (level) => new BigNumber(2).pow(level),
            })
        }
        return result;
    })()
]