import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ProgramPartnersService {
  baseurl = `${environment.serverUrl}/programPartner`
  constructor(private http: HttpClient) { }

  getProgramPartners(): Observable<any> {
    return this.http.get(this.baseurl);
  }

  getPrograms(): Observable<any> {
    return this.http.get(`${environment.serverUrl}/program/`);
  }

  createProgramPartner(formData): Observable<any> {
    return this.http.post(this.baseurl, formData);
  }

  getCurrentProgramPartner(id) {
    return this.http.get(`${this.baseurl}/${id}/`);
  }

  updateProgramPartner(id, formData): Observable<any> {
    return this.http.put(`${this.baseurl}/${id}/`, formData);
  }

  deleteProgramPartner(id): Observable<any> {
    return this.http.delete(`${this.baseurl}/${id}/`);
  }
}
