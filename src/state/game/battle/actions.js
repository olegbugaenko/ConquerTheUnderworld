import {createAction} from "../../state-manager";

export const stateUpdaters = {
    setBattleLevel: createAction('SET_BATTLE_LEVEL', level => level),
    setMaxBattleLevel: createAction('SET_MAX_BATTLE_LEVEL', level => level),
    setTimeToNextRound: createAction('SET_TIME_TO_NEXT_ROUND', time => time),
    // addGold: createAction('ADD_GOLD', amount => amount),
    setEnemy: createAction('SET_ENEMY_CHARACTERISTICS', payload => payload),
    setFameAmount: createAction('SET_FAME_AMOUNT', amount => amount),
    setBattleInProgress: createAction('SET_BATTLE_STATUS', pl => pl),
    setAutoAdvance: createAction('SET_AUTO_ADVANCE', pl => pl),
}

export const interactionActions = {
    startBattle: createAction('START_BATTLE', payload => payload),
    stopBattle: createAction('STOP_BATTLE', payload => payload),
    setAutoAdvanceOptions: createAction('SET_AUTOADVANCE_OPTIONS', payload => payload)
}