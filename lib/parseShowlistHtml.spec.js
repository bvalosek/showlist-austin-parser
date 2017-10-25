const test = require('tape');
const { dateFromHeader } = require('./parseShowlistHtml.js');
const cheerio = require('cheerio');

test('dateFromHeader: handle types in date', t => {
  const html = '<b>Wednesday, April 18. 2018</b> <font color="#cc6699">[</font><a href="http://showlistaustin.com#April18.2018"><font color="#cc6699">link</font></a><font color="#cc6699">]</font>';
  const $ = cheerio.load(html);
  const m = dateFromHeader($);
  t.strictEqual(m.format('M D YYYY'), '4 18 2018', 'able to parse date with typo');
  t.end();
});

