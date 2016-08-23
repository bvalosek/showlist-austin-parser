'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

/**
 * Fetching string data via URL
 */
class HttpTransport {
  /**
   * Fetch the text contents of a URL
   */
  get(url) {
    return _asyncToGenerator(function* () {
      // Gotta manually wrap the promise with the weird callback signature
      return new Promise(function (resolve, reject) {

        _request2.default.get(url, function (err, resp, body) {

          // Actual transport error
          if (err) {
            reject(err);
            return;
          }

          // Bad response will also throw
          if (resp.statusCode >= 400 && resp.statusCode < 500) {
            reject(new Error(`${ resp.statusCode }: ${ resp.statusMessage }`));
            return;
          }

          // Always just return string body
          resolve(body);
        });
      });
    })();
  }
}
exports.default = HttpTransport;
module.exports = exports['default'];