import { BigNumber } from "@waves/bignumber";
import {goldUnits} from "./gold";

export const prophecies = [{
    name: 'Civilian necromancer',
    id: 'civilian',
},{
    name: 'Miner',
    id: 'miner',
},{
    name: 'Spiritualist',
    id: 'spiritualist',
},{
    name: 'Warrior necromancer',
    id: 'warrior',
},{
    name: 'Merchant necromancer',
    id: 'merchant',
}]

export const prestiges = [{
    name: 'Gold income',
    id: 'gold1',
    prophecyId: 'civilian',
    description: 'Each level increase amount of gold produced by 100%. (Additive: 1 lvl - x2, 2 lvl - x3, ...',
    cost: (lvl) => ({
        prestige: {
            civilian: new BigNumber(1.3).pow(lvl).mul(5).roundTo(0)
        },
    })
},{
    name: 'Mana income',
    id: 'mana1',
    prophecyId: 'civilian',
    description: 'Each level increase amount of mana produced by 100%. (Additive: 1 lvl - x2, 2 lvl - x3, ...',
    cost: (lvl) => ({
        prestige: {
            civilian: new BigNumber(1.3).pow(lvl).mul(5).roundTo(0),
        }
    })
},{
    name: 'Energy income',
    id: 'energy1',
    prophecyId: 'civilian',
    description: 'Each level increase amount of energy generated by 5. (Additive: 1 lvl - 10, 2 lvl - 15, ...',
    cost: (lvl) => ({
        prestige: {
            civilian: new BigNumber(1.3).pow(lvl).mul(5).roundTo(0),
        }
    })
},{
    name: 'Max Energy',
    id: 'maxEnergy1',
    prophecyId: 'civilian',
    description: 'Each level increase max amount of energy by 100%. (Additive: 1 lvl - 100%, 2 lvl - 200%, ...',
    cost: (lvl) => ({
        prestige: {
            civilian: new BigNumber(1.3).pow(lvl).mul(5).roundTo(0),
        }
    })
},{
    name: 'Warrior necromancer',
    id: 'warrior1',
    prophecyId: 'civilian',
    description: 'Unlocks warrior prophecy',
    cost: (lvl) => ({
        prestige: {
            civilian: new BigNumber(50),
        }
    })
},{
    name: 'Merchant necromancer',
    id: 'merchant1',
    prophecyId: 'civilian',
    description: 'Unlocks merchant prophecy',
    cost: (lvl) => ({
        prestige: {
            civilian: new BigNumber(50),
        }
    })
}].concat(goldUnits.map((u, i) => ({
    name: `${u.name} masterity`,
    id: `miner1_${u.id}`,
    prophecyId: 'miner',
    description: `Each level increase ${u.name} effiency by 25% (multiplicative)`,
    cost: (lvl) => ({
        prestige: {
            miner: new BigNumber(1.3 ).pow(lvl).mul(5*(i+1) +5).roundTo(0),
        }
    })
}))).concat([{
    name: 'Energy income 2',
    id: 'energy2',
    prophecyId: 'spiritualist',
    description: 'Each level increase amount of energy generated by 30% (multiplicative: lvl1 - x1.3, lvl2 - x1.69,...)',
    cost: (lvl) => ({
        prestige: {
            spiritualist: new BigNumber(1.3).pow(lvl).mul(10).roundTo(0),
        }
    })
},{
    name: 'Max Energy 2',
    id: 'maxEnergy2',
    prophecyId: 'spiritualist',
    description: 'Each level increase amount of energy stored by 30% (multiplicative: lvl1 - x1.2, lvl2 - x1.69,...)',
    cost: (lvl) => ({
        prestige: {
            spiritualist: new BigNumber(1.3).pow(lvl).mul(10).roundTo(0),
        }
    })
},{
    name: 'Training cost',
    id: 'trainingCost1',
    prophecyId: 'spiritualist',
    description: 'Each level decrease training cost by 10%',
    cost: (lvl) => ({
        prestige: {
            spiritualist: new BigNumber(1.5).pow(lvl).mul(20).roundTo(0),
        }
    })
},{
    name: 'Advanced unit trainers',
    id: 'hireCost1',
    prophecyId: 'spiritualist',
    description: 'Each level increase max energy discount for unit depending on upper tier unit cost by 75%, starting from 75%',
    cost: (lvl) => ({
        prestige: {
            spiritualist: new BigNumber(1.5).pow(lvl).mul(50).roundTo(0),
        }
    })
}]).concat([{
    name: 'Rage',
    id: 'rage1',
    prophecyId: 'warrior',
    description: 'Each level increase effiency of ALL units per 1% per battle level per rage level',
    cost: (lvl) => ({
        prestige: {
            warrior: new BigNumber(1.5).pow(lvl).mul(50).roundTo(0),
        }
    })
},{
    name: 'Attack',
    id: 'attack1',
    prophecyId: 'warrior',
    description: 'Each level increase attack of units per 10% per level',
    cost: (lvl) => ({
        prestige: {
            warrior: new BigNumber(1.5).pow(lvl).mul(50).roundTo(0),
        }
    })
},{
    name: 'Defense',
    id: 'defense1',
    prophecyId: 'warrior',
    description: 'Each level increase defense of units per 10% per level',
    cost: (lvl) => ({
        prestige: {
            warrior: new BigNumber(1.5).pow(lvl).mul(50).roundTo(0),
        }
    })
}])