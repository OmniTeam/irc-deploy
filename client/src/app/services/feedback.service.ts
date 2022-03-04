import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {
  baseurl = environment.serverUrl
  urlFeedback = `${this.baseurl}/Feedback/`

  constructor(private http: HttpClient) { }

  getFeedback(): Observable<any> {
    return this.http.get(this.urlFeedback);
  }
  getFeedbackFiltered(params): Observable<any> {
    return this.http.get(this.urlFeedback, {params});
  }

  createFeedback(formData): Observable<any> {
    return this.http.post(this.urlFeedback, formData);
  }

  updateFeedback(id, groupData): Observable<any> {
    return this.http.put(`${this.urlFeedback}${id}/`, groupData);
  }

  getCurrentFeedback(id){
    return this.http.get(`${this.urlFeedback}${id}`)
  }

  deleteCurrentFeedback(p): Observable<any> {
    return this.http.delete(`${this.urlFeedback}${p}/`);
  }
}
