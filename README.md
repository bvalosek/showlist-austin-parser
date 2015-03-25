# Austin Showlist Scraper

Scrape [austinshowlist.com](http://austinshowlist.com/) for upcoming shows in
Austin, TX.

## Installation

```
$ npm install --save austin-showlist-scraper
```

## Usage

The method `AustinShowlistScraper#upcoming()` returns a `Promise<Iterable<Show>>`:

```javascript
import AustinShowlistScraper from 'austin-showlist-scraper';

async function go()
{
  let scraper = new AustinShowlistScraper();
  let shows = await scraper.upcoming();

  for (let show of shows) {
    console.log(show);
  }
}

go();
```

The `Show` model can be found at [src/models/Show.js](src/models/Show.js).

Example of a `Show` model (eg, `JSON.stringify(show)`):

```
{
  name: "Goodbye Blue Monday",
  url: null,
  date: "2015-03-24T02:00:00.000Z",
  artists: [
    {
      artist: { name: "White Kyle" },
      info: ""
    }
  ],
  info: "9pm",
  venue: {
    name: "Hotel Vegas",
    address: "1500 E. 6th St.",
    url: "http://www.hotelvegasaustin.com/"
  }
}
```

## Testing

```
$ npm test
```

## License

MIT
