export const createAction = (type, payload) => ({
    type,
    make: param => ({ type, payload: payload(param) }),
});

export const makeReducer = (initialState, ...handlers) => (state, reducerAction) => {
    const newState = handlers
        .reduce(
            (newState, handler) => handler(newState, reducerAction) || newState,
            state || initialState
        );
    return newState;
}
export const on = (action, cb) => (state, reducerAction) => reducerAction.type === action.type
    ? cb(state, reducerAction)
    : state;