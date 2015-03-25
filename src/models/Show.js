import moment from 'moment';
import Venue from './Venue.js';

/**
 * A single show
 */
export default class Show
{
  constructor()
  {
    this.name = null;
    this.url = null;
    this.date = null;
    this.artists = [];
    this.info = null;
    this.venue = new Venue();
  }
}

