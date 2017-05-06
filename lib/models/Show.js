module.exports = class Show
{
  constructor()
  {
    this.name = null;
    this.url = null;
    this.date = null;
    this.artists = [];
    this.info = null;
    this.venue = null;
    this.links = [];

    // from the parser
    this._sourceHtml = '';
  }

};

