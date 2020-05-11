/**
 *
 * Created By Arokoyu Olalekan Ojo <olalekan.arokoyu@upperlink.ng> @ 30/05/2018
 *
 */
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs-compat/Observable';
import {isNullOrUndefined} from 'util';
import {HttpClient, HttpHeaders, HttpResponse, HttpParams} from '@angular/common/http';
import { environment as env } from '../../../environments/environment';

@Injectable()
export class RestfulHttpService {
  token: string;
  options: any;
  headers_: any = {};
  constructor(private http: HttpClient) {
    this.token  = env.TOKEN;
  }

  /**
   *
   */
  createAuthorizationHeader() {
    // console.log('Token Auth ', sessionStorage.getItem(this.token), 'token 2 ', this.token);
    if (!isNullOrUndefined(sessionStorage.getItem(this.token))) {
      this.headers_ = new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': sessionStorage.getItem(this.token)
      });
    } else {
      this.headers_ = new HttpHeaders({
        'Content-Type':  'application/json'
      });
    }
  }

  /**
   * A Restful Http get request.
   * @param {string} endpoint
   * @param {HttpParams} parameters
   * @returns {Observable<HttpResponse>}
   */
  public get(endpoint: string, parameters?: HttpParams): Observable<any> {
    // console.info('HEADER::', this.headers_);
    this.createAuthorizationHeader();

    if (parameters) {
      this.options = { params: parameters, headers: this.headers_ };
    } else {
      this.options = { headers: this.headers_ };
    }
    return this.http.get(endpoint, this.options);
  }


  /**
   * A Restful Http post request.
   * @param {string} endpoint
   * @param data
   * @returns {Observable<HttpResponse>}
   */
  public post(endpoint: string, data: any): Observable<any> {
    this.createAuthorizationHeader();
    return this.http.post(endpoint, data, {  headers: this.headers_ });
  }


  /**
   * A Restful Http delete Request.
   * @param {string} endpoint
   * @param data
   * @returns {Observable<HttpResponse>}
   */
  public delete(endpoint: string , data: any): Observable<any> {
    this.createAuthorizationHeader();
    const params = new HttpParams(data);
    return this.http.delete(endpoint, {headers: this.headers_, params: params});

  }


  /**
   * A Restful Http put request.
   * @param {string} endpoint
   * @param data
   * @returns {Observable<HttpResponse>}
   */
  public put(endpoint: string, data: any): Observable<any> {
    this.createAuthorizationHeader();
    return this.http.put(endpoint, data, {  headers: this.headers_ });
  }


  /**
   * A Restful Http patch request
   * @param {string} endpoint
   * @param data
   * @returns {Observable<HttpResponse>}
   */
  public patch(endpoint: string, data: any): Observable<any> {
    this.createAuthorizationHeader();
    return this.http.patch(endpoint, data, {  headers: this.headers_ });
  }
}
