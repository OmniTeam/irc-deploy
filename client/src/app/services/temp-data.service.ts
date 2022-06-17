import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class TempDataService {
  baseurl = `${environment.serverUrl}/temp`;

  constructor(private http: HttpClient) {
  }

  getTempData(): Observable<any> {
    return this.http.get(`${this.baseurl}`);
  }

  startLongTermGrantJob(): Observable<any> {
    return this.http.get(`${this.baseurl}/startLongTermGrantJob`);
  }

  createTempData(formData): Observable<any> {
    return this.http.post(`${this.baseurl}`, formData);
  }

  updateTempData(formData, id): Observable<any> {
    return this.http.put(`${this.baseurl}/${id}`, formData);
  }

  getTempDataRecord(id) {
    return this.http.get(`${this.baseurl}/${id}`);
  }

  getTempRecordByValue(value): Observable<any> {
    return this.http.get(`${this.baseurl}/getTempRecordByValue/${value}`);
  }
}
