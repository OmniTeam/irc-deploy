import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class KengaDataTablesService {
  baseurl = environment.serverUrl;
  urlTables = `${this.baseurl}/allMisTables/`;

  constructor(private http: HttpClient) { }

  getTables(): Observable<any> {
    return this.http.get(this.urlTables);
  }
}
