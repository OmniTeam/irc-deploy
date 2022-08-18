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

  getTags(): Observable<any> {
    return this.http.get(`${environment.serverUrl}/tag`);
  }

  getCurrentTag(id): Observable<any> {
    return this.http.get(`${environment.serverUrl}/tag/${id}`);
  }

  addNewTag(newTag): Observable<any> {
    const httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json'})};
    return this.http.post(`${environment.serverUrl}/tag`, newTag, httpOptions);
  }

  updateTag(id, formData): Observable<any> {
    return this.http.put(`${environment.serverUrl}/tag/${id}/`, formData);
  }

  deleteTag(deletedRow): Observable<any> {
    return this.http.delete(`${environment.serverUrl}/tag/${deletedRow}`);
  }

  getAllTagTypes(): Observable<any> {
    return this.http.get(`${environment.serverUrl}/tagType`);
  }

  getCurrentTagType(id): Observable<any> {
    return this.http.get(`${environment.serverUrl}/tagType/${id}`);
  }

  getTagTypes(): Observable<any> {
    return this.http.get(`${environment.serverUrl}/tagType`);
  }

  addNewTagType(newTagType): Observable<any> {
    const httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json'})};
    return this.http.post(`${environment.serverUrl}/tagType`, newTagType, httpOptions);
  }

  updateTagType(id, formData): Observable<any> {
    return this.http.put(`${environment.serverUrl}/tagType/${id}/`, formData);
  }

  deleteTagType(deletedRow): Observable<any> {
    return this.http.delete(`${environment.serverUrl}/tagType/${deletedRow}`);
  }

  getTagsByTagType(params): Observable<any> {
    return this.http.get(`${environment.serverUrl}/tag/getAllTagsByTagType`, {params});
  }

  addEntityTagRecord(entityTagRecord, params): Observable<any> {
    return this.http.post(`${environment.serverUrl}/tag/tagEntityRecord`, entityTagRecord, {params});
  }

  removeEntityTagRecord(entityTagRecord, params): Observable<any> {
    return this.http.post(`${environment.serverUrl}/tag/removeTagEntityRecord`, entityTagRecord, {params});
  }

}
