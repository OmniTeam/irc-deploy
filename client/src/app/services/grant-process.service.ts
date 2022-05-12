import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class GrantProcessService {
  baseUrlShortTerm = environment.serverUrl+'/grantShortTerm';
  LETTER_OF_INTEREST = 'letterOfInterest'
  REVIEW_LETTER_OF_INTEREST = 'reviewLetterOfInterest'
  PLANNING_LEARNING = 'planningLearning'
  PLANNING_LEARNING_REVIEW = 'planningLearningReview'
  PLANNING_LEARNING_APPROVE = 'planningLearningApprove'
  PROVIDE_LEARNING_GRANT = 'provideLearningGrant'

  constructor(private http: HttpClient) { }

  getGrantForm(form:string): Observable<any> {
    return this.http.get(`${this.baseUrlShortTerm}/${form}`);
  }

  saveGrantForm(formData:FormData, form:string): Observable<any> {
    return this.http.put(`${this.baseUrlShortTerm}/${form}`, formData);
  }
}
