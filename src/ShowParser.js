import Show from './models/Show.js';
import Venue from './models/Venue.js';
import parseArtists from './parseArtists.js';
import he from 'he';
import moment from 'moment';

export default class ShowParser
{
  constructor(html: String, date: moment = moment())
  {
    this._html = html;
    this._show = new Show();
    this._show.date = moment(date);
    this._show.date.utcOffset(-5);
  }

  /**
   * With the given HTML, parse out what we need
   */
  parse(): Show
  {
    this._parseBasics();
    this._parseInfo();
    this._parseAddress();
    return this._show;
  }

  _parseBasics()
  {
    let show = this._show;

    let basics = this._html.match(
      /(?:(.*) with )?(.*) at (?:the )?<a href="([^"]*)">(?:<b>)?([^<]*)(?:<\/b>)?<\/a>/);

    // Doesn't match pattern
    if (!basics) {
      return null;
    }

    // unescape HTML entities
    basics = basics.map(x => x ? he.decode(x) : x);

    let [, eventName, artists, venueUrl, venueName] = basics;

    // If event name looks like a URL, put it as link
    let eventUrl = eventName ? eventName.match(/<a href="(.*)">(.*)<\/a>/) : null;

    if (eventUrl) {
      [, eventUrl, eventName] = eventUrl;
    }

    show.name = eventName || null;
    show.url = eventUrl || null;
    show.artists = [...parseArtists(artists)];
    show.venue = new Venue();
    show.venue.name = venueName;
    show.venue.url = venueUrl;
  }

  _parseAddress()
  {
    let html = this._html;

    // Attempt to find venue address
    let venueAddress = html.match(/span title="([^"]+)"/);

    // Alternative address
    if (!venueAddress) {
      venueAddress = html.match(/a> \((.*)\) \[<a href/);
    }

    if (!venueAddress) {
      return;
    }

    [, venueAddress] = venueAddress;
    this._show.venue.address = venueAddress;
  }

  _parseInfo()
  {
    let info = this._html.match(/<font color="#666666">\[(.+)\]/);

    if (!info) {
      return;
    }

    [, info] = info;

    this._show.info = info;

    // try to extract time
    let time = info.split(', ')
      .map(x => x.match(/([0-9:]+(?:am|pm))/))
      .map(x => x ? x[1] : null)
      .filter(x => x);

    // Modify the date
    if (time.length) {
      [time] = time;
      let t = moment(time, 'hh:mma');
      this._show.date.hour(t.hour()).minute(t.minute());
    }

  }
}
