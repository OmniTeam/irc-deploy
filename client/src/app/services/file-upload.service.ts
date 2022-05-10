import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  baseApiUrl = environment.serverUrl+'/fileManager/uploadFile';

  constructor(private http: HttpClient) {}

  upload(file, folder?:string):Observable<any> {
    const formData = new FormData();
    formData.append("file", file, file.name);
    if(folder!=undefined) formData.append("folder", folder);
    return this.http.post(this.baseApiUrl, formData)
  }

  downloadFile(path){
    console.log(environment.uploadFolder);
    return environment.uploadFolder+path
  }
}
