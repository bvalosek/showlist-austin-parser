const test = require('tape');
const basicShowParser = require('./basicShowParser.js');
const limitArtists = require('./limitArtists.js');

const html = `
  Chuck Prophet &amp; Mission Express, Peterson Brothers (10pm), Chuck Prophet &amp; Mission Express (8pm) at the <a href="http://www.continentalclub.com"><b>Continental Club</b></a> <span title="1315 S. Congress">[<font color="darkred">a</font>]</span> [<a href="http://maps.google.com/maps?q=continental+club,+austin" title="map"><font color="darkorange">m</font></a>] [<a href="cgi/genpage.cgi?venue=continental" title="list by venue">+</a>] <font color="#666666"></font>
`;

test('limitArtists: drop double artists', t => {
  const shows = [];

  // simple parse pipe
  basicShowParser(html, shows);
  limitArtists(html, shows);
  const {artists} = shows[0];

  t.strictEqual(artists.length, 2, 'filters artist');

  t.ok(artists.find(x => x.artist.name === 'Chuck Prophet & Mission Express'), true, 'ol chuck');
  t.ok(artists.find(x => x.artist.name === 'Peterson Brothers'), true, 'pete bros');

  t.end();
});
