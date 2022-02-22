import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class EntityService {

  constructor(private http: HttpClient) { }

  getEntities(): Observable<any> {
    return this.http.get(`${environment.serverUrl}/misEntity`);
  }

  getEntityRecord(params: any): Observable<any> {
    return this.http.get(`${environment.serverUrl}/misEntity/get_entity_record`, {params});
  }

  createEntity(formData): Observable<any> {
    return this.http.post(`${environment.serverUrl}/misEntity`, formData);
  }

  getEntityData(params: any): Observable<any> {
    return this.http.get(`${environment.serverUrl}/misEntity/get_entity_data`, {params});
  }

  addNewEntityRecord(entityRecord, params): Observable<any> {
    return this.http.post(`${environment.serverUrl}/misEntity/insert_entity_record`, entityRecord, {params});
  }

  getEntityFields(params: any): Observable<any> {
    return this.http.get(`${environment.serverUrl}/misEntity/get_entity_fields`, {params});
  }

  deleteEntity(deletedRow): Observable<any> {
    return this.http.delete(`${environment.serverUrl}/misEntity/${deletedRow}`);
  }

  getEntityViews(): Observable<any> {
    return this.http.get(`${environment.serverUrl}/entityView`);
  }

  createEntityView(formData): Observable<any> {
    return this.http.post(`${environment.serverUrl}/entityView`, formData);
  }

  getEntityViewData(params: any): Observable<any> {
    return this.http.get(`${environment.serverUrl}/entityView/view_data`, {params});
  }

  deleteEntityView(deletedRow): Observable<any> {
    return this.http.delete(`${environment.serverUrl}/entityView/${deletedRow}`);
  }
}
