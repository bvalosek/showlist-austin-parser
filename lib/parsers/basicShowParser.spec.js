const test = require('tape');
const basicShowParser = require('./basicShowParser.js');

test('basicShowParser: Simple show', t => {
  const html = `
    The Tragically Hip at <a href="http://www.emosaustin.com"><b>Emo&apos;s</b></a> (2015 E. Riverside) [<a href="cgi/genpage.cgi?venue=emos" title="list by venue">+</a>] <font color="#666666">[6:30pm doors, 8pm show]</font>
  `;

  // run it
  const shows = [];
  basicShowParser(html, shows);
  const [ show ] = shows;

  const artist = { artist: { name: 'The Tragically Hip' }, info: '' };

  const venue = {
    name: 'Emo\'s',
    address: '2015 E. Riverside',
    url: 'http://www.emosaustin.com'
  };

  t.deepEqual(show.artists, [ artist ], 'parsed artist');
  t.deepEqual(show.venue, venue, 'venue parsed');
  t.strictEqual(show.name, null, 'no show name');
  t.strictEqual(show.url, null, 'no show url');
  t.strictEqual(show.info, '6:30pm doors, 8pm show', 'info parsed');

  t.end();
});

