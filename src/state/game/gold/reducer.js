import { stateUpdaters } from "./actions";
import { on, makeReducer } from "../../state-manager";
import { BigNumber } from "@waves/bignumber"

/*BigNumber.set({
    EXPONENTIAL_AT: [-4,4]
})*/


const initialState = {
    gold: new BigNumber(10),
    units: {
        skeleton: new BigNumber(0),
        sumonner0: new BigNumber(0),
        sumonner1: new BigNumber(0),
        sumonner2: new BigNumber(0),
    },
    upgrades: {

    }
}

export default makeReducer(
    initialState,
    on(stateUpdaters.useGold, (state, { payload }) => { console.log('in-action', state, payload); return {
        ...state,
        gold: state.gold.sub(payload)
    }}),
    on(stateUpdaters.addGold, (state, { payload }) => {
        return {
            ...state,
            gold: state.gold.add(payload)
        }
    }),
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