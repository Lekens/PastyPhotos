import {Injectable} from '@angular/core';
import {Observable, throwError} from 'rxjs';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs-compat/observable/throw';
import 'rxjs/add/operator/retryWhen';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/take';
import {RestfulHttpService} from '../httpService/service.service';
import {HttpClient, HttpParams} from '@angular/common/http';
// import * as jwt_decode from 'jwt-decode';

import { environment as env } from '../../../environments/environment';
import {isNullOrUndefined} from 'util';
import {EncryptDataService} from '../encryption/encrypt-data.service';
import {Router} from '@angular/router';
import {NotificationService} from '../notificationServices/notification.service';
import {BootstrapNotifyService} from '../bootstrap-notify/bootstrap-notify.service';
/**
 *
 * Service to handle all api calls to api backend
 */
@Injectable()
export class ApiService extends RestfulHttpService {
  constructor(http: HttpClient,
              private encryptionService: EncryptDataService,
              private router: Router,
              private alertService: BootstrapNotifyService,
              private notification: NotificationService) {
    super(http);
  }


  /**
   *
   * @param error
   * @returns {Observable<never>}
   */
  errorHandler(error) {
    try {
      // console.info('Error ', error.error, error.error.msg, error.error.code === 401, error.error.msg.includes('Token timeout'));
      if (error.error.code === 401 &&
        (error.error.msg.includes('Token timeout')
          || error.error.msg.includes('Access denied')
          || error.error.msg.includes('Unauthenticated') )) {
        sessionStorage.clear();
        (<any>$('.modal')).modal('hide');
        console.info('Error Clear ', error.error);
        localStorage.clear();
        this.router.navigate(['/']);
        this.alertService.error(error.error.msg);
        return throwError(error.error || {msg: 'Unknown error occurred'});
      }
      return throwError(error || {msg: 'Unknown error occurred'});
    } catch (error) {
      console.info('Type error occurred');
      return throwError(error || {msg: 'Unknown error occurred'});
    }
  }


  /**
   *
   * @param res
   * @param {string} auth
   * @returns {any}
   */
  public decode(res, auth?: string) {
    const data = res.data;
    // console.info('Real Response: ', res);
    if (res && !isNullOrUndefined(res.data)) {
      if (auth && auth.match('login')) {
        sessionStorage.setItem(env.TOKEN, data.token);
        sessionStorage.setItem(env.USERTOKEN, JSON.stringify(data.user));
      }
      return res;
    } else {
      return res;
    }
  }


  /**
   *
   * @param {string} api
   * @param {string} method
   * @param data
   * @returns {Observable<any>}
   */
  deleteRequest(api: string, method: string, data?: any): Observable<any> {
    let ENDPOINT;
    if (!isNullOrUndefined(method)) {
      ENDPOINT = env.API_URL + '/' + env.API_VERSION + '/' + api + '/' + method;
    } else {
      ENDPOINT = env.API_URL + '/' + env.API_VERSION + '/' + api;
    }
    return super.delete(ENDPOINT, data).retryWhen(error => {
      return error.mergeMap((err) => this.errorHandler(err))
        .delay(1000)
        .take(2);
    }).catch(this.errorHandler).map(res => {
      return res;
    });
  }


  /**
   *
   * @param {string} api
   * @param {string} method
   * @param data
   * @returns {Observable<any>}
   */
  putRequest(api: string, method: string, data: any): Observable<any> {
    let ENDPOINT;
    if (!isNullOrUndefined(method)) {
      ENDPOINT = env.API_URL + '/' + env.API_VERSION + '/' + api + '/' + method;
    } else {
      ENDPOINT = env.API_URL + '/' + env.API_VERSION + '/' + api;
    }
    return super.put(ENDPOINT, data).retryWhen(error => {
      return error.mergeMap((err) => this.errorHandler(err))
        .delay(1000)
        .take(2);
    }).catch(this.errorHandler).map(res => {
      return res;
    });

  }


  /**
   *
   * @param {string} api
   * @param {string} method
   * @param data
   * @returns {Observable<any>}
   */
  patchRequest(api: string, method: string, data: any): Observable<any> {
    let ENDPOINT;
    if (!isNullOrUndefined(method)) {
      ENDPOINT = env.API_URL + '/' + env.API_VERSION + '/' + api + '/' + method;
    } else {
      ENDPOINT = env.API_URL + '/' + env.API_VERSION + '/' + api;
    }
    return super.patch(ENDPOINT, data).retryWhen(error => {
      return error.mergeMap((err) => this.errorHandler(err))
        .delay(1000)
        .take(2);
    }).catch(this.errorHandler).map(res => {
      return res;
    });
  }


  /**
   *
   * @param {string} api
   * @param {string} method
   * @param {HttpParams} params
   * @returns {Observable<any>}
   */
  getRequest(api: string, method: string, params?: HttpParams): Observable<any> {
    let ENDPOINT;
    // console.info(api);
    if (!isNullOrUndefined(method)) {
      ENDPOINT = env.API_URL + '/' + env.API_VERSION + '/' + api + '/' + method;
    } else {
      ENDPOINT = env.API_URL + '/' + env.API_VERSION + '/' + api;
    }
    // console.info(ENDPOINT);
    return super.get(ENDPOINT, params).retryWhen(error => {
      return error.mergeMap(err => this.errorHandler(err))
        .delay(1000)
        .take(2);
    }).catch(this.errorHandler).map(res => {
      return res;
    });
  }


  /**
   *
   * @param {string} api
   * @param {string} method
   * @param data
   * @returns {Observable<any>}
   */
  postRequest(api: string, method: string, data: any): Observable<any> {
    let ENDPOINT;
    if (!isNullOrUndefined(method)) {
      ENDPOINT = env.API_URL + '/' + env.API_VERSION + '/' + api + '/' + method;
    } else {
      ENDPOINT = env.API_URL + '/' + env.API_VERSION + '/' + api;
    }
    return super.post(ENDPOINT, data).retryWhen(error => {
      return error.mergeMap((err) => this.errorHandler(err))
        .delay(1000)
        .take(2);
    }).catch(this.errorHandler).map(res => this.decode(res, method));

  }
}
