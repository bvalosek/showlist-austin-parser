import test from 'tape';
import ShowParser from '../src/ShowParser.js';
import moment from 'moment';

test('Simple show', t => {
  t.plan(6);

  let html = `
    The Tragically Hip at <a href="http://www.emosaustin.com"><b>Emo&apos;s</b></a> (2015 E. Riverside) [<a href="cgi/genpage.cgi?venue=emos" title="list by venue">+</a>] <font color="#666666">[6:30pm doors, 8pm show]</font>
  `;

  let p = new ShowParser(html, moment('2015-01-01'));
  let show = p.parse();

  t.deepEqual(show.artists, [
      { artist: { name: 'The Tragically Hip' }, info: '' }
    ], 'parsed artist');

  var d = moment('2015-01-01 18:30:00.000-05:00');
  t.ok(show.date.isSame(d), 'date and time parsed');

  var venue = {
    name: 'Emo\'s',
    address: '2015 E. Riverside',
    url: 'http://www.emosaustin.com'
  };

  t.deepEqual(show.venue, venue, 'venue parsed');

  t.strictEqual(show.info, '6:30pm doors, 8pm show', 'info parsed');
  t.strictEqual(show.name, null, 'no show name');
  t.strictEqual(show.url, null, 'no show url');
});
