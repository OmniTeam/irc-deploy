import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class RequestMapsService {
  baseurl = `${environment.serverUrl}/requestMap`
  constructor(private http: HttpClient) { }

  getRequestMaps(): Observable<any> {
    return this.http.get(this.baseurl);
  }

  getHttpMethods(): Observable<any> {
    return this.http.get(`${this.baseurl}/getHttpMethods`);
  }

  createRequestMaps(formData): Observable<any> {
    return this.http.post(this.baseurl, formData);
  }

  getCurrentRequestMap(id) {
    return this.http.get(`${this.baseurl}/${id}/`);
  }

  updateRequestMaps(id, formData): Observable<any> {
    return this.http.put(`${this.baseurl}/${id}/`, formData);
  }

  deleteRequestMaps(id): Observable<any> {
    return this.http.delete(`${this.baseurl}/${id}/`);
  }
}
