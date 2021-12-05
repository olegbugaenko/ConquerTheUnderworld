import { stateUpdaters } from "./actions";
import { on, makeReducer } from "../../state-manager";
import { BigNumber } from "@waves/bignumber"

/*BigNumber.set({
    EXPONENTIAL_AT: [-4,4]
})*/


const initialState = {
    stats: {
        hp: new BigNumber(0),
        at: new BigNumber(0),
        df: new BigNumber(0)
    },
    units: {

    },
    upgrades: {

    }
}

export default makeReducer(
    initialState,
    on(stateUpdaters.setStats, (state, { payload }) => { return {
        ...state,
        stats: {
            ...state.stats,
            ...payload
        }
    }}),
    on(stateUpdaters.updateUnit, (state, { payload: { id, amount } }) => {
        return {
            ...state,
            units: {
                ...state.units,
                [id]: (state.units[id] || new BigNumber(0)).add(amount)
            }
        }
    }),
    on(stateUpdaters.updateManyUnits, (state, { payload: array }) => {
        return {
            ...state,
            units: {
                ...state.units,
                ...array.reduce((accum, { id, amount }) => ({
                    ...accum,
                    [id]: (state.units[id] || new BigNumber(0)).add(amount)
                }), {})
            }
        }
    }),
    on(stateUpdaters.updateUnitUpgrade, (state, { payload: { id, amount } }) => {
        return {
            ...state,
            upgrades: {
                ...state.upgrades,
                [id]: (state.upgrades[id] || new BigNumber(0)).add(amount)
            }
        }
    }),
    )