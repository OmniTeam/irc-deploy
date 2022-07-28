import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {environment} from "../../environments/environment";
import {AlertService} from "./alert";

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  baseApiUrl = environment.serverUrl+'/fileManager';

  constructor(private http: HttpClient, private alertService: AlertService) {}

  upload(file, folder?:string):Observable<any> {
    let maxfilesize = (1024 * 1024) * 5 //5mbs
    let filesize = file.size
    if (filesize > maxfilesize) {
      this.alertService.info("File size too big. Please upload a smaller file", () => {})
      return throwError("File size too big. Please upload a smaller file")
    } else {
      const formData = new FormData();
      formData.append("file", file, file.name);
      if (folder != undefined) formData.append("folder", folder);
      return this.http.post(this.baseApiUrl + '/uploadFile', formData)
    }
  }

  download(path):Observable<Blob> {
    const formData = new FormData();
    formData.append("path", path);
    return this.http.post(this.baseApiUrl+'/downloadFile', formData, { responseType: 'blob' })
  }

  downloadFile(path) {
    let fileName = path.substring(path.lastIndexOf('/') + 1)
    let fileExtension = fileName.split('.').pop();
    let mime
    if (['jpeg', 'jpg', 'png'].includes(fileExtension)) mime = 'image/' + fileExtension
    else mime = 'application/' + fileExtension
    console.log(fileName, mime)
    this.download(path).subscribe((response) => {
      var newBlob = new Blob([response], {type: mime});
      const data = window.URL.createObjectURL(newBlob);
      const link = document.createElement('a');
      link.setAttribute('target', '_blank');
      link.setAttribute('href', data);
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    }, error => {
      console.log(error)
    })
  }

  getFileName(path) {
    return path?.substring(path.lastIndexOf('/') + 1)
  }
}
