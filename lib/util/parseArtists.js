 const Artist = require('../models/Artist.js');

/*

 Iterable that will parse a string of artists like:

 A, B (info), C (info), D (some, info)

 Needed because the above nested format isn't parsable by regex

*/
module.exports = function* parseArtists(sArtists)
{
  let pCount = 0;
  let name = '';
  let info = '';

  // once we have a chunked artist + info, do any last cleanups and reset the
  // info/name state for the next set of parsing
  let makeArtist = function* () {
    name = name.trim();

    let m;
    if ((m = name.match(/featuring (.*)/))) {
      let names = m[1].split(' and ');
      for (let n of names) {
        let artist = new Artist();
        artist.name = n;
        yield { artist, info };
      }
    } else {
      if (name) {
        let artist = new Artist();
        artist.name = name;
        yield { artist, info };
      }
    }

    info = name = '';
  };

  // Basic parser of collecting info vs artists -- needed to handle the nested
  // parens issue (see tests)
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
};


