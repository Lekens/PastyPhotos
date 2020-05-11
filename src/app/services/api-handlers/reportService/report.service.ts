import { Injectable } from '@angular/core';
import {ApiService} from '../../api/api.service.';
import {Observable} from 'rxjs';
import {IResponse} from '../../../interfaces/iresponse';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor(private api: ApiService) { }

  /**
   *  Get all report files
   */
  public getReportFile(): Observable<IResponse>  {
    return this.api.getRequest(`reports`, 'file').map((res: IResponse)  => {
      return res ;
    });
  }
  public updateReport(reportId, data): Observable<IResponse>  {
    return this.api.putRequest(`reports`, reportId, data).map((res: IResponse)  => {
      return res ;
    });
  }
  public getFileDetails(fileId): Observable<IResponse>  {
    return this.api.getRequest(`reports`, 'get-file/' + fileId).map((res: IResponse)  => {
      return res ;
    });
  }
  /**
   *  Get all report files by  merchant Id
   */
  public getReportFileByMerchantId(merchantId): Observable<IResponse>  {
    return this.api.getRequest(`reports`, 'file/' + merchantId).map((res: IResponse)  => {
      return res ;
    });
  }
  public updateAdminAboutAction(fileId, data): Observable<IResponse>  {
    return this.api.putRequest(`reports`, 'file/' + fileId, data).map((res: IResponse)  => {
      return res ;
    });
  }
  public updateMerchantAboutAction(fileId, data): Observable<IResponse>  {
    return this.api.putRequest(`reports`, 'file/' + fileId, data).map((res: IResponse)  => {
      return res ;
    });
  }
 public getFileReports(fileId): Observable<IResponse>  {
    return this.api.getRequest(`reports`, 'file/' + fileId + '/all/file').map((res: IResponse)  => {
      return res ;
    });
  }
 public getFinalReports(fileId, merchantId): Observable<IResponse>  {
    return this.api.getRequest(`final-report`, 'file/' + fileId + '/merchant/' + merchantId).map((res: IResponse)  => {
      return res ;
    });
  }
 public getFinalReportByFile(fileId): Observable<IResponse>  {
    return this.api.getRequest(`final-report`, 'get-final-file/' + fileId).map((res: IResponse)  => {
      return res ;
    });
  }
 public exportReportToCSV(fileId): Observable<IResponse>  {
    return this.api.getRequest(`reports`, 'file/' + fileId).map((res: IResponse)  => {
      return res ;
    });
  }
 public filterReports(filter, fileId): Observable<IResponse>  {
    return this.api.postRequest(`reports`, 'filter-reports/file/' + fileId, filter).map((res: IResponse)  => {
      return res ;
    });
  }
 public downloadWithoutBVN(fileId): Observable<IResponse>  {
    return this.api.getRequest(`reports`, 'file/' + fileId + '/without-bvn/list').map((res: IResponse)  => {
      return res ;
    });
  }
 public setReportToValidated(fileId, data): Observable<IResponse>  {
    return this.api.putRequest(`reports`, 'file-report/' + fileId, data).map((res: IResponse)  => {
      return res ;
    });
  }
 public getDashboard(merchantId): Observable<IResponse>  {
    return this.api.getRequest(`reports`, 'dashboard/information/' + merchantId).map((res: IResponse)  => {
      return res ;
    });
  }
 public getDashboardSummary(merchantId): Observable<IResponse>  {
    return this.api.getRequest(`reports`, 'dashboard/summary/' + merchantId).map((res: IResponse)  => {
      return res ;
    });
  }
 public getDashboardLocation(merchantId): Observable<IResponse>  {
    return this.api.getRequest(`reports`, 'dashboard/information/location/' + merchantId).map((res: IResponse)  => {
      return res ;
    });
  }

}
