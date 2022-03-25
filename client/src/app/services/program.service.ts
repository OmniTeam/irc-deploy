import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ProgramService {

  baseurl = `${environment.serverUrl}/program`
  constructor(private http: HttpClient) { }

  getPrograms(): Observable<any> {
    return this.http.get(this.baseurl);
  }

  createProgram(formData): Observable<any> {
    return this.http.post(this.baseurl, formData);
  }

  getCurrentProgram(id) {
    return this.http.get(`${this.baseurl}${id}/`);
  }

  updateProgram(id, formData): Observable<any> {
    return this.http.put(`${this.baseurl}${id}/`, formData);
  }

  deleteProgram(id): Observable<any> {
    return this.http.delete(`${this.baseurl}${id}/`);
  }
}
