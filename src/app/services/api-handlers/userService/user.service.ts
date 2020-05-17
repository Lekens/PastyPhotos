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

  constructor(private api: ApiService) {

  }


  auth(data): Observable<IResponse> {
    return this.api.postRequest('auth', 'login' , data).map((res: IResponse)  => {
      return res ;
    });
  }
  public checkout(checkout): Observable<IResponse> {
    return this.api.postRequest('pasty-photos-order', 'checkout', checkout).map( (res: IResponse) => {
      return res;
    });
  }
  public verifyPayment(order): Observable<IResponse> {
    return this.api.postRequest('pasty-photos-order', 'verify-payment', order).map( (res: IResponse) => {
      return res;
    });
  }
  public logOut(): Observable<IResponse> {
    return this.api.postRequest('auth', 'logout', {}).map((res: IResponse)  => {
      return res ;
    });
  }

  public getOrders(): Observable<IResponse> {
    return this.api.getRequest('cart', null).map( (res: IResponse) => {
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
