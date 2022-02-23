import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class RolesService {
  baseurl = environment.serverUrl
  userRoles = `${this.baseurl}/roles/`

  constructor(private http: HttpClient) { }

  getRoles(): Observable<any> {
    return this.http.get(this.userRoles);
  }
  getRolesFiltered(params): Observable<any> {
    return this.http.get(this.userRoles, {params});
  }

  createRole(formData): Observable<any> {
    return this.http.post(this.userRoles, formData);
  }

  updateRole(id, groupData): Observable<any> {
    return this.http.get(`${this.userRoles}${id}/`, groupData);
  }

  getCurrentRole(id){
    return this.http.get(`${this.userRoles}${id}`)
  }

  deleteCurrentRole(p): Observable<any> {
    return this.http.delete(`${this.userRoles}${p}/`);
  }
}
