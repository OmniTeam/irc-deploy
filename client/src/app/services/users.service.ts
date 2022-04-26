import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  baseurl = environment.serverUrl;
  urlUsers = `${this.baseurl}/user/`;
  urlUserRole = `${this.baseurl}/UserRole/`;
  urlUserGroup = `${this.baseurl}/UserGroup/`;

  constructor(private http: HttpClient) { }

  getUsers(): Observable<any> {
    return this.http.get(this.urlUsers);
  }

  getUserStaffs(): Observable<any> {
    return this.http.get(`${this.urlUsers}/userStaffs`);
  }

  getUsersWithoutWorkPlan(): Observable<any> {
    return this.http.get(`${this.urlUsers}/getUsersWithoutWorkPlan`);
  }

  getCurrentUserStaff(id) {
    return this.http.get(`${this.urlUsers}/userStaffsShow/${id}/`);
  }

  getPrograms(): Observable<any> {
    return this.http.get(`${environment.serverUrl}/program/`);
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

  updateUser(id, submitData, params): Observable<any> {
    return this.http.put(`${this.urlUsers}${id}/`, submitData, {params});
  }

  getCurrentUser(id) {
    return this.http.get(`${this.urlUsers}${id}`);
  }

  deleteCurrentUser(p): Observable<any> {
    return this.http.delete(`${this.urlUsers}${p}/`);
  }
  // this is for creating records in the user role table
  createUserRole(userRoleData): Observable<any> {
    return this.http.post(this.urlUserRole, userRoleData);
  }

  createUserGroup(userGroupData): Observable<any> {
    return this.http.post(this.urlUserRole, userGroupData);
  }
}
