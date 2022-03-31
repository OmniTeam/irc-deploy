import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Observable, of} from "rxjs";
import {catchError, mapTo, tap} from "rxjs/operators";
import {User} from "../models/user";
import {Roles} from "../models/roles";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly JWT_TOKEN = 'JWT_TOKEN';
  private readonly REFRESH_TOKEN = 'REFRESH_TOKEN';
  private readonly USERNAME = 'USERNAME';
  private readonly ROLES: any = [];
  private loggedUser: string;

  constructor(private http: HttpClient) {
  }

  login(user: { username: string, password: string }): Observable<any> {
    return this.http.post<any>(`${environment.serverUrl}/api/login`, user)
      .pipe(
        tap(user => this.doLoginUser(user.username, user)),
        mapTo(true),
        catchError(error => {
          alert(error.error);
          return of(false);
        }));
  }


  logout() {
    return this.http.post<any>(`${environment.serverUrl}/logout`, {
      refreshToken: this.getRefreshToken()
    }).pipe(
      tap(() => this.doLogoutUser()),
      mapTo(true),
      catchError(error => {
        alert(error.error);
        return of(false);
      }));
  }

  isLoggedIn() {
    return !!this.getJwtToken();
  }

  getJwtToken() {
    return localStorage.getItem(this.JWT_TOKEN);
  }

  private doLoginUser(username: string, user: User) {
    this.loggedUser = username;
    this.storeTokens(user);
  }

  doLogoutUser() {
    this.loggedUser = null;
    this.removeTokens();
  }

  private getRefreshToken() {
    return localStorage.getItem(this.REFRESH_TOKEN);
  }

  private storeJwtToken(jwt: string) {
    localStorage.setItem(this.JWT_TOKEN, jwt);
  }

  private storeTokens(user: User) {
    localStorage.setItem(this.JWT_TOKEN, user.access_token);
    localStorage.setItem(this.REFRESH_TOKEN, user.refresh_token);
    localStorage.setItem(this.USERNAME, this.loggedUser);
    localStorage.setItem(this.ROLES, user.roles);
  }

  private removeTokens() {
    localStorage.removeItem(this.JWT_TOKEN);
    localStorage.removeItem(this.REFRESH_TOKEN);
    localStorage.removeItem(this.USERNAME);
  }

  getLoggedInUsername() {
    return localStorage.getItem(this.USERNAME);
  }

  getUserRoles() {
    return localStorage.getItem(this.ROLES);
  }

  public getSession(): Promise<boolean> {
    const session = localStorage.getItem(this.JWT_TOKEN);
    return new Promise((resolve, reject) => {
      if (session) {
        return resolve(true);
      } else {
        return reject(false);
      }
    });
  }

  public areUserRolesAllowed(userRoles: string[], allowedUserRoles: Roles[]): boolean {
    for (const role of userRoles) {
      for (const allowedRole of allowedUserRoles) {
        if (role.toLowerCase() === allowedRole.toLowerCase()) {
          return true;
        }
      }
    }
    return false;
  }
}
