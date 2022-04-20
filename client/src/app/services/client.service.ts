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
  urlClient2 = `${this.baseurl}/api/v1/data/clients-from-remote2/`

  constructor(private http: HttpClient) { }

  getClients(): Observable<any> {
    return this.http.get(this.urlClient);
  }

  createClient(formData): Observable<any> {
    return this.http.post(this.urlClient, formData);
  }

  downloadClientData(): Observable<any>{
    return this.http.get(this.urlClient2)
  }

  getCurrentClient(id){
    return this.http.get(`${this.urlClient}${id}`)
  }
}
