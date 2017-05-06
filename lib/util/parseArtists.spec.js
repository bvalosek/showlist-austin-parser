const test = require('tape');
const parseArtists = require('./parseArtists.js');

const ma = (n = '', i = '') => ({
  artist: { name: n },
  info: i
});

test('parseArtists: 1 artist no info', t => {
  t.plan(1);
  const s = 'Artist Name';
  t.deepEqual([ma('Artist Name')], [...parseArtists(s)]);
});

test('parseArtists: 1 artist, info', t => {
  t.plan(1);
  const s = 'Artist Name (info)';
  t.deepEqual([ma('Artist Name', 'info')], [...parseArtists(s)]);
});

test('parseArtists: 1 artist, ugly info', t => {
  t.plan(1);
  const s = 'Artist Name (info, more info)';
  t.deepEqual([ma('Artist Name', 'info, more info')], [...parseArtists(s)]);
});

test('parseArtists: multi artists', t => {
  t.plan(1);
  const s = 'Artist 1, Artist 2';
  t.deepEqual([ma('Artist 1'), ma('Artist 2')], [...parseArtists(s)]);
});

test('parseArtists: multi artists with ugly info', t => {
  t.plan(1);
  const s = 'Artist 1, Artist 2 (some info), Artist 3 (info, more info)';
  t.deepEqual([
    ma('Artist 1'),
    ma('Artist 2', 'some info'),
    ma('Artist 3', 'info, more info')
  ], [...parseArtists(s)]);
});

test('parseArtists: multi artists with really ugly info', t => {
  t.plan(1);
  const s = 'Artist 1, Artist 2 (some info (lol)), Artist 3 (info, more info)';
  t.deepEqual([
    ma('Artist 1'),
    ma('Artist 2', 'some info (lol)'),
    ma('Artist 3', 'info, more info')
  ], [...parseArtists(s)]);
});

test('parseArtists: multi artists with really ugly info and featuring', t => {
  t.plan(1);
  const s = 'Artist 1, Artist 2 (some info (lol)), Artist 3 (info, more info), featuring Artist 4 and Artist 5';
  t.deepEqual([
    ma('Artist 1'),
    ma('Artist 2', 'some info (lol)'),
    ma('Artist 3', 'info, more info'),
    ma('Artist 4'),
    ma('Artist 5')
  ], [...parseArtists(s)]);
});
