const cheerio = require('cheerio');
const moment = require('moment-timezone');
const debug = require('debug')('sg:parseShowlistHtml');

const parsers = require('./parsers');

/*

  Get a TZ-ed date from the date header on showlist

*/
function dateFromHeader($header)
{
  const match = $header.text().match(/(\S+) (\d+)[,\.] ?(\d+)/);

  if (!match) {
    throw new Error('Unable to parse date header: ' + $header.html());
  }

  const [ , month, date, year ] = match;
  const m = moment.tz(`${month} ${date} ${year}`, 'MMMM DD YYYY', 'America/Chicago');
  return m;
}

/*

  Give a header node, find all the HTML partials that correspond to show
  listings on showlist

*/
function htmlPartialsFromHeader($header)
{
  const $contents = $header.next('table').find('tr td');

  let html = $contents.html();

  if (!html) {

    // might be a sxsw show and uses a form instead
    const $contents = $header.next('form');
    html = $contents.html();

    // still no..
    if (!html) {
      throw new Error('Unable to find any partials under header');
    }
  }

  return html
    .split('<hr style="color:#cccccc;">')
    .filter(s => s && s !== '\n');
}

/*

  Convert selector into iterable of cheerios

*/
function* iter($, $sel)
{
  for (let el of $sel.toArray()) {
    yield $(el);
  }
}

/*

  Parse the HTML from showlistaustin.com into show objects

*/
module.exports = function* parse(html)
{
  const $ = cheerio.load(html);

  const $dateHeaders = $('h4[style="color:maroon;"]');

  for (let $header of iter($, $dateHeaders)) {
    const date = dateFromHeader($header);
    const partials = htmlPartialsFromHeader($header);
    let showCount = 0;

    // Let each parser run in turn on the parials
    for (let partial of partials) {
      const shows = [ ];

      // Let each parser operate on the stack of shows / partials
      for (const parser of parsers) {
        parser(partial, shows, date);
      }

      yield* shows;
      showCount += shows.length;
    }

    if (showCount < partials.length) {
      debug(`WARNING: scraped ${date.toString()}, only found ${showCount} / ${partials.length} shows`);
    }

  }
};


module.exports.dateFromHeader = dateFromHeader;
