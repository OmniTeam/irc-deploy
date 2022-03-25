import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ProgramCategoryService {

  baseurl = `${environment.serverUrl}/programCategory`
  constructor(private http: HttpClient) { }

  getProgramCategories(): Observable<any> {
    return this.http.get(this.baseurl);
  }

  getPrograms(): Observable<any> {
    return this.http.get(`${environment.serverUrl}/program/`);
  }

  createProgramCategory(formData): Observable<any> {
    return this.http.post(this.baseurl, formData);
  }

  getCurrentProgramCategory(id) {
    return this.http.get(`${this.baseurl}${id}/`);
  }

  updateProgramCategory(id, formData): Observable<any> {
    return this.http.put(`${this.baseurl}${id}/`, formData);
  }

  deleteProgramCategory(id): Observable<any> {
    return this.http.delete(`${this.baseurl}${id}/`);
  }
}
