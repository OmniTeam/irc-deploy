import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  baseApiUrl = environment.serverUrl+'/fileManager';

  constructor(private http: HttpClient) {}

  upload(file, folder?:string):Observable<any> {
    const formData = new FormData();
    formData.append("file", file, file.name);
    if(folder!=undefined) formData.append("folder", folder);
    return this.http.post(this.baseApiUrl+'/uploadFile', formData)
  }

  downloadFile(path):Observable<any> {
    const formData = new FormData();
    formData.append("path", path);
    return this.http.post(this.baseApiUrl+'/downloadFile', formData)
  }
}
