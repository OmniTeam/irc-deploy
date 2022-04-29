import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AclGroupMappingService {
  baseurl = environment.serverUrl;
  urlAcl2 = `${this.baseurl}/aclGroupMappings/`;

  constructor(private http: HttpClient) { }

  listAllACLS(): Observable<any> {
    return this.http.get(`${this.baseurl}/listAllACLS/`);
  }

  createGroupMapping2(formData): Observable<any> {
    return this.http.post(this.urlAcl2, formData);
  }

}
