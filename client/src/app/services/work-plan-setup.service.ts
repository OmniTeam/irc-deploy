import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class WorkPlanService {

  constructor(private http: HttpClient) { }

  getWorkPlan(): Observable<any> {
    return this.http.get(`${environment.serverUrl}/workPlan`);
  }

  createWorkPlan(formData): Observable<any> {
    return this.http.post(`${environment.serverUrl}/workPlan`, formData);
  }

  updateWorkPlan(formData, id): Observable<any> {
    return this.http.put(`${environment.serverUrl}/workPlan/${id}`, formData);
  }

  getWorkPlanRecord(params: any): Observable<any> {
    return this.http.get(`${environment.serverUrl}/workPlan/getWorkPlanRecord`, {params});
  }

  deleteWorkPlanRecord(deletedRow): Observable<any> {
    return this.http.delete(`${environment.serverUrl}/workPlan/${deletedRow}`);
  }

  getReportingCalendarByWorkPlanId(params: any): Observable<any> {
    return this.http.get(`${environment.serverUrl}/calendarTriggerDates/getReportingCalendarByWorkPlanId`, {params});
  }

  deleteReportingCalendarForPartner(deletedRow): Observable<any> {
    return this.http.delete(`${environment.serverUrl}/calendarTriggerDates/${deletedRow}`);
  }

  createReportingCalendar(formData): Observable<any> {
    return this.http.post(`${environment.serverUrl}/calendarTriggerDates`, formData);
  }

  updateReportingCalendarStatus(params: any): Observable<any> {
    return this.http.get(`${environment.serverUrl}/calendarTriggerDates/updateReportingCalendarStatus`, {params});
  }
}
