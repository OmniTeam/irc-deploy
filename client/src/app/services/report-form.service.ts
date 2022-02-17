import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ReportFormService {

  constructor(private http: HttpClient) { }

  getAllReports(): Observable<any> {
    return this.http.get(`${environment.serverUrl}/reportForm`);
  }

  getReportForTask(params: any): Observable<any> {
    return this.http.get(`${environment.serverUrl}/reportForm/get_report_for_task`, {params});
  }

  createReport(formData): Observable<any> {
    return this.http.post(`${environment.serverUrl}/reportForm`, formData);
  }

  updateReport(formData, id): Observable<any> {
    return this.http.put(`${environment.serverUrl}/reportForm/${id}`, formData);
  }

  getAttachmentsForTask(params: any): Observable<any> {
    return this.http.get(`${environment.serverUrl}/reportFormFiles/get_files_for_task`, {params});
  }

  saveFile(formData): Observable<any> {
    return this.http.post(`${environment.serverUrl}/reportFormFiles`, formData);
  }

  updateFile(formData, id): Observable<any> {
    return this.http.put(`${environment.serverUrl}/reportFormFiles/${id}`, formData);
  }

  getFileByTaskAndName(params: any): Observable<any> {
    return this.http.get(`${environment.serverUrl}/reportFormFiles/get_file_by_task_and_name`,{params});
  }

  saveComment(formData): Observable<any> {
    return this.http.post(`${environment.serverUrl}/reportFormComments`, formData);
  }

  saveRecommendation(formData): Observable<any> {
    return this.http.post(`${environment.serverUrl}/reportFormRecommendations`, formData);
  }
}
