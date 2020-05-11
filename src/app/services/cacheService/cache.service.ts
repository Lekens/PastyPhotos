import { Injectable } from '@angular/core';

@Injectable()
export class CacheService {
  private storage: any;
  private session: any;
  constructor() {
    this.storage = localStorage;
    this.session = sessionStorage;
  }


  /**
   *
    * @param key
   * @returns {T | string | SVGLength | SVGNumber | SVGPathSeg | any}
   */
  getSession(key) {
    return this.session.getItem(key);
  }

  /**
   * Set item in session
   * @param key
   * @param value
   */
  setSession(key, value) {
  this.session.setItem(key, value);
  }

  /**
   * Clear All session items
   */
  clearSession() {
  this.session.clear();
  }

  /**
   * Delete key item from session
   * @param key
   */
  deleteSession(key) {
  this.session.removeItem(key);
  }

  /**
   * Get item from storage
   * @param key
   * @returns {T | DraggableItem | string | SVGLength | SVGNumber | any}
   */
  getStorage(key) {
    return this.storage.getItem(key);
  }

  /**
   * set items on storage
   * @param key
   * @param value
   */
  setStorage(key, value) {
    this.storage.setItem(key, value);
  }

  /**
   * clear all items in storage
   */
  clearStorage() {
    this.storage.clear();
  }

  /**
   * Delete item from storage(key)
   * @param key
   */
  deleteStorage (key) {
    this.storage.removeItem(key);
  }
}
