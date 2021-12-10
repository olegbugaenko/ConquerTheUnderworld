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
        energyRegenLevel: new BigNumber(0),
    },
    autoPurchase: {
        energyLevel: false,
        energyRegenLevel: false,
    },
    necklaces: {
        mana: new BigNumber(0),
        gold: new BigNumber(0),
        perUnit_mana: {

        },
        perUnit_gold: {

        }
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
    })),
    on(stateUpdaters.addNecklace, (state, { payload }) => ({
        ...state,
        necklaces: {
            ...state.necklaces,
            [payload.id]: (state.necklaces[payload.id] || new BigNumber(0)).add(1)
        }
    })),
    on(stateUpdaters.addNecklaceToUnit, (state, { payload }) => {
        const key = `perUnit_${payload.necklaceId}`;
        let currentUsed = new BigNumber(0);
        for(const unit in state.necklaces[key]) {
            currentUsed = currentUsed.add(state.necklaces[key][unit]);
        }
        if(!state.necklaces[payload.necklaceId] || state.necklaces[payload.necklaceId].lt(currentUsed)) {
            console.log('No Way! ', currentUsed.valueOf());
            return state;
        }
        return {
            ...state,
            necklaces: {
                ...state.necklaces,
                [key]: {
                    ...state.necklaces[key],
                    [payload.unitId]: (state.necklaces[key][payload.unitId] || new BigNumber(0)).add(1)
                }
            }
        }
    }),
    on(stateUpdaters.setAutopurchase, (state, { payload }) => ({
        ...state,
        autoPurchase: {
            ...state.autoPurchase,
            [payload.id]: payload.value,
        }
    }))
    )