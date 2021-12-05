import {createAction} from "../state-manager";

export const stateUpdaters = {
    load: createAction('LOAD_GAME_TO_STATE', game => game),
}

export const interactionActions = {
    load: createAction('LOAD_GAME', content => content),
    save: createAction('SAVE_GAME', () => ({})),
}