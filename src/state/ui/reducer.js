import { stateUpdaters } from "./actions";
import { on, makeReducer } from "../state-manager";


const initialState = {
    page: 'gold',
    goldUnit: 'skeleton',
    manaUnit: 'myth'
}

export default makeReducer(
    initialState,
    on(stateUpdaters.setPage, (state, { payload }) => { return {
        ...state,
        page: payload,
    }}),
    on(stateUpdaters.setGoldUnit, (state, { payload }) => { return {
        ...state,
        goldUnit: payload,
    }}),
    on(stateUpdaters.setManaUnit, (state, { payload }) => { return {
        ...state,
        manaUnit: payload,
    }}),
    on(stateUpdaters.setGoldUnitCalculated, (state, { payload }) => { return {
        ...state,
        goldUnitCalculations: payload,
    }}),
    on(stateUpdaters.setManaUnitCalculated, (state, { payload }) => { return {
        ...state,
        manaUnitCalculations: payload,
    }}),
    on(stateUpdaters.setTrainingCalculated, (state, { payload }) => { return {
        ...state,
        trainingCalculations: payload,
    }}),
    on(stateUpdaters.setUnitUpgradesAvailable, (state, { payload }) => { return {
        ...state,
        availableUpgrades: payload,
    }})
    )