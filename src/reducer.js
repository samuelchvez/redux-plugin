// Higher Order Reducer that receives a sub-tree name, action prefix and the
// plugin element reducer (sub-tree manager), and returns an enhanced reducer
// that manages multiple instances of the same state sub-tree.
const plugin = ({
  name,
  prefix,
  reducer
}) =>
  (state = {}, { type, payload }) => {
    let { id, ...rest } = payload || {};

    // If it's registering a new plugin element
    if (type === `${ prefix }/REGISTERED`) {

      // Get a valid initial state
      const firstState = reducer(rest, { type, payload });

      return {
        ...state,
        [id]: reducer(rest, { type, payload, peState: firstState })
      }
    }

    // Stop processing if explicitly trying to attach to an existing plugin
    // element state sub-tree.
    if (type === `${ prefix }/ATTACHED`) {
      if (state.hasOwnProperty(id)) {
        return state;
      }
    }

    // If dealing with a plugin action
    if (type.includes(prefix)) {

      // If dealing with a plugin element specific action
      if (typeof id !== 'undefined') {
        if(!state.hasOwnProperty(id)) {
          throw `Unknown ${ name }-plugin with id: ${ id }`;
        }

        return {
          ...state,
          [id]: reducer(state[id], { type, payload, peState: state[id] })
        };
      }

      // If dealing with 'global' actions, apply it to all the plugin element
      // state sub-trees
      let newState = {};
      Object.keys(state).forEach(key => {
        const pState = state[key];
        newState[key] = reducer(pState, { type, payload, peState: pState });
      });
      return newState;
    }

    return state;
  };

export default plugin;

// Configuration higher order reducer
export const genConfiguration = ({ prefix, defaultConfiguration = {} }) =>
  (state = defaultConfiguration, { type, payload }) => {
    switch (type) {
      case `${ prefix }/CONFIGURATION_UPDATED`:
        return {
          ...state,
          ...payload
        };
      case `${ prefix }/CONFIGURATION_RESET`:
        return defaultConfiguration;
      default:
        return state;
    }
}

// Selector generator
export const genSelector = (getState, property) => (pluginStateTree, id) => {
  if (pluginStateTree.hasOwnProperty(id)) {
    return getState(pluginStateTree, id)[property];
  }

  return undefined;
};
