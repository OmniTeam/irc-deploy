import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class EntityViewFiltersService {

  baseurl = `${environment.serverUrl}/entityViewFilters/`
  constructor(private http: HttpClient) { }

  getEntityViewFilters(): Observable<any> {
    return this.http.get(this.baseurl);
  }

  createEntityViewFilter(formData): Observable<any> {
    return this.http.post(this.baseurl, formData);
  }

  getCurrentEntityViewFilter(id) {
    return this.http.get(`${this.baseurl}${id}/`);
  }

  updateEntityViewFilter(id, formData): Observable<any> {
    return this.http.put(`${this.baseurl}${id}/`, formData);
  }

  deleteEntityViewFilter(id): Observable<any> {
    return this.http.delete(`${this.baseurl}${id}/`);
  }
}
