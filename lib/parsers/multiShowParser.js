const Show = require('../models/Show.js');
const Venue = require('../models/Venue.js');
const parseArtists = require('../util/parseArtists.js');

const he = require('he');
const moment = require('moment-timezone');
const cheerio = require('cheerio');

 
/*

  Handle a multi-show (or named event) style listing (<li>s, etc) This is only
  during SXSW

*/
module.exports = function multiShowParser(partial, shows, date)
{
  // event style always has ULs in it
  if (!/<ul/.test(partial)) {
    return;
  }

  // shit before the list is always the event info
  const preInfo = partial.match(/(.*)<ul/)[1];
  const $preInfo = cheerio.load(preInfo);

  const showName = $preInfo('h4').text();
  const showUrl = $preInfo('a').attr('href');

  // this parser doesnt apply
  if (!showName && !showUrl) {
    return;
  }

  // this happens for sxsw formatted shows on non-sxsw days (fuck it for now)
  if (!showName) {
    return;
  }

  // find each chunk
  const $partial = cheerio.load(partial);
  const $chunks = $partial('ul li');

  // check each list item and create a show for it
  const chunkShows = [];

  // this is flagged if, for some chunk, we are missing a venue. Then need to set the venue for all shows
  let implicitVenue = false;

  for (const chunk of $chunks.toArray()) {
    const $chunk = $partial(chunk);
    const text = $chunk.text();
    const html = $chunk.html();

    // starting with a link implies some weird shit. lets just bounce (fucking
    // boat show shit)
    if (/^<h4><a/.test(html)) {
      return;
    }

    // lol what the fuck
    if (/Sean Ripple/.test(html)) {
      return;
    }

    // 1 show per chunk
    const show = new Show();
    show.date = moment.tz(date, 'America/Chicago');
    show.name = showName.trim();
    show.url = showUrl || null;
    show._sourceHtml = html;

    // shows info always look like this shit
    const info = $chunk.find('font[color=#666666]').html();
    if (info) {
      show.info = info.replace(/^\[/, '').replace(/\]$/, '');
    }

    // explicit show mode will include a venue section after artists
    const basics = html.match(/<h4>(.*?) at (?:the )?(.*)/);

    if (basics) {
      const [, artists, allOtherInfo] = basics;
      show.artists = [...parseArtists(he.decode(artists))];
      show.venue = new Venue();

      const $other = cheerio.load(allOtherInfo);

      // normal venue, starts with a link
      const $b = $other('b').first();
      if (/^<a href=/.test(allOtherInfo)) {
        const $a = $other('a').first();
        show.venue.name = $a.text();
        show.venue.url = $a.attr('href');
      }
      else if ($b.text()) {
        show.venue.name = $b.text();
      }
      else {
        // something pretty bad has probably happened
        return;
      }

      // attempt to vind address
      const parens = allOtherInfo.match(/\((.*)\)/);
      const $span = $other('span[title]').first();

      if (parens) {
        show.venue.address = parens[1];
      }
      else if ($span && $span.attr('title')) {
        show.venue.address = $span.attr('title');
      }
      else {
        // ????
      }

      // show.venue.name = venueName.trim();
      chunkShows.push(show);
    }
    else if (show.info) {

      // check for implicit show mode (multi line info 1 venue) and make
      // everything but info the artist
      const match = text.match(/^(.+)\[.+\]$/);
      show.artists = [...parseArtists(match[1])];
      implicitVenue = true;
      chunkShows.push(show);

    }
    else {

      // implicit with JUSt artists
      show.artists = [...parseArtists(text)];
      implicitVenue = true;
      chunkShows.push(show);

    }

  }

  // set all the same venue if we can. If not something is pretty wrong
  if (implicitVenue) {
    const showWithVenue = chunkShows.find(s => s.venue);
    if (showWithVenue) {
      chunkShows.forEach(s => {
        s.venue = showWithVenue.venue;
        s.info = [s.info, showWithVenue.info].map(x => x).join(', ');
      });
    }
    else {
      // happens when no venue can be found, not the biggest deal in the world
      // but something fucked probably happened
      return;
    }
  }

  // add em all
  chunkShows.forEach(s => s.artists.length && shows.push(s));

};

