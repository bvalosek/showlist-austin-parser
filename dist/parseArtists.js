'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = parseArtists;

var _Artist = require('./models/Artist.js');

var _Artist2 = _interopRequireDefault(_Artist);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Iterable that will parse a string of artists like:
 *
 * A, B (info), C (info), D (some, info)
 *
 * Needed because the above nested format isn't parsable by regex
 */
function* parseArtists(sArtists) {
  let n = 0;
  let pCount = 0;
  let s = sArtists.charAt(0);
  let name = '';
  let info = '';

  let makeArtist = function* () {
    name = name.trim();

    let m;
    if (m = name.match(/featuring (.*)/)) {
      let names = m[1].split(' and ');
      for (let n of names) {
        let artist = new _Artist2.default();
        artist.name = n;
        yield { artist, info };
      }
    } else {
      let artist = new _Artist2.default();
      artist.name = name;
      yield { artist, info };
    }

    info = name = '';
  };

  for (let s of sArtists) {
    switch (s) {
      default:
        if (!pCount) {
          name += s;
        } else {
          info += s;
        }
        break;
      case ',':
        if (!pCount) {
          yield* makeArtist();
        } else {
          info += s;
        }
        break;
      case '(':
        pCount++;
        if (pCount > 1) {
          info += s;
        }
        break;
      case ')':
        pCount--;
        if (pCount > 0) {
          info += s;
        }
        break;
    }
  }

  // Flush buffers
  yield* makeArtist();
}
module.exports = exports['default'];