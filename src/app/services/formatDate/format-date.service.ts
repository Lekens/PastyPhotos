import {Injectable} from '@angular/core';
import {isNullOrUndefined} from 'util';

@Injectable()
export class FormatDateService {
zeroDay: string;
zeroMonth: string;
values: any;
i: number;
str: any;
  interval: any;
  constructor() { }

  /**
   *
   * @param dateString
   * @returns {string}
   */
  dateConverter(dateString) {
    if (isNullOrUndefined(dateString) || dateString ===  '') {
      return;
    }
    const unformatedDate = new Date(dateString);
    if (unformatedDate.getDate() < 10 ) {
      this.zeroDay = '0';
    } else {
      this.zeroDay = '';
    }
    if ( unformatedDate.getMonth() < 9 ) {
      this.zeroMonth = '0';
    } else {
      this.zeroMonth = '';
    }
    return   this.zeroDay + unformatedDate.getDate() + '/' + this.zeroMonth + (unformatedDate.getMonth() + 1) + '/'
      + unformatedDate.getFullYear();
    /*+ ' - '
      + unformatedDate.getHours() + ' : ' + unformatedDate.getMinutes() + ' : ' + unformatedDate.getSeconds()*/
  }

  /**
   * Convert number to years, month, days
   * @param diff
   * @returns {any}
   * @constructor
   */
  NumberToYear (diff) {
    // The string we're working with to create the representation
    this.str = '';
    // Map lengths of `diff` to different time periods
    this.values = [[' year', 365], [' month', 30], [' day', 1]];

    // Iterate over the values...
    for (this.i = 0; this.i < this.values.length; this.i++) {
      const amount = Math.floor(diff / this.values[this.i][1]);

      // ... and find the largest time value that fits into the diff
      if (amount >= 1) {
        // If we match, add to the string ('s' is for pluralization)
        this.str += amount + this.values[this.i][0] + (amount > 1 ? 's' : '') + ' ';

        // and subtract from the diff
        diff -= amount * this.values[this.i][1];
      }
    }

    return this.str;
  }

  /**
   *
   * @param date
   * @returns {string}
   */
  timeSince(date) {
    const currentDate: any = new Date();
    const seconds = Math.floor((currentDate - date) / 1000);

    this.interval = Math.floor(seconds / 31536000);

    if (this.interval > 1) {
      return this.interval + 'years';
    }
    this.interval = Math.floor(seconds / 2592000);
    if (this.interval > 1) {
      return this.interval + ' months';
    }
    this.interval = Math.floor(seconds / 86400);
    if (this.interval > 1) {
      return this.interval + ' days';
    }
    this.interval = Math.floor(seconds / 3600);
    if (this.interval > 1) {
      return this.interval + ' hours';
    }
    this.interval = Math.floor(seconds / 60);
    if (this.interval > 1) {
      return this.interval + ' minutes';
    }
    return Math.floor(seconds) + ' seconds';
  }
}
