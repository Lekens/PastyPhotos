import { Injectable } from '@angular/core';
import * as Rx from 'rxjs-compat/Rx';

@Injectable()
export class EventsService {

    listeners: any;
    eventsSubject: any;
    events;

    constructor() {
        this.listeners = {};
        this.eventsSubject = new Rx.Subject();


        this.events = Rx.Observable.from(this.eventsSubject);

        this.events.subscribe(
            ({ name, args }) => {
                if (this.listeners[name]) {
                    for (const listener of this.listeners[name]) {
                        listener(...args);
                    }
                }
            });
    }

  /**
   *
   * @param name
   * @param listener
   */
  on(name, listener) {
        if (!this.listeners[name]) {
            this.listeners[name] = [];
            this.listeners[name].push(listener);
        }
        if (this.listeners[name]) {
            this.listeners[name][0] = listener;
        }
    }

  /**
   *
   * @param name
   * @param args
   */
  broadcast(name, ...args) {
        // console.log('name=', name);
        this.eventsSubject.next({
            name,
            args
        });
    }
}
