import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ActivityReportService {
  baseurl = environment.serverUrl
  urlActivityReport = `${this.baseurl}/activityReport/`

  constructor(private http: HttpClient) { }
  createActivityReport(formData): Observable<any>{
    return this.http.post(this.urlActivityReport, formData);
  }

  getActivityReport(): Observable<any> {
    return this.http.get(this.urlActivityReport);
  }

  getBudgetLine(params: any): Observable<any> {
    return this.http.get(`${this.urlActivityReport}/getBudgetLine`, {params});
  }

  updateActivityReport(formData, id): Observable<any> {
    return this.http.put(`${this.urlActivityReport}${id}/`, formData);
  }

  deleteCurrentActivityReport(p): Observable<any> {
    return this.http.delete(`${this.urlActivityReport}${p}/`);
  }

  getCurrentActivityReport(id){
    return this.http.get(`${this.urlActivityReport}${id}`)
  }
}
