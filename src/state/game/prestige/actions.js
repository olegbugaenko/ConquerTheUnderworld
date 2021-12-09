import {createAction} from "../../state-manager";

export const stateUpdaters = {
    addPrestige: createAction('ADD_PRESTIGE', amount => amount),
    setProphecy: createAction('SET_PROPHECY', id => id),
    setIsPrestiging: createAction('SET_PRESTIGING', id => id),
    setUpgrade: createAction('ADD_UPGRADE', id => id),
}

export const interactionActions = {
    purchase: createAction('PURCHASE_PRESTIGE', id => id),
    doPrestige: createAction('MAKE_PRESTIGE', payload => payload),
    updateCosts: createAction('UPDATE_PRESTIGE_COSTS', payload => payload),
    startRun: createAction('START_RUN', payload => payload),
}