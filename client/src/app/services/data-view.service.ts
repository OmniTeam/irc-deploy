import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class DataViewService {

  baseurl = `${environment.serverUrl}/dataView/`
  constructor(private http: HttpClient) { }

  getDataViews(): Observable<any> {
    return this.http.get(this.baseurl);
  }

  createDataView(formData): Observable<any> {
    return this.http.post(this.baseurl, formData);
  }

  getCurrentDataView(id) {
    return this.http.get(`${this.baseurl}${id}/`);
  }

  getDataViewData(params) {
    return this.http.get(`${this.baseurl}/getDataViewData`, {params});
  }

  dataViewRunNow(params) {
    return this.http.get(`${this.baseurl}/dataViewRunNow`, {params});
  }

  updateDataView(id, formData): Observable<any> {
    return this.http.put(`${this.baseurl}${id}/`, formData);
  }

  deleteDataView(id): Observable<any> {
    return this.http.delete(`${this.baseurl}${id}/`);
  }

  syncViewToMetabase(params) {
    return this.http.get(`${this.baseurl}/syncViewToMetabase`, {params});
  }

}
