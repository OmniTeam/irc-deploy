import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class TaskListService {

  constructor(private http: HttpClient) { }

  getTaskList(): Observable<any> {
    return this.http.get(`${environment.serverUrl}/taskList`);
  }

  getTaskRecord(params: any): Observable<any> {
    return this.http.get(`${environment.serverUrl}/taskList/getTaskRecord`, {params});
  }

  updateTask(formData, id): Observable<any> {
    return this.http.put(`${environment.serverUrl}/taskList/${id}`, formData);
  }

  getArchivedRecords(): Observable<any> {
    return this.http.get(`${environment.serverUrl}/archive`);
  }

  getArchivedRecord(params: any): Observable<any> {
    return this.http.get(`${environment.serverUrl}/archive/getTaskRecord`, {params});
  }

}
