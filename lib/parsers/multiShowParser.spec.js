const test = require('tape');
const multiShowParser = require('./multiShowParser.js');

test('sxsw explicit venue, single show line', t => {
  const html = `<h4><input type="checkbox" name="satday" value="satday62"> <a href="https://www.facebook.com/events/959195647492920/">Jenni Finlay Promotions and Conqueroo Day Party</a></h4><ul style="margin-top: 0;margin-bottom: 0;">
<li><h4>James McMurtry, Ray Wylie Hubbard, Kinky Friedman, Bill Carter, Paul Burch, Whitney Rose, Kelley Mickwee and Jamie Wilson (of The Trishas), The Grahams, Luke Pruitt, High Plains Jamboree, Tim Easton, Brett Harris, Charlie Faye & the Fayettes, Matt The Electrician, Sam Baker, Curtis McMurtry, Brian Molhar, Mando Saenz at <a href="http://www.threadgills.com"><b>Threadgill's</b></a> (301 W. Riverside Dr.) <font color="#666666">[noon, free]</font></h4></li>
</ul>`;

  const shows = [];
  multiShowParser(html, shows);

  t.strictEqual(shows.length, 1, 'found 1 show');
  const show = shows[0];

  t.strictEqual(show.name, 'Jenni Finlay Promotions and Conqueroo Day Party', 'show name');
  t.strictEqual(show.url, 'https://www.facebook.com/events/959195647492920/', 'show url');
  t.strictEqual(show.artists.length, 18, 'artist list');
  t.strictEqual(show.venue.name, 'Threadgill\'s');
  t.strictEqual(show.venue.address, '301 W. Riverside Dr.');
  t.strictEqual(show.venue.url, 'http://www.threadgills.com');

  t.strictEqual(show.artists[0].artist.name, 'James McMurtry', 'artist name');

  t.end();
});

test('sxsw explict venue, multiple shows', t => {
  const html = `<h4><input type="checkbox" name="tueday" value="tueday1"> <a href="https://www.facebook.com/events/1685732801695644/">Spring Break Boogie Day 1</a></h4><ul style="margin-top: 0;margin-bottom: 0;">
<li><h4>Sages, Pearl Charles, Tamar Aphek, Feels, Go!Zilla, La Witch, Sugar Candy Mountain, The Parrots, The Roaring 420's, Al Lover, Glitter Wizard, Death Hymn Number 9, The Dream Ride, Adult Books, Thelma & The Sleeze at <a href="http://www.hotelvegasaustin.com/"><b>Hotel Vegas</b></a> (1500 E. 6th St.) <font color="#666666">[inside]</font></h4></li>
<li><h4>Mpho, Beverly, Party Static, Bambara, Guerilla Toss, Pill, Future Punx, Justin Frye (of PC Worship), Empty Markets, Loafers, Slow, Mercury Girls, Sweet Talk, Party Girl, Hidden Ritual, Burnt Skull at the <a href="http://www.hotelvegasaustin.com/"><b>Volstead Lounge</b></a> (1500 E. 6th St.) <font color="#666666">[inside]</font></h4></li>
<li><h4>Grenda, Extraperlo, JJUUJJUUm, Total Abuse, Night Beats, US Weekly, Xetas, Sweat Lodge, The American Sharks, The Oh Sees at <a href="http://www.hotelvegasaustin.com/"><b>Hotel Vegas</b></a> (1500 E. 6th St.) <font color="#666666">[patio 1]</font></h4></li>
<li><h4>Boan, Mirror Travel, Sailor Poon, Sheer Mag, Lochness Mobsters, Blxpltn, Eagle Claw, The Spits at <a href="http://www.hotelvegasaustin.com/"><b>Hotel Vegas</b></a> (1500 E. 6th St.) <font color="#666666">[patio 2]</font></h4></li>
</ul>`;

  const shows = [];
  multiShowParser(html, shows);

  t.strictEqual(shows.length, 4, 'found all shows');

  // some spot checks
  t.strictEqual(shows[0].name, 'Spring Break Boogie Day 1', 'show name shared');
  t.strictEqual(shows[1].name, 'Spring Break Boogie Day 1', 'show name shared');
  t.strictEqual(shows[2].name, 'Spring Break Boogie Day 1', 'show name shared');
  t.strictEqual(shows[3].name, 'Spring Break Boogie Day 1', 'show name shared');
  t.strictEqual(shows[3].url, 'https://www.facebook.com/events/1685732801695644/', 'show url');

  t.strictEqual(shows[0].info, 'inside', 'show info');
  t.strictEqual(shows[1].info, 'inside', 'show info');
  t.strictEqual(shows[2].info, 'patio 1', 'show info');
  t.strictEqual(shows[3].info, 'patio 2', 'show info');

  t.strictEqual(shows[0].venue.name, 'Hotel Vegas', 'venue name');
  t.strictEqual(shows[1].venue.name, 'Volstead Lounge', 'venue name');
  t.strictEqual(shows[2].venue.name, 'Hotel Vegas', 'venue name');
  t.strictEqual(shows[3].venue.name, 'Hotel Vegas', 'venue name');

  t.strictEqual(shows[0].artists[0].artist.name, 'Sages', 'artist name');
  t.strictEqual(shows[3].artists[0].artist.name, 'Boan', 'artist name');

  t.end();
});

test('sxsw implicit venue, multiple shows', t => {
  const html = `<h4><input type="checkbox" name="wedday" value="wedday7"> <a href="https://www.facebook.com/events/243761595960306/">AdHoc Unofficial Showcase</a></h4><ul style="margin-top: 0;margin-bottom: 0;">
<li><h4>Lust For Youth (5:15pm), Prince Rama (4:30pm), Guerilla Toos (3:45pm), Yung (3pm), Palm (2:15pm), PWR BTTM (1:30pm), Wall (12:45pm), Surfbort (noon) <font color="#666666">[inside stage]</font></h4></li>
<li><h4>White Lung (5pm), Downtown Boys (4:15pm), Dilly Dally (3:30pm), Waxahatchee (2:45pm), Frankie Cosmos (2pm), All Dogs (1:15pm), Teen Suicide (12:30pm) <font color="#666666">[outside stage]</font></h4></li>
<li><h4> at <a href="http://cheerupcharlies.com/"><b>Cheer Up Charlies</b></a> (900 Red River St.) <font color="#666666">[free, <a href="https://www.ticketfly.com/purchase/event/1093663">RSVP</a>]</font></h4></li>
</ul>`;

  const shows = [];
  multiShowParser(html, shows);

  t.strictEqual(shows.length, 2, 'found all shows');

  t.strictEqual(shows[0].name, 'AdHoc Unofficial Showcase', 'show name shared');
  t.strictEqual(shows[1].name, 'AdHoc Unofficial Showcase', 'show name shared');
  t.strictEqual(shows[0].venue.name, 'Cheer Up Charlies', 'venue name shared');
  t.strictEqual(shows[1].venue.name, 'Cheer Up Charlies', 'venue name shared');

  t.deepEqual(shows[0].artists[0], {artist: {name: 'Lust For Youth'}, info: '5:15pm' });
  t.deepEqual(shows[0].artists[2], {artist: {name: 'Guerilla Toos'}, info: '3:45pm' });
  t.deepEqual(shows[1].artists[0], {artist: {name: 'White Lung'}, info: '5pm' });

  const shared = 'free, <a href="https://www.ticketfly.com/purchase/event/1093663">RSVP</a>';
  t.strictEqual(shows[0].info, `inside stage, ${shared}`, 'sep +combined infos');
  t.strictEqual(shows[1].info, `outside stage, ${shared}`, 'sep +combined infos');

  t.end();
});

test('alternative venue listing format', t => {
  const html = `<h4><input type="checkbox" name="satday" value="satday3"> Waterloo Records presents</h4><ul style="margin-top: 0;margin-bottom: 0;">
<li><h4>Bombino (6pm), Soul Asylum (5pm), Grizfolk (4pm), Kaleo (3pm), Marlon Williams (2pm), New Madrid (1pm), Lissie (noon) at <a href="http://www.waterloorecords.com"><b>Waterloo Records</b></a> <span title="600 N. Lamar">[<font color="darkred">a</font>]</span> [<a href="http://maps.google.com/maps?q=600+N+Lamar+Blvd,+Austin,+TX+78703" title="map"><font color="darkorange">m</font></a>] <font color="#666666">[free, all ages]</font></h4></li>
</ul>`;

  const shows = [];
  multiShowParser(html, shows);

  t.strictEqual(shows.length, 1, 'found all shows');
  t.strictEqual(shows[0].name, 'Waterloo Records presents', 'show name');
  t.strictEqual(shows[0].venue.name, 'Waterloo Records', 'venue name');
  t.strictEqual(shows[0].venue.address, '600 N. Lamar', 'venue address');
  t.deepEqual(shows[0].artists[0], {artist: {name: 'Bombino'}, info: '6pm' });

  t.end();
});

test('bad sxsw listing', t => {
  const html = `<h4><input type="checkbox" name="wedday" value="wedday14"> <a href="http://www.sanjosehotel.com/events/south-x-san-jose/">South By San Jose</a></h4><ul style="margin-top: 0;margin-bottom: 0;"><li><h4>Barbara Lynn, Sara Watkins, Chastity Belt, Allison Crutchfield, Jay Som, The Dove and The Wolf, Emily Gimble at the <a href="https://www.sanjosehotel.com"><b>Hotel San Jose</b></a> (1316 S. Congress Ave.) <font color="#666666">[starts at noon, free]</font></h4></li>`;

  const shows = [];
  multiShowParser(html, shows);

  t.strictEqual(shows.length, 1, 'found all shows');
  t.strictEqual(shows[0].name, 'South By San Jose', 'show name');
  t.strictEqual(shows[0].venue.name, 'Hotel San Jose', 'venue name');
  t.strictEqual(shows[0].venue.address, '1316 S. Congress Ave.', 'venue address');
  t.deepEqual(shows[0].artists[0], {artist: { name: 'Barbara Lynn' }, info: '' });

  t.end();
});
