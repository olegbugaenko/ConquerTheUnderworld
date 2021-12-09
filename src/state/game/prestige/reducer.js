import { stateUpdaters } from "./actions";
import { on, makeReducer } from "../../state-manager";
import { BigNumber } from "@waves/bignumber"

/*BigNumber.set({
    EXPONENTIAL_AT: [-4,4]
})*/


const initialState = {
    prestige: {

    },
    isPrestiging: false,
    prophecy: 'civilian',
    upgrades: {

    }
}

export default makeReducer(
    initialState,
    on(stateUpdaters.addPrestige, (state, { payload }) => { return {
        ...state,
        prestige: {
            ...state.prestige,
            [payload.id || state.prophecy]: (state.prestige[state.prophecy] || new BigNumber(0)).add(payload.amount)
        }
    }}),
    on(stateUpdaters.setIsPrestiging, (state, { payload }) => {
        return {
            ...state,
            isPrestiging: payload,
        }
    }),
    on(stateUpdaters.setProphecy, (state, { payload }) => {
        return {
            ...state,
            prophecy: payload,
        }
    }),
    on(stateUpdaters.setUpgrade, (state, { payload }) => {
        return {
            ...state,
            upgrades: {
                ...state.upgrades,
                [payload]: (state.upgrades[payload] || new BigNumber(0)).add(1)
            }
        }
    }),

    )