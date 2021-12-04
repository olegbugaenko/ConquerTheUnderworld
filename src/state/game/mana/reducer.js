import { stateUpdaters } from "./actions";
import { on, makeReducer } from "../../state-manager";
import { BigNumber } from "@waves/bignumber"


const initialState = {
    mana: new BigNumber(10),
    units: {
        mage0: new BigNumber(1),
        mage1: new BigNumber(0),
        mage2: new BigNumber(0),
        mage3: new BigNumber(0),
    },
    upgrades: {

    }
}

export default makeReducer(
    initialState,
    on(stateUpdaters.useMana, (state, { payload }) => { return {
        ...state,
        mana: state.mana.sub(payload)
    }}),
    on(stateUpdaters.addMana, (state, { payload }) => {
        return {
            ...state,
            mana: state.mana.add(payload)
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