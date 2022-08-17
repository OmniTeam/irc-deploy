import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor(private http: HttpClient) { }

  getCentralProjects(): Observable<any> {
    return this.http.get(`${environment.serverUrl}/study/central_projects`);
  }

  getMisProjects(): Observable<any> {
    return this.http.get(`${environment.serverUrl}/study`);
  }
}
