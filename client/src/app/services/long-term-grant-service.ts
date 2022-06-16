import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class LongTermGrantService {
  application = `${environment.serverUrl}/temp`
  reviewApplication = `${environment.serverUrl}/temp`;

  constructor(private http: HttpClient) {
  }

  /***
   *   get
   */

  getApplication(id) {
    return this.http.get(`${this.application}/${id}/`);
  }

  getReviewApplication(id) {
    return this.http.get(`${this.reviewApplication}/${id}/`);
  }

  /***
   * get by Process Instance Id
   * */
  getRecordByProcessInstanceId(route, params: any): Observable<any> {
    return this.http.get(route, {params});
  }

  /***
   *   create
   */


  createApplication(formData): Observable<any> {
    return this.http.post(this.application, formData);
  }

  createReviewApplication(formData): Observable<any> {
    return this.http.post(this.reviewApplication, formData);
  }

  /***
   *   update
   */

  updateApplication(formData, id): Observable<any> {
    return this.http.put(`${this.application}/${id}`, formData);
  }

  updateReviewApplication(formData, id): Observable<any> {
    return this.http.put(`${this.reviewApplication}/${id}`, formData);
  }

}
