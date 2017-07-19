'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _component = require('./component');

Object.defineProperty(exports, 'PluginHHOComponent', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_component).default;
  }
});

var _reducer = require('./reducer');

Object.defineProperty(exports, 'PluginHOReducer', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_reducer).default;
  }
});
Object.defineProperty(exports, 'generateAccessor', {
  enumerable: true,
  get: function get() {
    return _reducer.generateAccessor;
  }
});
Object.defineProperty(exports, 'hoConfigurationReducer', {
  enumerable: true,
  get: function get() {
    return _reducer.hoConfigurationReducer;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }