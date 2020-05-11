import {Injectable} from '@angular/core';
import * as CryptoJS from 'crypto-js';
import {isNullOrUndefined} from 'util';
import {CacheService} from '../cacheService/cache.service';
import { environment as env } from '../../../environments/environment';

@Injectable()
export class EncryptDataService {
key: string;
  constructor(
    private cacheService: CacheService,
  ) {
    this.key = env.PRIVATE_KEY;
  }

  /**
   *
   * @param data
   * @param key
   * @param type
   */
  encryptObject(data: any, key: string, type = 'setStorage') {
    // Encrypt the Password
    const object = JSON.stringify(data);
    const encrypted = CryptoJS.AES.encrypt(object, this.key);
    // Save the Login in to an array
    this.cacheService[type](key, encrypted);
    return true;
  }

  /**
   *
   * @param data
   * @param key
   * @param type
   */
  encryptByKeyString(data: any, key, type = 'setStorage') {
    this.key = env.PRIVATE_KEY;
    const encrypted = CryptoJS.AES.encrypt(data, this.key);
    this.cacheService[type](key, encrypted);
    return true;
  }

}
