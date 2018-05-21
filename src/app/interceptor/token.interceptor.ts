import { environment } from './../../environments/environment.prod';
import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HTTP_INTERCEPTORS} from '@angular/common/http';

import { Observable } from 'rxjs/Observable';



/** Http interceptor providers in outside-in order
export const httpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor , multi: true },
];
/** Pass untouched request through to the next request handler. */
@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  intercept(request: HttpRequest<any>, next: HttpHandler):
    Observable<HttpEvent<any>> {

      /*const requestUrl: Array<any>  = request.url.split('/');
      console.log('requestUrl', requestUrl);*/
      const apiUrl: Array<any> = environment.api_url.split('/');
      const token = localStorage.getItem('token');

      if (token && apiUrl[2]) {
        const newRequest = request.clone({ setHeaders: {'Authorization': `Bearer ${token}`}});
        return next.handle(newRequest);
      } else {
        return next.handle(request);
      }
  }
}
