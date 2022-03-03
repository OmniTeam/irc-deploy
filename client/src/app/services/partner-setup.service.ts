import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class PartnerSetupService {

  constructor(private http: HttpClient) { }

  getPartnerSetup(): Observable<any> {
    return this.http.get(`${environment.serverUrl}/partnerSetup`);
  }

  createPartnerSetup(formData): Observable<any> {
    return this.http.post(`${environment.serverUrl}/partnerSetup`, formData);
  }
}
