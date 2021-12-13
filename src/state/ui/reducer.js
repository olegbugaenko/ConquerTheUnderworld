import { stateUpdaters } from "./actions";
import { on, makeReducer } from "../state-manager";


const initialState = {
    page: 'gold',
    goldUnit: 'skeleton',
    manaUnit: 'myth',
    armyUnit: 'warrior0',
    props: {},
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
    on(stateUpdaters.setArmyUnit, (state, { payload }) => { return {
        ...state,
        armyUnit: payload,
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
    on(stateUpdaters.setNecklacesCalculated, (state, { payload }) => { return {
        ...state,
        necklacesCalculations: payload,
    }}),
    on(stateUpdaters.setArmyUnitCalculated, (state, { payload }) => { return {
        ...state,
        armyCalculations: payload,
    }}),
    on(stateUpdaters.setUnitUpgradesAvailable, (state, { payload }) => { return {
        ...state,
        availableUpgrades: payload,
    }}),
    on(stateUpdaters.setPrestigeCalculated, (state, { payload }) => { return {
        ...state,
        prestigeCalculations: payload,
    }}),
    on(stateUpdaters.setUIProp, (state, { payload }) => ({
        ...state,
        props: {
            ...state.props,
            [payload.id]: payload.value,
        }
    }))
    )