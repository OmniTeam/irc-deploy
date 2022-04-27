import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AclGroupMappingService {
  baseurl = environment.serverUrl;
  urlAcl = `${this.baseurl}/api/v1/aclGroupMapping/`;
  urlAcl2 = `${this.baseurl}/api/v1/aclGroupMapping-v2/`;

  constructor(private http: HttpClient) { }

  listAllACLS(): Observable<any> {
    return this.http.get(`${this.baseurl}/listAllACLS/`);
  }

  getGroupMapping(): Observable<any> {
    return this.http.get(this.urlAcl);
  }
  getGroupMappingFiltered(params): Observable<any> {
    return this.http.get(this.urlAcl, {params});
  }

  createGroupMapping(formData): Observable<any> {
    return this.http.post(this.urlAcl, formData);
  }
  createGroupMapping2(formData): Observable<any> {
    return this.http.post(this.urlAcl2, formData);
  }
  getCurrentGroupMapping(id) {
    return this.http.get(`${this.urlAcl}${id}/`);
  }

  updateGroupMapping(id, submitData): Observable<any> {
    return this.http.put(`${this.urlAcl}${id}/`, submitData);
  }

  deleteCurrentGroupMapping(p): Observable<any> {
    return this.http.delete(`${this.urlAcl}${p}/`);
  }

}
