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

## Testing

```
$ npm test
```

## License

MIT
