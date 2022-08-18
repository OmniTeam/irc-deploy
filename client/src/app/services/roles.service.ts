import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";
import {catchError, map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class RolesService {
  baseurl = environment.serverUrl
  userRoles = `${this.baseurl}/role`

  constructor(private http: HttpClient) { }

  getRoles(): Observable<any> {
    return this.http.get(this.userRoles);
  }
  getRolesFiltered(params): Observable<any> {
    return this.http.get(this.userRoles, {params});
  }

  createRole(formData): Observable<any> {
    const httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json'})};
    return this.http.post(this.userRoles, formData, httpOptions);
  }

  updateRole(id, groupData): Observable<any> {
    return this.http.put(`${this.userRoles}/${id}/`, groupData);
  }

  getCurrentRole(id) {
    return this.http.get(`${this.userRoles}/${id}/`);
  }

  deleteCurrentRole(p): Observable<any> {
    return this.http.delete(`${this.userRoles}/${p}/`);
  }

  getUserRoles(params) {
    return this.http.get(`${this.userRoles}/getUserRoles`, {params});
  }

  getAllUserRoles(params): Promise<string[]> {
    return new Promise((resolve, reject) => {
      this.http.get(`${this.userRoles}/getUserRoles`, {params})
        .pipe(catchError((error: any, caught: any) => {
            reject(error);
            return caught;
          }),
          map((res: any) => res))
        .subscribe((role: string[]) => {
          resolve(role);
        });
    });
  }
}
