import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class TempDataService {

  constructor(private http: HttpClient) { }

  getTempData(): Observable<any> {
    return this.http.get(`${environment.serverUrl}/temp`);
  }

  createTempData(formData): Observable<any> {
    return this.http.post(`${environment.serverUrl}/temp`, formData);
  }

  updateTempData(formData, id): Observable<any> {
    return this.http.put(`${environment.serverUrl}/temp/${id}`, formData);
  }
}
