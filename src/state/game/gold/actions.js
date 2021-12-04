import {createAction} from "../../state-manager";

export const stateUpdaters = {
    useGold: createAction('USE_GOLD', amount => amount),
    addGold: createAction('ADD_GOLD', amount => amount),
    updateUnit: createAction('UPDATE_UNIT', ({id, amount}) => ({
        id,
        amount,
    })),
    updateManyUnits: createAction('UPDATE_MANY_UNITS', array => array),
    updateUnitUpgrade: createAction('UPDATE_UNIT_UPGRADE', ({id, amount}) => ({
        id,
        amount,
    }))
}

export const interactionActions = {
    purchase: createAction('PURCHASE_GOLD_UNIT', ({id, amount}) => ({
        id,
        amount,
    })),
    purchaseUpgrade: createAction('PURCHASE_GOLD_UNIT_UPGRADE', ({id, amount}) => ({
        id,
        amount,
    })),
}