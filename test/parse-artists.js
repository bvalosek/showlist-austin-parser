import test from 'tape';
import parseArtists from '../src/parseArtists.js';

const ma = (n = '', i = '') => ({
  artist: { name: n },
  info: i
});

test('1 artist no info', t => {
  t.plan(1);
  let s = 'Artist Name';
  t.deepEqual([ma('Artist Name')], [...parseArtists(s)]);
});

test('1 artist, info', t => {
  t.plan(1);
  let s = 'Artist Name (info)';
  t.deepEqual([ma('Artist Name', 'info')], [...parseArtists(s)]);
});

test('1 artist, ugly info', t => {
  t.plan(1);
  let s = 'Artist Name (info, more info)';
  t.deepEqual([ma('Artist Name', 'info, more info')], [...parseArtists(s)]);
});

test('multi artists', t => {
  t.plan(1);
  let s = 'Artist 1, Artist 2';
  t.deepEqual([ma('Artist 1'), ma('Artist 2')], [...parseArtists(s)]);
});

test('multi artists with ugly info', function(t) {
  t.plan(1);
  let s = 'Artist 1, Artist 2 (some info), Artist 3 (info, more info)';
  t.deepEqual([
    ma('Artist 1'),
    ma('Artist 2', 'some info'),
    ma('Artist 3', 'info, more info')
  ], [...parseArtists(s)]);
});

test('multi artists with really ugly info', function(t) {
  t.plan(1);
  let s = 'Artist 1, Artist 2 (some info (lol)), Artist 3 (info, more info)';
  t.deepEqual([
    ma('Artist 1'),
    ma('Artist 2', 'some info (lol)'),
    ma('Artist 3', 'info, more info')
  ], [...parseArtists(s)]);
});

test('multi artists with really ugly info and featuring', function(t) {
  t.plan(1);
  let s = 'Artist 1, Artist 2 (some info (lol)), Artist 3 (info, more info), featuring Artist 4 and Artist 5';
  t.deepEqual([
    ma('Artist 1'),
    ma('Artist 2', 'some info (lol)'),
    ma('Artist 3', 'info, more info'),
    ma('Artist 4'),
    ma('Artist 5')
  ], [...parseArtists(s)]);
});



