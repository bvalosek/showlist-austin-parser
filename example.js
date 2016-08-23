
let AustinShowlistScraper = require('./dist/AustinShowlistScraper');


let scraper = new AustinShowlistScraper();

scraper.upcoming().then(shows => {

  for (let show of shows) {
    console.log(show);
  }
});
