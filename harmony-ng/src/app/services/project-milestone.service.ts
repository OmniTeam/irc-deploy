import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ProjectMilestoneService {
  baseurl = `${environment.serverUrl}/projectMilestone`
  constructor(private http: HttpClient) { }

  getMilestones(): Observable<any> {
    return this.http.get(this.baseurl);
  }

  getPrograms(): Observable<any> {
    return this.http.get(`${environment.serverUrl}/program/`);
  }

  getProgramCategories(params): Observable<any> {
    return this.http.get(`${environment.serverUrl}/programCategory/getCategoriesByProgram`, {params});
  }

  getMilestonesByProgram(params): Observable<any> {
    return this.http.get(`${this.baseurl}/getMilestonesByProgram`, {params});
  }

  createMilestone(formData): Observable<any> {
    return this.http.post(this.baseurl, formData);
  }

  getCurrentMilestone(id) {
    return this.http.get(`${this.baseurl}/${id}/`);
  }

  getMilestoneDataForReports(params): Observable<any> {
    return this.http.get(`${this.baseurl}/getMilestoneDataForReports`, {params});
  }

  updateMilestone(id, formData): Observable<any> {
    return this.http.put(`${this.baseurl}/${id}/`, formData);
  }

  deleteMilestone(id): Observable<any> {
    return this.http.delete(`${this.baseurl}/${id}/`);
  }

  runQuery(params) {
    return this.http.get(`${this.baseurl}/runQuery`, {params});
  }
}
