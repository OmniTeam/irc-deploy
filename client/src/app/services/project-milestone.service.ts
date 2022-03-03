import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ProjectMilestoneService {
  baseurl = `${environment.serverUrl}/projectMilestone/`
  constructor(private http: HttpClient) { }

  getMilestones(): Observable<any> {
    return this.http.get(this.baseurl);
  }

  createMilestone(formData): Observable<any> {
    return this.http.post(this.baseurl, formData);
  }

  getCurrentMilestone(id) {
    return this.http.get(`${this.baseurl}${id}/`);
  }

  updateMilestone(id, formData): Observable<any> {
    return this.http.put(`${this.baseurl}${id}/`, formData);
  }

  deleteMilestone(id): Observable<any> {
    return this.http.delete(`${this.baseurl}${id}/`);
  }
}
