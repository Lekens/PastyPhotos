import { Injectable } from '@angular/core';
import {isNullOrUndefined} from 'util';
import {CacheService} from '../cacheService/cache.service';
import * as CryptoJS from 'crypto-js';
import { environment as env } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DecryptService {
  key: string;

  constructor(private cacheService: CacheService) {
    this.key = env.PRIVATE_KEY;
  }

  /**
   *
   * @param {string} key
   * @param {string} type
   * @returns {any}
   */
  decryptString(key: string, type = 'getStorage') {
    if (!isNullOrUndefined(this.cacheService[type](key))) {
      const code = this.cacheService[type](key);
      const userEncryption = code.toString();
      const decrypted = CryptoJS.AES.decrypt( userEncryption , this.key);
      return decrypted.toString(CryptoJS.enc.Utf8);

    } else { return false; }

  }
  decryptObject(key: string, type = 'getStorage') {
    const code = this.cacheService[type](key);
    console.log('CODE::', code);
    if (code && code !== 'U2FsdGVkX180wspjnFiHGB28kBkl2Kzg6HwGdKa0oSc=') {
      const userEncryption = code.toString();
      const decrypted = CryptoJS.AES.decrypt(userEncryption , this.key);
      // console.info('DECRYPTED::', decrypted);
      return JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
    } else {
      return false;
    }
  }
}
