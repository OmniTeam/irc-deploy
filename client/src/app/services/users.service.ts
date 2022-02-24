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

  constructor(private http: HttpClient) { }

  getUsers(): Observable<any> {
    return this.http.get(this.urlUsers);
  }
  getUsersFiltered(params): Observable<any> {
    return this.http.get(this.urlUsers, {params});
  }

  createUser(formData): Observable<any> {
    return this.http.post(this.urlUsers, formData);
  }

  updateUser(id, groupData): Observable<any> {
    return this.http.get(`${this.urlUsers}${id}/`, groupData);
  }

  getCurrentUser(id){
    return this.http.get(`${this.urlUsers}${id}`)
  }

  deleteCurrentUser(p): Observable<any> {
    return this.http.delete(`${this.urlUsers}${p}/`);
  }
}
