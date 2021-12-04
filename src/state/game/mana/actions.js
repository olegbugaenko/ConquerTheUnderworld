import {createAction} from "../../state-manager";

export const stateUpdaters = {
    useMana: createAction('USE_MANA', amount => amount),
    addMana: createAction('ADD_MANA', amount => amount),
    updateUnit: createAction('UPDATE_MANA_UNIT', ({id, amount}) => ({
        id,
        amount,
    })),
    updateManyUnits: createAction('UPDATE_MANY_MANA_UNITS', array => array),
    updateUnitUpgrade: createAction('UPDATE_MANA_UNIT_UPGRADE', ({id, amount}) => ({
        id,
        amount,
    }))
}

export const interactionActions = {
    purchase: createAction('PURCHASE_MANA_UNIT', ({id, amount}) => ({
        id,
        amount,
    })),
    purchaseUpgrade: createAction('PURCHASE_MANA_UNIT_UPGRADE', ({id, amount}) => ({
        id,
        amount,
    })),
}