import {
    HTTP_INTERCEPTORS,
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
    HttpResponse
} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable, of, throwError} from 'rxjs';
import {delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const {url, method, headers, body} = request;

    // wrap in delayed observable to simulate server api call
    // @ts-ignore
    return of(null)
      .pipe(mergeMap(handleRoute))
      .pipe(materialize())
      .pipe(delay(500))
      .pipe(dematerialize());



    function handleRoute() {
      switch (true) {
        // case url.endsWith('/api/login') && method === 'POST':
        //     return t();
        default:
          // pass through any requests not handled above
          return next.handle(request);
      }
    }



    // route functions



    // function authenticate() {
    //   const {username, password} = body;
    //   const user = users.find(x => x.username === username && x.password === password);
    //   if (!user) {
    //     return error('Email or password is incorrect');
    //   }
    //   return ok({
    //     id: user.id,
    //     username: user.username,
    //     firstName: user.firstName,
    //     lastName: user.lastName,
    //     token: 'fake-jwt-token'
    //   });
    // }
    // helper functions



    // tslint:disable-next-line:no-shadowed-variable
    function ok(body?) {
      return of(new HttpResponse({status: 200, body}));
    }



    function error(message) {
      return throwError({error: {message}});
    }



    function unauthorized() {
      return throwError({status: 401, error: {message: 'Unauthorised'}});
    }



    function isLoggedIn() {
      return headers.get('Authorization') === 'Bearer fake-jwt-token';
    }



    function idFromUrl() {
      const urlParts = url.split('/');
      // tslint:disable-next-line:radix
      return parseInt(urlParts[urlParts.length - 1]);
    }
  }
}



export const fakeBackendProvider = {
  // use fake backend in place of Http service for backend-less development
  provide: HTTP_INTERCEPTORS,
  useClass: FakeBackendInterceptor,
  multi: true
};
