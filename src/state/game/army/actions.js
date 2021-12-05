import {createAction} from "../../state-manager";

export const stateUpdaters = {
    setStats: createAction('SET_STATS', pl => pl),
    // addGold: createAction('ADD_GOLD', amount => amount),
    updateUnit: createAction('UPDATE_ARMY_UNIT', ({id, amount}) => ({
        id,
        amount,
    })),
    updateManyUnits: createAction('UPDATE_MANY_ARMY_UNITS', array => array),
    updateUnitUpgrade: createAction('UPDATE_ARMY_UNIT_UPGRADE', ({id, amount}) => ({
        id,
        amount,
    })),
}

export const interactionActions = {
    purchase: createAction('PURCHASE_ARMY_UNIT', ({id, amount}) => ({
        id,
        amount,
    })),
    purchaseUpgrade: createAction('PURCHASE_ARMY_UNIT_UPGRADE', ({id, amount}) => ({
        id,
        amount,
    })),
}