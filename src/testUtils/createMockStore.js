export function createMockStore(initialState) {
  let actions = [];

  return {
    getState: () => initialState,
    dispatch: (action) => {
      actions.push(action);
      return action;
    },
    getActions: () => actions,
    clearActions: () => { actions = []; },
    subscribe: () => () => {},
  };
}
