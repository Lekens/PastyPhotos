/**
 * Created by Arokoyu Olalekan Ojo
 */

import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {IResponse} from '../../../interfaces/iresponse';
import {ApiService} from '../../api/api.service.';
import {DecryptService} from '../../decryptService/decrypt.service';
@Injectable()
export class UserService {

  constructor(private api: ApiService,
              private decryptionService: DecryptService) {

  }


  auth(data): Observable<IResponse> {
    return this.api.postRequest('auth', 'login' , data).map((res: IResponse)  => {
      return res ;
    });
  }

  register(data): Observable<IResponse> {
    return this.api.postRequest('auth', 'register' , data).map((res: IResponse)  => {
      return res ;
    });
  }

  public getDashboard(): Observable<IResponse> {
    return this.api.getRequest('dashboard', null).map( (res: IResponse) => {
      return res;
    });
  }
  public getActiveShop(): Observable<IResponse> {
    return this.api.getRequest('farm-shop', null).map( (res: IResponse) => {
      return res;
    });
  }
  public getShop(id): Observable<IResponse> {
    return this.api.getRequest('farm-shop', id).map( (res: IResponse) => {
      return res;
    });
  }
  public filterFarmShop(filter): Observable<IResponse> {
    return this.api.postRequest('farm-shop', 'filter-farm-shop', filter).map( (res: IResponse) => {
      return res;
    });
  }
  public searchFarmShop(search): Observable<IResponse> {
    return this.api.postRequest('farm-shop', 'search-farm-shop', search).map( (res: IResponse) => {
      return res;
    });
  }
  public getActiveType(): Observable<IResponse> {
    return this.api.getRequest('farm-type', 'active-farm-types').map( (res: IResponse) => {
      return res;
    });
  }
  public getActiveStatus(): Observable<IResponse> {
    return this.api.getRequest('farm-status', 'active-farm-status').map( (res: IResponse) => {
      return res;
    });
  }
  public logOut(): Observable<IResponse> {
    return this.api.postRequest('auth', 'logout', {}).map((res: IResponse)  => {
      return res ;
    });
  }

  public resetPassword(data): Observable<IResponse> {
    return this.api.postRequest('auth', 'forgot-password', data).map( (res: IResponse) => {
      return res;
    });
  }
  public verifyAccount(data): Observable<IResponse> {
    return this.api.postRequest('auth', 'verify-signup', data).map( (res: IResponse) => {
      return res;
    });
  }
  public forgotPassword(data): Observable<IResponse> {
    return this.api.postRequest('auth', 'reset-password', data).map( (res: IResponse) => {
      return res;
    });
  }
  public updateUser(data): Observable<IResponse> {
    return this.api.putRequest('user', data.id, data).map( (res: IResponse) => {
      return res;
    });
  }
  public addNewSubscriber(data): Observable<IResponse> {
    return this.api.postRequest('newsletter', null, data).map( (res: IResponse) => {
      return res;
    });
  }
  public getCarts(userId): Observable<IResponse> {
    return this.api.getRequest('cart', 'user-cart/' + userId).map( (res: IResponse) => {
      return res;
    });
  }
  public countCart(userId): Observable<IResponse> {
    return this.api.getRequest('cart', 'user-count/' + userId).map( (res: IResponse) => {
      return res;
    });
  }
  public getCart(cartId): Observable<IResponse> {
    return this.api.getRequest('cart', cartId).map( (res: IResponse) => {
      return res;
    });
  }
  public addShopToCart(data): Observable<IResponse> {
    return this.api.postRequest('cart', null, data).map( (res: IResponse) => {
      return res;
    });
  }
  public updateCart(cartId, data): Observable<IResponse> {
    return this.api.putRequest('cart', cartId, data).map( (res: IResponse) => {
      return res;
    });
  }
  public deleteCart(cartId): Observable<IResponse> {
    return this.api.deleteRequest('cart', cartId).map( (res: IResponse) => {
      return res;
    });
  }
 }
