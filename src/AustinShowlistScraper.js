import HttpTransport from './HttpTransport.js';
import cheerio from 'cheerio';
import moment from 'moment';
import Show from './models/Show.js';
import ShowParser from './ShowParser.js';

const SHOWLIST_URL = 'http://showlistaustin.com/';

const PARSERS = [
  ShowParser
];

/**
 * Scrape http://austinshowlist.com for showtimes
 */
export default class AustinShowlistScraper
{
  /**
   * Need to inject a transport to fetch HTML
   */
  constructor(
    transport: {get:(url:String) => Promise<String>} = new HttpTransport())
  {
    this._transport = transport;
  }

  /**
   * Get all upcoming shows
   */
  async upcoming(): Promise<Iterable<Show>>
  {
    let html = await this._transport.get(SHOWLIST_URL);
    let $ = cheerio.load(html);
    let $dateHeaders = $('h4[style="color:maroon;"]');
    return this._handleDates($, $dateHeaders);
  }

  /**
   * For each date header, parse each HTML chunk
   */
  * _handleDates($: cheerio, $dateHeaders: cheerio): Iterable<Show>
  {
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
  _parseHtml(html: String, date: moment): Show
  {
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

/**
 * Convert a selector and cheerio context into iterable cheerio objects
 */
function* iterateElements($, $sel): Iterable<cheerio>
{
  for (let el of $sel.toArray()) {
    yield $(el);
  }
}

/**
 * Convert a header DOM node into a date
 */
function dateFromHeader($header: cheerio): moment
{
  let match = $header.text().match(/(.+)(?:,|\.) (.+), (\d+) /);

  if (!match) {
    throw new Error('Unable to parse date header: ' + $header.html());
  }

  let [, day, date, year] = match;
  return moment(`${date} ${year}`, 'MMMM DD YYYY');
}

/**
 * Given a header node, find all of the follow HTML partials for shows
 */
function htmlPartialsFromHeader($header: cheerio): Array<String>
{
  let $contents = $header.next('table').find('tr td');

  let partials = $contents.html()
    .split('<hr style="color:#cccccc;">')
    .filter(s => s && s !== '\n');

  return partials;
}
