import {createAction} from "../state-manager";

export const stateUpdaters = {
    setPage: createAction('SET_PAGE', id => id),
    setGoldUnit: createAction('SET_GOLD_UNIT', id => id),
    setManaUnit: createAction('SET_MANA_UNIT', id => id),
    setArmyUnit: createAction('SET_ARMY_UNIT', id => id),
    setGoldUnitCalculated: createAction('SET_GOLD_UNIT_CALCULATED', payload => payload),
    setManaUnitCalculated: createAction('SET_MANA_UNIT_CALCULATED', payload => payload),
    setTrainingCalculated: createAction('SET_TRAINING_CALCULATED', payload => payload),
    setArmyUnitCalculated: createAction('SET_ARMY_UNIT_CALCULATED', payload => payload),

    setUnitUpgradesAvailable: createAction('SET_UNIT_UPGRADES_AVAILABLE', payload => payload),
}