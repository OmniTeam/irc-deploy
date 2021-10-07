import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Tokens} from "../models/tokens";
import {environment} from "../../environments/environment";
import {Observable, of} from "rxjs";
import {catchError, mapTo, tap} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly JWT_TOKEN = 'JWT_TOKEN';
  private readonly REFRESH_TOKEN = 'REFRESH_TOKEN';
  private readonly USERNAME = 'USERNAME';
  private loggedUser: string;

  constructor(private http: HttpClient) { }

  login(user: { username: string, password: string }): Observable<any> {
    let loginUrl = `${environment.serverUrl}/api/login`;
    console.log(loginUrl);
    console.log(user);
    return this.http.post<any>(`${environment.serverUrl}/api/login`, user)
      .pipe(
        tap(tokens => this.doLoginUser(user.username, tokens)),
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

  private doLoginUser(username: string, tokens: Tokens) {
    console.log(username);
    console.log(tokens);
    this.loggedUser = username;
    this.storeTokens(tokens);
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

  private storeTokens(tokens: Tokens) {
    localStorage.setItem(this.JWT_TOKEN, tokens.access_token);
    localStorage.setItem(this.REFRESH_TOKEN, tokens.refresh_token);
    localStorage.setItem(this.USERNAME, this.loggedUser);
  }

  private removeTokens() {
    localStorage.removeItem(this.JWT_TOKEN);
    localStorage.removeItem(this.REFRESH_TOKEN);
    localStorage.removeItem(this.USERNAME);
  }

  getLoggedInUsername() {
    return localStorage.getItem(this.USERNAME);
  }
}
