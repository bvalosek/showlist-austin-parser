const moment = require('moment-timezone');
const he = require('he');
const Show = require('../models/Show.js');
const Venue = require('../models/Venue.js');
const parseArtists = require('../util/parseArtists.js');

/*

  Basic / non-sxsw show parser

*/
module.exports = function basicShowParser(partial, shows, date)
{
  // def cant handle lists
  if (/<ul/.test(partial)) {
    return;
  }

  // basic parser cannot handle shit starting with html (multi shows, sxsw,
  // etc) unless its a basic single line show from sxsw with a checkbox
  const reSingleCheck = /<h4><input type="checkbox"[^>]+>/;
  if (reSingleCheck.test(partial)) {
    partial = partial.replace(reSingleCheck, '');
  }
  else if (partial[0] === '<') {
    return;
  }

  let basics = partial.match(
    /(?:(.*) with )?(.*) at (?:the )?<a href="([^"]*)">(?:<b>)?([^<]*)(?:<\/b>)?<\/a>/);

  if (!basics) {
    return;
  }

  // Entire thing is 1 show
  const show = new Show();
  show._sourceHtml = partial;
  show.date = moment.tz(date, 'America/Chicago');

  // Pull out info
  basics = basics.map(x => x ? he.decode(x) : x);
  let [, eventName, artists, venueUrl, venueName] = basics;

  // If event name looks like a URL, put it as link
  let eventUrl = eventName ? eventName.match(/<a href="(.*)">(.*)<\/a>/) : null;
  if (eventUrl) {
    [, eventUrl, eventName] = eventUrl;
  }

  // dump n chump
  show.artists = [...parseArtists(artists)];
  show.name = eventName || null;
  show.url = eventUrl || null;
  show.venue = new Venue();
  show.venue.name = venueName;
  show.venue.url = venueUrl;
  show.links = [];

  // Attempt to find venue address
  let venueAddress = partial.match(/span title="([^"]+)"/);

  // Alternative address
  if (!venueAddress) {
    venueAddress = partial.match(/a> \((.*)\) \[<a href/);
  }

  if (venueAddress) {
    show.venue.address = venueAddress[1];
  }

  // pop out info
  let info = partial.match(/<font color="#666666">\[(.+)\]/);

  if (info) {
    const text = info[1];

    show.info = text.trim();
    show.links = [];

    // try to extract time
    let time = show.info.split(', ')
      .map(x => x.match(/([0-9:]+(?:am|pm))/))
      .map(x => x ? x[1] : null)
      .filter(x => x);

    if (time.length) {
      const t = moment(time, 'hh:mma');
      show.date
        .hour(t.hour())
        .minute(t.minute());
    }
  }

  shows.push(show);
};
