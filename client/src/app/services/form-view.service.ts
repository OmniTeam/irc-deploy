import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class FormViewService {

  constructor(private http: HttpClient) { }

  getForms(): Observable<any> {
    return this.http.get(`${environment.serverUrl}/reportForm`);
  }

  createReport(formData): Observable<any> {
    return this.http.post(`${environment.serverUrl}/reportForm`, formData);
  }

  updateReport(formData, params): Observable<any> {
    return this.http.post(`${environment.serverUrl}/reportForm`, formData, {params});
  }
}
