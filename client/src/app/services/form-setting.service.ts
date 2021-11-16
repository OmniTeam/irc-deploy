import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class FormSettingService {

  constructor(private http: HttpClient) { }

  getFormSettings(params: any): Observable<any> {
    return this.http.get(`${environment.serverUrl}/formSetting`, { params });
  }

  updateFormSettings(id, formData): Observable<any> {
    return this.http.put(`${environment.serverUrl}/formSetting/${id}`, formData);
  }
}
