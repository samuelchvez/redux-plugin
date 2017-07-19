'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// This component transforms any dummy component in a plugin element component.
var PluginElementComponentWrapper = function (_Component) {
  _inherits(PluginElementComponentWrapper, _Component);

  function PluginElementComponentWrapper() {
    _classCallCheck(this, PluginElementComponentWrapper);

    return _possibleConstructorReturn(this, (PluginElementComponentWrapper.__proto__ || Object.getPrototypeOf(PluginElementComponentWrapper)).apply(this, arguments));
  }

  _createClass(PluginElementComponentWrapper, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      var register = this.props.register;

      if (typeof register !== 'undefined') {
        register();
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          peId = _props.peId,
          peConfiguration = _props.peConfiguration,
          peState = _props.peState,
          DummyComponent = _props.DummyComponent,
          children = _props.children,
          rest = _objectWithoutProperties(_props, ['peId', 'peConfiguration', 'peState', 'DummyComponent', 'children']);

      if (peState) {
        return _react2.default.createElement(
          DummyComponent,
          _extends({
            peId: peId,
            peState: peState
          }, peState, peConfiguration, rest),
          children
        );
      }

      return null;
    }
  }]);

  return PluginElementComponentWrapper;
}(_react.Component);

// This is a second-level higher-order component. It receives a high level
// description, and returns a higher-order component for a given state tree.
// The returned higher-order component takes a dummy component (presentational)
// and returns a connected Plugin Element Component, ready to take props and
// render a piece of the state tree.


var plugin = function plugin(_ref) {
  var defaultStateKey = _ref.defaultStateKey,
      registerPluginElement = _ref.registerPluginElement,
      _ref$getPluginElement = _ref.getPluginElementState,
      getPluginElementState = _ref$getPluginElement === undefined ? function (pTree, id) {
    return pTree[id];
  } : _ref$getPluginElement,
      _ref$getPluginElement2 = _ref.getPluginElementConfiguration,
      getPluginElementConfiguration = _ref$getPluginElement2 === undefined ? function (pes) {
    return pes.configuration || {};
  } : _ref$getPluginElement2,
      _ref$getSubstate = _ref.getSubstate,
      getSubstate = _ref$getSubstate === undefined ? function (state) {
    return state[defaultStateKey];
  } : _ref$getSubstate;
  return function (DummyComponent) {
    return (0, _reactRedux.connect)(function (state, _ref2) {
      var id = _ref2.id;


      // Gets the plugin element state sub-tree
      var peState = getPluginElementState(getSubstate(state), id);

      // If it's registered, pass down these generic props.
      if (peState) {
        return {
          peId: id,
          peState: peState,
          peConfiguration: getPluginElementConfiguration(peState),
          DummyComponent: DummyComponent
        };
      }

      return {};
    }, function (dispatch, _ref3) {
      var id = _ref3.id,
          initialState = _ref3.initialState;
      return {
        register: function register() {
          // If initial state provided, register the plugin element state sub-tree.
          if (initialState) {
            dispatch(registerPluginElement(id, initialState));
          }
        }
      };
    })(PluginElementComponentWrapper);
  };
};

exports.default = plugin;