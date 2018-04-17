const test = require('tape');
const { dateFromHeader } = require('./parseShowlistHtml.js');
const cheerio = require('cheerio');

test('dateFromHeader: handle typos in date', t => {
  const html = '<b>Wednesday, April 18. 2018</b> <font color="#cc6699">[</font><a href="http://showlistaustin.com#April18.2018"><font color="#cc6699">link</font></a><font color="#cc6699">]</font>';
  const $ = cheerio.load(html);
  const m = dateFromHeader($);
  t.strictEqual(m.format('M D YYYY'), '4 18 2018', 'able to parse date with typo');
  t.end();
});

test('dateFromHeader: handle missing space after comma', t => {
  const html = '<b>Sunday, July 1,2018</b> <font color="#cc6699">[</font><a href="http://showlistaustin.com#2018July1"><font color="#cc6699">link</font></a><font color="#cc6699">]</font>';
  const $ = cheerio.load(html);
  const m = dateFromHeader($);
  t.strictEqual(m.format('M D YYYY'), '7 1 2018', 'able to parse date without space after comma');
  t.end();
});

test('dateFromHeader: handle missing space month', t => {
  const html = '<b>Saturday, August4, 2018</b> <font color="#cc6699">[</font><a href="http://showlistaustin.com#2018August4"><font color="#cc6699">link</font></a><font color="#cc6699">]</font>';
  const $ = cheerio.load(html);
  const m = dateFromHeader($);
  t.strictEqual(m.format('M D YYYY'), '8 4 2018', 'able to parse date without space after month');
  t.end();
});

