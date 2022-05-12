import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class GrantProcessService {
  baseUrl = environment.serverUrl;
  letterOfInterest = this.baseUrl+'/grantLetterOfInterest';
  reviewLetterOfInterest = this.baseUrl+'/grantLetterOfInterestReview';
  planningLearning = this.baseUrl+'/grantPlanningLearning';
  planningLearningReview = this.baseUrl+'/grantPlanningLearningReview';
  planningLearningApprove = this.baseUrl+'/grantPlanningLearningApprove';
  provideLearningGrant = this.baseUrl+'/grantProvideLearningGrant';

  constructor(private http: HttpClient) { }

  getLetterOfInterest(id): Observable<any> {
    return this.http.get(`${this.letterOfInterest}/${id}`);
  }

  createLetterOfInterest(formData): Observable<any> {
    return this.http.post(this.letterOfInterest, formData);
  }

  updateLetterOfInterest(formData, id): Observable<any> {
    return this.http.put(`${this.letterOfInterest}/${id}`, formData);
  }
}
