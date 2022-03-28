import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  baseurl = environment.serverUrl
  urlUsers = `${this.baseurl}/user/`
  urlUserGroup = `${this.baseurl}/KengaUserGroup/`
  urlDeleteOldRolesAndGroups = `${this.baseurl}/deleteOldRoleAndGroups/`

  constructor(private http: HttpClient) { }

  getUsers(): Observable<any> {
    return this.http.get(this.urlUsers);
  }

  getDataCollectors(): Observable<any> {
    return this.http.get(`${this.urlUsers}/getDataCollectors`);
  }

  getUsersFiltered(params): Observable<any> {
    return this.http.get(this.urlUsers, {params});
  }

  createUser(formData): Observable<any> {
    return this.http.post(this.urlUsers, formData);
  }

  updateUser(id, groupData, params): Observable<any> {
    return this.http.put(`${this.urlUsers}${id}/`, groupData, {params});
  }
  deleteOldRolesAndGroups(params){
    return this.http.delete(this.urlDeleteOldRolesAndGroups,{params});

  }

  getCurrentUser(id){
    return this.http.get(`${this.urlUsers}${id}`)
  }

  deleteCurrentUser(p): Observable<any> {
    return this.http.delete(`${this.urlUsers}${p}/`);
  }

  // this is for creating records in the user group table
  createUserGroup(userGroupData): Observable<any> {
    return this.http.post(this.urlUserGroup, userGroupData);
  }
}
