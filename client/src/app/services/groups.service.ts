import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class GroupsService {
  baseurl = environment.serverUrl
  urlGroups = `${this.baseurl}/group/`

  constructor(private http: HttpClient) { }

  getGroups(): Observable<any> {
    return this.http.get(this.urlGroups);
  }
  getGroupsFiltered(params): Observable<any> {
    return this.http.get(this.urlGroups, {params});
  }

  createGroup(formData): Observable<any> {
    return this.http.post(this.urlGroups, formData);
  }

  updateGroup(id, submitData): Observable<any> {
    return this.http.put(`${this.urlGroups}${id}/`, submitData);
  }

  deleteCurrentGroup(p): Observable<any> {
    return this.http.delete(`${this.urlGroups}${p}/`);
  }
}
