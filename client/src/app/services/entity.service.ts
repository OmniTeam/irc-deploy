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

  createEntity(formData): Observable<any> {
    return this.http.post(`${environment.serverUrl}/misEntity`, formData);
  }

  getEntityData(params: any): Observable<any> {
    return this.http.get(`${environment.serverUrl}/misEntity/get_entity_data`, {params});
  }

  addNewEntityRecord(entityRecord): Observable<any> {
    return this.http.post(`${environment.serverUrl}/misEntity/insert_entity_record`, entityRecord);
  }
}
