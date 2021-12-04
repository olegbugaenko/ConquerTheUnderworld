import { BigNumber } from "@waves/bignumber";

export const skills = [{
    id: 'energyLevel',
    name: 'Endurance',
    cost: (level) => ({
        gold: new BigNumber(10).pow(level).mul(100),
    })
},{
    id: 'energyRegenLevel',
    name: 'Recovery',
    cost: (level) => ({
        energy: new BigNumber(2).pow(level).mul(10),
        gold: new BigNumber(10).pow(level).mul(100),
    })
}]