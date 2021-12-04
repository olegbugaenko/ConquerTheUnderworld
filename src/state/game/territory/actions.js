import {createAction} from "../../state-manager";

export const stateUpdaters = {
    useTerritory: createAction('USE_TERRITORY', amount => amount),
    addGold: createAction('ADD_TERRITORY', amount => amount),
    updateUnit: createAction('UPDATE_TERRITORY_UNIT', ({id, amount}) => ({
        id,
        amount,
    }))
}

export const interactionActions = {
    purchase: createAction('PURCHASE_TERRITORY_UNIT', ({id, amount}) => ({
        id,
        amount,
    }))
}