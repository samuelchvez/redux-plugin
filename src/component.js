import React, { Component } from 'react';
import { connect } from 'react-redux';

// This component transforms any dummy component in a plugin element component.
class PluginElementComponentWrapper extends Component {
  componentWillMount() {
    const { register } = this.props;
    if (typeof register !== 'undefined') { register(); }
  }

  render() {
    const {
      peId,
      peConfiguration,
      peState,
      DummyComponent,
      children,
      ...rest
    } = this.props;

    if (peState) {
      return <DummyComponent
        peId={ peId }
        peState={ peState }
        { ...peState }
        { ...peConfiguration }
        { ...rest } >
        { children }
      </DummyComponent>;
    }

    return null;
  }
}

// This is a second-level higher-order component. It receives a high level
// description, and returns a higher-order component for a given state tree.
// The returned higher-order component takes a dummy component (presentational)
// and returns a connected Plugin Element Component, ready to take props and
// render a piece of the state tree.
const plugin = ({
  defaultStateKey,
  registerPluginElement,
  getPluginElementState = (pTree, id) => pTree[id],
  getPluginElementConfiguration = pes => pes.configuration || {},
  getSubstate = state => state[defaultStateKey]
}) => DummyComponent => connect(
  (state, { id }) => {

    // Gets the plugin element state sub-tree
    const peState = getPluginElementState(getSubstate(state), id);

    // If it's registered, pass down these generic props.
    if (peState) {
      return {
        peId: id,
        peState,
        peConfiguration: getPluginElementConfiguration(peState),
        DummyComponent
      };
    }

    return {};
  },
  (dispatch, { id, initialState }) => ({
    register() {
      // If initial state provided, register the plugin element state sub-tree.
      if (initialState) {
        dispatch(registerPluginElement(id, initialState));
      }
    }
  })
)(PluginElementComponentWrapper);

export default plugin;
