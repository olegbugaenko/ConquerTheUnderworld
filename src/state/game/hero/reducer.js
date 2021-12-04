import { stateUpdaters } from "./actions";
import { on, makeReducer } from "../../state-manager";
import { BigNumber } from "@waves/bignumber"

const initialState = {
    energy: {
        value: new BigNumber(0),
        maxValue: new BigNumber(0),
    },
    training: {
        energyLevel: new BigNumber(0),
        energyRegenLevel: new BigNumber(0)
    }
}

export default makeReducer(
    initialState,
    on(stateUpdaters.useEnergy, (state, { payload }) => { return {
        ...state,
        energy: {
            value: state.energy.value.sub(payload),
            maxValue: state.energy.maxValue,
        }
    }}),
    on(stateUpdaters.setMaxEnergy, (state, { payload }) => { return {
        ...state,
        energy: {
            value: state.energy.value,
            maxValue: payload.lt(0) ? new BigNumber(0) : payload,
        }
    }}),
    on(stateUpdaters.regenEnergy, (state, { payload }) => {
        let newEn = state.energy.value.add(payload);
        if(newEn.gt(state.energy.maxValue)) {
            newEn = state.energy.maxValue;
        }
        return {
        ...state,
            energy: {
                value: newEn,
                maxValue: state.energy.maxValue,
            }
        }
    }),
    on(stateUpdaters.updateSkillLevel, (state, { payload }) => ({
        ...state,
        training: {
            ...state.training,
            [payload.id]: (state.training[payload.id] || new BigNumber(0)).add(payload.level)
        }
    }))
    )