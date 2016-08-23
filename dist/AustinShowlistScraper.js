'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _HttpTransport = require('./HttpTransport.js');

var _HttpTransport2 = _interopRequireDefault(_HttpTransport);

var _cheerio = require('cheerio');

var _cheerio2 = _interopRequireDefault(_cheerio);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _Show = require('./models/Show.js');

var _Show2 = _interopRequireDefault(_Show);

var _ShowParser = require('./ShowParser.js');

var _ShowParser2 = _interopRequireDefault(_ShowParser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

const SHOWLIST_URL = 'http://showlistaustin.com/';

const PARSERS = [_ShowParser2.default];

/**
 * Scrape http://austinshowlist.com for showtimes
 */
class AustinShowlistScraper {
  /**
   * Need to inject a transport to fetch HTML
   */
  constructor() {
    let transport = arguments.length <= 0 || arguments[0] === undefined ? new _HttpTransport2.default() : arguments[0];

    this._transport = transport;
  }

  /**
   * Get all upcoming shows
   */
  upcoming() {
    var _this = this;

    return _asyncToGenerator(function* () {
      let html = yield _this._transport.get(SHOWLIST_URL);
      let $ = _cheerio2.default.load(html);
      let $dateHeaders = $('h4[style="color:maroon;"]');
      return _this._handleDates($, $dateHeaders);
    })();
  }

  /**
   * For each date header, parse each HTML chunk
   */
  *_handleDates($, $dateHeaders) {
    for (let $header of iterateElements($, $dateHeaders)) {
      let date = dateFromHeader($header);
      let partials = htmlPartialsFromHeader($header);

      for (let html of partials) {
        let show = this._parseHtml(html, date);
        if (!show) continue;
        yield show;
      }
    }
  }

  /**
   * Translate html partial into show
   */
  _parseHtml(html, date) {
    for (let TParser of PARSERS) {
      let parser = new TParser(html, date);
      let show = parser.parse();
      if (show) {
        return show;
      }
    }

    return null;
  }

}

exports.default = AustinShowlistScraper; /**
                                          * Convert a selector and cheerio context into iterable cheerio objects
                                          */

function* iterateElements($, $sel) {
  for (let el of $sel.toArray()) {
    yield $(el);
  }
}

/**
 * Convert a header DOM node into a date
 */
function dateFromHeader($header) {
  let match = $header.text().match(/(.+)(?:,|\.) (.+), (\d+) /);

  if (!match) {
    throw new Error('Unable to parse date header: ' + $header.html());
  }

  var _match = _slicedToArray(match, 4);

  let day = _match[1];
  let date = _match[2];
  let year = _match[3];

  return (0, _moment2.default)(`${ date } ${ year }`, 'MMMM DD YYYY');
}

/**
 * Given a header node, find all of the follow HTML partials for shows
 */
function htmlPartialsFromHeader($header) {
  let $contents = $header.next('table').find('tr td');

  let partials = $contents.html().split('<hr style="color:#cccccc;">').filter(s => s && s !== '\n');

  return partials;
}
module.exports = exports['default'];