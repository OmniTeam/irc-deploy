import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ScheduledTasksService {

  constructor(private http: HttpClient) {
  }

  getScheduledTasks(): Observable<any> {
    return this.http.get(`${environment.serverUrl}/taskDef`);
  }

  runScheduledTask(params: any): Observable<any> {
    return this.http.get(`${environment.serverUrl}/taskDef/runNow`, {params});
  }

  scheduleTask(params: any): Observable<any> {
    return this.http.get(`${environment.serverUrl}/taskDef/scheduleTask`, {params});
  }

  unScheduleTask(params: any): Observable<any> {
    return this.http.get(`${environment.serverUrl}/taskDef/unScheduleTask`, {params});
  }


  getClientsDataOdata(): Observable<any>{
    return  this.http.get(`${environment.serverUrl}/api/v1/data/clients-from-remote2/`)
  }

  getServicesDataOdata(): Observable<any>{
    return  this.http.get(`${environment.serverUrl}/api/v1/data/clients-from-remote/`)
  }
}
