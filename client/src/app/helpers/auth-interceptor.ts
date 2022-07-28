import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, filter, take, switchMap } from 'rxjs/operators';
import {AuthService} from '../services/auth.service';
import {Router} from "@angular/router";
import {AlertService} from "../services/alert";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(private router: Router, public authService: AuthService, public alertService: AlertService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (this.authService.getJwtToken()) {
      request = this.addToken(request, this.authService.getJwtToken());
    }

    return next.handle(request).pipe(catchError(error => {
      let errorMessage = '';
      if (error.error instanceof ErrorEvent) {
        errorMessage = 'Error:' + error.error.message;
      } else {
        errorMessage = 'Error: ' + error.status + '\\nMessage:' + error.message;
      }
      if (error instanceof HttpErrorResponse && error.status === 401) {
        errorMessage = 'Invalid username or password or your session has expired!';
        this.alertService.error(errorMessage);
        this.authService.doLogoutUser();
        this.router.navigate(['login']);
      } else {
        return throwError(errorMessage);
      }
    }));
  }

  private addToken(request: HttpRequest<any>, token: string) {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }
}
