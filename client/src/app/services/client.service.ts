import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
 export class ClientService {
  baseurl = environment.serverUrl
  urlClient = `${this.baseurl}/Clients/`

  constructor(private http: HttpClient) { }

  getClients(): Observable<any> {
    return this.http.get(this.urlClient);
  }

  createClient(formData): Observable<any> {
    return this.http.post(this.urlClient, formData);
  }

  getCurrentClient(id){
    return this.http.get(`${this.urlClient}${id}`)
  }
}
