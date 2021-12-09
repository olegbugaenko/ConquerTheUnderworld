import { makeReducer, on } from "../../state-manager";
import {stateUpdaters} from "./actions";
import { BigNumber } from "@waves/bignumber";

const initialState = {
    level: new BigNumber(0),
    maxLevel: new BigNumber(0),
    isBattleInProgress: false,
    isAutoAdvance: true,
    battleStatus: {
        round: new BigNumber(0),
        timeToNextRound: new Date(),
    },
    enemy: {
        units: {
            qty: new BigNumber(0),
            stats: {
                hp: new BigNumber(10),
                df: new BigNumber(1),
                at: new BigNumber(2)
            }
        }
    },
    fame: new BigNumber(0),
}

export default makeReducer(
    initialState,
    on(stateUpdaters.setBattleInProgress, (state, { payload }) => ({
        ...state,
        isBattleInProgress: !!payload,
    })),
    on(stateUpdaters.setAutoAdvance, (state, { payload }) => ({
        ...state,
        isAutoAdvance: !!payload,
    })),
    on(stateUpdaters.setBattleLevel, (state, { payload }) => ({
        ...state,
        level: payload,
    })),
    on(stateUpdaters.setMaxBattleLevel, (state, { payload }) => ({
        ...state,
        maxLevel: payload,
    })),
    on(stateUpdaters.setTimeToNextRound, (state, { payload }) => ({
        ...state,
        battleStatus: payload,
    })),
    on(stateUpdaters.setFameAmount, (state, { payload }) => ({
        ...state,
        fame: payload,
    })),
    on(stateUpdaters.setEnemy, (state, { payload }) => ({
        ...state,
        enemy: payload,
    }))
);