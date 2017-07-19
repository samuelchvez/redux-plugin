'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

// Higher Order Reducer that receives a sub-tree name, action prefix and the
// plugin element reducer (sub-tree manager), and returns an enhanced reducer
// that manages multiple instances of the same state sub-tree.
var plugin = function plugin(_ref) {
  var name = _ref.name,
      prefix = _ref.prefix,
      reducer = _ref.reducer;
  return function () {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var _ref2 = arguments[1];
    var type = _ref2.type,
        payload = _ref2.payload;

    var _ref3 = payload || {},
        id = _ref3.id,
        rest = _objectWithoutProperties(_ref3, ['id']);

    // If it's registering a new plugin element


    if (type === prefix + '/REGISTERED') {

      // Get a valid initial state
      var firstState = reducer(rest, { type: type, payload: payload });

      return _extends({}, state, _defineProperty({}, id, reducer(rest, { type: type, payload: payload, peState: firstState })));
    }

    // Stop processing if explicitly trying to attach to an existing plugin
    // element state sub-tree.
    if (type === prefix + '/ATTACHED') {
      if (state.hasOwnProperty(id)) {
        return state;
      }
    }

    // If dealing with a plugin action
    if (type.includes(prefix)) {

      // If dealing with a plugin element specific action
      if (typeof id !== 'undefined') {
        if (!state.hasOwnProperty(id)) {
          throw 'Unknown ' + name + '-plugin with id: ' + id;
        }

        return _extends({}, state, _defineProperty({}, id, reducer(state[id], { type: type, payload: payload, peState: state[id] })));
      }

      // If dealing with 'global' actions, apply it to all the plugin element
      // state sub-trees
      var newState = {};
      Object.keys(state).forEach(function (key) {
        var pState = state[key];
        newState[key] = reducer(pState, { type: type, payload: payload, peState: pState });
      });
      return newState;
    }

    return state;
  };
};

exports.default = plugin;

// Configuration higher order reducer

var genConfiguration = exports.genConfiguration = function genConfiguration(_ref4) {
  var prefix = _ref4.prefix,
      _ref4$defaultConfigur = _ref4.defaultConfiguration,
      defaultConfiguration = _ref4$defaultConfigur === undefined ? {} : _ref4$defaultConfigur;
  return function () {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultConfiguration;
    var _ref5 = arguments[1];
    var type = _ref5.type,
        payload = _ref5.payload;

    switch (type) {
      case prefix + '/CONFIGURATION_UPDATED':
        return _extends({}, state, payload);
      case prefix + '/CONFIGURATION_RESET':
        return defaultConfiguration;
      default:
        return state;
    }
  };
};

// Selector generator
var genSelector = exports.genSelector = function genSelector(getState, property) {
  return function (pluginStateTree, id) {
    if (pluginStateTree.hasOwnProperty(id)) {
      return getState(pluginStateTree, id)[property];
    }

    return undefined;
  };
};