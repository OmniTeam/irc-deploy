import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ProgramStaffService {
  baseurl = `${environment.serverUrl}/programStaff/`
  constructor(private http: HttpClient) { }

  getProgramStaffs(): Observable<any> {
    return this.http.get(this.baseurl);
  }

  getPrograms(): Observable<any> {
    return this.http.get(`${environment.serverUrl}/program/`);
  }

  createProgramStaff(formData): Observable<any> {
    return this.http.post(this.baseurl, formData);
  }

  getCurrentProgramStaff(id) {
    return this.http.get(`${this.baseurl}${id}/`);
  }

  updateProgramStaff(id, formData): Observable<any> {
    return this.http.put(`${this.baseurl}${id}/`, formData);
  }

  deleteProgramStaff(id): Observable<any> {
    return this.http.delete(`${this.baseurl}${id}/`);
  }
}
