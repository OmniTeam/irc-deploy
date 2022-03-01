import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ReferralsService {
  baseurl = environment.serverUrl
  urlReferral = `${this.baseurl}/referral/`

  constructor(private http: HttpClient) { }

  getReferrals(): Observable<any> {
    return this.http.get(this.urlReferral);
  }
  getReferralsFiltered(params): Observable<any> {
    return this.http.get(this.urlReferral, {params});
  }

  createReferral(formData): Observable<any> {
    return this.http.post(this.urlReferral, formData);
  }

  updateReferral(id, groupData): Observable<any> {
    return this.http.put(`${this.urlReferral}${id}/`, groupData);
  }

  getCurrentReferral(id){
    return this.http.get(`${this.urlReferral}${id}`)
  }

  deleteCurrentReferral(p): Observable<any> {
    return this.http.delete(`${this.urlReferral}${p}/`);
  }
}
