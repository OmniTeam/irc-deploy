import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class LongTermGrantService {
  application = `${environment.serverUrl}/longTermGrantApplication`
  reviewApplication = `${environment.serverUrl}/longTermGrantReview`;

  constructor(private http: HttpClient) {
  }

  /***
   *   get
   */

  getApplication(id) {
    return this.http.get(`${this.application}/${id}/`);
  }

  getApplicationByGrantId(grantId) {
    return this.http.get(`${this.application}/getApplicationByGrantId/${grantId}/`);
  }

  getReviewApplication(id) {
    return this.http.get(`${this.reviewApplication}/${id}/`);
  }

  getReviewApplicationByGrantId(grantId) {
    return this.http.get(`${this.reviewApplication}/getApplicationByGrantId/${grantId}/`);
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




  startLongTermGrantJob(grantId): Observable<any> {
    return this.http.get(`${this.application}/startLongTermGrantJob/${grantId}`);
  }

}
