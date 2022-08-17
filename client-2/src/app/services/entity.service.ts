import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EntityService {

  constructor(private http: HttpClient) { }

  getEntities(): Observable<any> {
    return this.http.get(`${environment.serverUrl}/misEntity`);
  }

  getCurrentEntity(id): Observable<any> {
    return this.http.get(`${environment.serverUrl}/misEntity/${id}`);
  }

  deleteEntityRecord(params: any): Observable<any> {
    return this.http.get(`${environment.serverUrl}/misEntity/deleteEntityRecord`, {params});
  }

  createEntity(formData): Observable<any> {
    return this.http.post(`${environment.serverUrl}/misEntity`, formData);
  }

  updateEntity(id, formData): Observable<any> {
    return this.http.put(`${environment.serverUrl}/misEntity/${id}/`, formData);
  }

  getEntityData(params: any): Observable<any> {
    return this.http.get(`${environment.serverUrl}/misEntity/getEntityData`, {params});
  }

  addNewEntityRecord(entityRecord, params): Observable<any> {
    return this.http.post(`${environment.serverUrl}/misEntity/insertEntityRecord`, entityRecord, {params});
  }

  updateEntityRecord(entityRecord, params): Observable<any> {
    return this.http.post(`${environment.serverUrl}/misEntity/updateEntityRecord`, entityRecord, {params});
  }

  getEntityFields(params: any): Observable<any> {
    return this.http.get(`${environment.serverUrl}/misEntity/getEntityFields`, {params});
  }

  deleteEntity(deletedRow): Observable<any> {
    return this.http.delete(`${environment.serverUrl}/misEntity/${deletedRow}`);
  }

  getEntityViews(): Observable<any> {
    return this.http.get(`${environment.serverUrl}/entityView`);
  }

  getCurrentEntityView(id): Observable<any> {

    return this.http.get(`${environment.serverUrl}/entityView/${id}`);
  }

  createEntityView(formData): Observable<any> {
    return this.http.post(`${environment.serverUrl}/entityView`, formData);
  }

  updateEntityView(id, formData): Observable<any> {
    return this.http.put(`${environment.serverUrl}/entityView/${id}/`, formData);
  }

  getEntityViewData(params: any): Observable<any> {
    return this.http.get(`${environment.serverUrl}/entityView/viewData`, {params});
  }

  deleteEntityView(deletedRow): Observable<any> {
    return this.http.delete(`${environment.serverUrl}/entityView/${deletedRow}`);
  }

  deleteEntityViewField(id): Observable<any> {
    return this.http.delete(`${environment.serverUrl}/entityViewFields/${id}`);
  }

  exportEntityData(params: any): Observable<any> {
    return this.http.get(`${environment.serverUrl}/misEntity/exportEntityData`, {params});
  }

  uploadExcelFile(file, id): Observable<any> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    formData.append('id', id);
    return this.http.post(`${environment.serverUrl}/fileManager/uploadExcel`, formData);
  }
}
