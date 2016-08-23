'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _Venue = require('./Venue.js');

var _Venue2 = _interopRequireDefault(_Venue);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * A single show
 */
class Show {
  constructor() {
    this.name = null;
    this.url = null;
    this.date = null;
    this.artists = [];
    this.info = null;
    this.venue = new _Venue2.default();
  }
}
exports.default = Show;
module.exports = exports['default'];