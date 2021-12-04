import {createAction} from "../../state-manager";

export const stateUpdaters = {
    useEnergy: createAction('USE_ENERGY', amount => amount),
    regenEnergy: createAction('REGEN_ENERGY', amount => amount),
    setMaxEnergy: createAction('SET_MAX_ENERGY', amount => amount),
    updateSkillLevel: createAction('UPDATE_ENERGY_SKILL', ({ id, level }) => ({ id, level })),
}

export const interactionActions = {
    purchaseSkill: createAction('PURCHASE_SKILL', payload => payload),
}
