import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class FormService {

  constructor(private http: HttpClient) {
  }

  getForms(): Observable<any> {
    return this.http.get(`${environment.serverUrl}/form`);
  }

  getEnabledForms(): Observable<any> {
    return this.http.get(`${environment.serverUrl}/form/getEnabledForms`);
  }


  getFormData(params: any): Observable<any> {
    return this.http.get(`${environment.serverUrl}/data`, {params});
  }

  getFormDataRecord(params: any): Observable<any> {
    return this.http.get(`${environment.serverUrl}/data/getFormDataRecord`, {params});
  }

  getPointDetails(params: any): Observable<any> {
    return this.http.get(`${environment.serverUrl}/data/getPointDetails`, {params});
  }

  updateForm(id, formData): Observable<any> {
    return this.http.put(`${environment.serverUrl}/form/${id}`, formData);
  }

  exportFormData(params: any): Observable<any> {
    return this.http.get(`${environment.serverUrl}/data/exportFormData`, {params});
  }

  exportZippedFormData(params: any): Observable<any> {
    return this.http.get(`${environment.serverUrl}/data/exportZippedFormData`, {params});
  }

  deleteForm(deletedRow): Observable<any> {
    return this.http.delete(`${environment.serverUrl}/form/${deletedRow}`);
  }
}
