import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class FormService {

  constructor(private http: HttpClient) { }

  getForms(): Observable<any> {
    return this.http.get(`${environment.serverUrl}/form`);
  }

  getFormData(params: any): Observable<any> {
    return this.http.get(`${environment.serverUrl}/form/data`, { params });
  }
}
