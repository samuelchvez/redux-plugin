import React, { Component } from 'react';
import { connect } from 'react-redux';

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
}) => DummyComponent => {

  // This component transforms any dummy component in a plugin
  // element component.
  class PluginElementComponentWrapper extends Component {
    componentWillMount() {
      const { register, peState } = this.props;
      if (typeof peState === 'undefined') {
        register();
      }
    }

    render() {
      const {
        peConfiguration,
        peState,
        children,
        ...rest
      } = this.props;

      if (peState) {
        return <DummyComponent
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

  return connect(
    (state, { id }) => {

      // Gets the plugin element state sub-tree
      const peState = getPluginElementState(getSubstate(state), id);
      const peConfiguration = typeof peState === 'undefined' ?
        undefined:
        getPluginElementConfiguration(peState);

      // If it's registered, pass down these generic props.
      return {
        peId: id,
        peState,
        peConfiguration
      };
    },
    (dispatch, { id, initialState }) => {
      return {
        register() {
          if (typeof initialState !== 'undefined') {
            dispatch(registerPluginElement(id, initialState));
          }
        }
      };
    }
  )(PluginElementComponentWrapper);
} 

export default plugin;
