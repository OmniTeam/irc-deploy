import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class GrantProcessService {
  letterOfInterest = `${environment.serverUrl}/grantLetterOfInterest`
  reviewLetterOfInterest = `${environment.serverUrl}/grantLetterOfInterestReview`;
  planningLearning = `${environment.serverUrl}/grantPlanningLearning`;
  planningLearningReview = `${environment.serverUrl}/grantPlanningLearningReview`;
  planningLearningApprove = `${environment.serverUrl}/grantPlanningLearningApprove`;
  provideLearningGrant = `${environment.serverUrl}/grantProvideLearningGrant`;

  constructor(private http: HttpClient) {
  }

  getLetterOfInterest(id) {
    return this.http.get(`${this.letterOfInterest}/${id}/`);
  }

  createLetterOfInterest(formData): Observable<any> {
    return this.http.post(this.letterOfInterest, formData);
  }

  updateLetterOfInterest(formData, id): Observable<any> {
    return this.http.put(`${this.letterOfInterest}/${id}`, formData);
  }
}
