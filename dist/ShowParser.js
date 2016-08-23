'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _Show = require('./models/Show.js');

var _Show2 = _interopRequireDefault(_Show);

var _Venue = require('./models/Venue.js');

var _Venue2 = _interopRequireDefault(_Venue);

var _parseArtists = require('./parseArtists.js');

var _parseArtists2 = _interopRequireDefault(_parseArtists);

var _he = require('he');

var _he2 = _interopRequireDefault(_he);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class ShowParser {
  constructor(html) {
    let date = arguments.length <= 1 || arguments[1] === undefined ? (0, _moment2.default)() : arguments[1];

    this._html = html;
    this._show = new _Show2.default();
    this._show.date = (0, _moment2.default)(date);
    this._show.date.utcOffset(-5);
  }

  /**
   * With the given HTML, parse out what we need
   */
  parse() {
    this._parseBasics();
    this._parseInfo();
    this._parseAddress();
    return this._show;
  }

  _parseBasics() {
    let show = this._show;

    let basics = this._html.match(/(?:(.*) with )?(.*) at (?:the )?<a href="([^"]*)">(?:<b>)?([^<]*)(?:<\/b>)?<\/a>/);

    // Doesn't match pattern
    if (!basics) {
      return null;
    }

    // unescape HTML entities
    basics = basics.map(x => x ? _he2.default.decode(x) : x);

    var _basics = basics;

    var _basics2 = _slicedToArray(_basics, 5);

    let eventName = _basics2[1];
    let artists = _basics2[2];
    let venueUrl = _basics2[3];
    let venueName = _basics2[4];

    // If event name looks like a URL, put it as link

    let eventUrl = eventName ? eventName.match(/<a href="(.*)">(.*)<\/a>/) : null;

    if (eventUrl) {
      var _eventUrl = eventUrl;

      var _eventUrl2 = _slicedToArray(_eventUrl, 3);

      eventUrl = _eventUrl2[1];
      eventName = _eventUrl2[2];
    }

    show.name = eventName || null;
    show.url = eventUrl || null;
    show.artists = [...(0, _parseArtists2.default)(artists)];
    show.venue = new _Venue2.default();
    show.venue.name = venueName;
    show.venue.url = venueUrl;
  }

  _parseAddress() {
    let html = this._html;

    // Attempt to find venue address
    let venueAddress = html.match(/span title="([^"]+)"/);

    // Alternative address
    if (!venueAddress) {
      venueAddress = html.match(/a> \((.*)\) \[<a href/);
    }

    if (!venueAddress) {
      return;
    }

    var _venueAddress = venueAddress;

    var _venueAddress2 = _slicedToArray(_venueAddress, 2);

    venueAddress = _venueAddress2[1];

    this._show.venue.address = venueAddress;
  }

  _parseInfo() {
    let info = this._html.match(/<font color="#666666">\[(.+)\]/);

    if (!info) {
      return;
    }

    var _info = info;

    var _info2 = _slicedToArray(_info, 2);

    info = _info2[1];


    this._show.info = info;

    // try to extract time
    let time = info.split(', ').map(x => x.match(/([0-9:]+(?:am|pm))/)).map(x => x ? x[1] : null).filter(x => x);

    // Modify the date
    if (time.length) {
      var _time = time;

      var _time2 = _slicedToArray(_time, 1);

      time = _time2[0];

      let t = (0, _moment2.default)(time, 'hh:mma');
      this._show.date.hour(t.hour()).minute(t.minute());
    }
  }
}
exports.default = ShowParser;
module.exports = exports['default'];