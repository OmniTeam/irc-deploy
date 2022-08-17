import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class GroupsService {
  baseurl = environment.serverUrl
  urlGroups = `${this.baseurl}/KengaGroup/`
  urlKengaGroupUser = `${this.baseurl}/KengaUserGroup/`
  urldeleteOldKengaUserGroups=`${this.baseurl}/deleteOldKengaUserGroups/`

  constructor(private http: HttpClient) { }

  getGroups(): Observable<any> {
    return this.http.get(this.urlGroups);
  }
  getGroupsFiltered(params): Observable<any> {
    return this.http.get(this.urlGroups, {params});
  }

  createGroup(formData): Observable<any> {
    const httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json'})};
    return this.http.post(this.urlGroups, formData, httpOptions);
  }
  getCurrentGroup(id) {
    return this.http.get(`${this.urlGroups}${id}/`);
  }
  deleteOldKengauserGroups(params) {
    return this.http.delete(this.urldeleteOldKengaUserGroups, {params});
  }

  updateGroup(id, submitData, params): Observable<any> {
    return this.http.put(`${this.urlGroups}${id}/`, submitData, {params});
  }

  deleteCurrentGroup(p): Observable<any> {
    return this.http.delete(`${this.urlGroups}${p}/`);
  }
//  create kenga user group
  createKengaUserGroup(KengaUserGroupData): Observable<any> {
    return this.http.post(this.urlKengaGroupUser, KengaUserGroupData);
  }
}
