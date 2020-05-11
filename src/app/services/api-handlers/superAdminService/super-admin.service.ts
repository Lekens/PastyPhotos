import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {IResponse} from '../../../interfaces/iresponse';
import {ApiService} from '../../api/api.service.';

@Injectable()
export class SuperAdminService {

  constructor(private api: ApiService) { }
  public getFarmStatus(): Observable<IResponse> {
    return this.api.getRequest('farm-status', null).map( (res: IResponse) => {
      return res;
    });
  }
  public getActiveFarmStatus(): Observable<IResponse> {
    return this.api.getRequest('farm-status', 'active-farm-status').map( (res: IResponse) => {
      return res;
    });
  }
  public createStatus(data): Observable<IResponse> {
    return this.api.postRequest('farm-status', null, data).map( (res: IResponse) => {
      return res;
    });
  }
  public updateStatus(data, id): Observable<IResponse> {
    return this.api.putRequest('farm-status', id, data).map( (res: IResponse) => {
      return res;
    });
  }
  public deleteStatus(id): Observable<IResponse> {
    return this.api.deleteRequest('farm-status', id).map( (res: IResponse) => {
      return res;
    });
  }
  public getFarmType(): Observable<IResponse> {
    return this.api.getRequest('farm-type', null).map( (res: IResponse) => {
      return res;
    });
  }
  public getActiveFarmTypes(): Observable<IResponse> {
    return this.api.getRequest('farm-type', 'active-farm-types').map( (res: IResponse) => {
      return res;
    });
  }
  public createType(data): Observable<IResponse> {
    return this.api.postRequest('farm-type', null, data).map( (res: IResponse) => {
      return res;
    });
  }
  public updateType(data, id): Observable<IResponse> {
    return this.api.putRequest('farm-type', id, data).map( (res: IResponse) => {
      return res;
    });
  }
  public deleteType(id): Observable<IResponse> {
    return this.api.deleteRequest('farm-type', id).map( (res: IResponse) => {
      return res;
    });
  }
  public getFarmShops(): Observable<IResponse> {
    return this.api.getRequest('farm-shop', null).map( (res: IResponse) => {
      return res;
    });
  }
  public createShop(data): Observable<IResponse> {
    return this.api.postRequest('farm-shop', null, data).map( (res: IResponse) => {
      return res;
    });
  }
  public updateShop(data, id): Observable<IResponse> {
    return this.api.putRequest('farm-shop', id, data).map( (res: IResponse) => {
      return res;
    });
  }
  public deleteShop(id): Observable<IResponse> {
    return this.api.deleteRequest('farm-shop', id).map( (res: IResponse) => {
      return res;
    });
  }
}
