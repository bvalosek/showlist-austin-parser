/*

 Ensure there is only 1 artist (by name) per show

*/
module.exports = function limitArtists(partial, shows)
{
  for (let show of shows) {
    const names = new Set();
    show.artists = show.artists.filter(a => {
      const { artist } = a;

      if (names.has(artist.name)) {
        return false;
      }

      names.add(artist.name);
      return true;
    });
  }
};
