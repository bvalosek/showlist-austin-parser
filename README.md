# Showlist Austin Parser

Parse the HTML from [showlistaustin.com](http://showlistaustin.com/) for
upcoming live-music shows in Austin, TX.

Powers the [ShowGOAT.net](https://showgoat.net) site.

> This was previously
> [austin-showlist-scraper v1](https://github.com/bvalosek/austin-showlist-scraper/tree/v1.0.1)

## Installation

```
$ npm install showlist-austin-parser
```

## Usage

The library exports a single method that will take HTML and return an ES6
`Iterable` of `Show` objects.


```javascript
const parse = require('showlist-austin-parser');
const fetch = require('node-fetch');

(async () => {

  const resp = await fetch('http://showlistaustin.com');
  const html = await resp.text();

  const shows = parse(html);

  for (const show of shows) {
    console.log(show);
  }

})();
```

## Testing

```
$ npm test
```

## License

[MIT](https://github.com/bvalosek/showlist-austin-parser/blob/master/LICENSE)

