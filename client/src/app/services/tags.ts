import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TagService {

  constructor(private http: HttpClient) {
  }

  getTags(params): Observable<any> {
    return this.http.get(`${environment.serverUrl}/tag`, {params});
  }

  addNewTag(newTag): Observable<any> {
    const httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json'})};
    return this.http.post(`${environment.serverUrl}/tag`, newTag, httpOptions);
  }

  deleteTag(deletedRow): Observable<any> {
    return this.http.delete(`${environment.serverUrl}/tag/${deletedRow}`);
  }

  getAllTagTypes(): Observable<any> {
    return this.http.get(`${environment.serverUrl}/tagType`);
  }

  getTagTypes(params): Observable<any> {
    return this.http.get(`${environment.serverUrl}/tagType`, {params});
  }

  addNewTagType(newTagType): Observable<any> {
    const httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json'})};
    return this.http.post(`${environment.serverUrl}/tagType`, newTagType, httpOptions);
  }

  deleteTagType(deletedRow): Observable<any> {
    return this.http.delete(`${environment.serverUrl}/tagType/${deletedRow}`);
  }

}
