import { Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import { environment } from '../../environments/environment.prod';



@Injectable()
export class RefreshTokenInterceptor implements HttpInterceptor {

  constructor(private injector: Injector) {  }

  intercept(request: HttpRequest<any>, next: HttpHandler):
    Observable<HttpEvent<any>> {

      return next.handle(request).catch((errorResponse: HttpErrorResponse ) => {
        const err = errorResponse.error;
        const error = (typeof errorResponse !== 'object') ? JSON.parse(err) : errorResponse;
        if (error.status === 401  &&  err.error  === 'token_expired' ) {
          const http = this.injector.get(HttpClient);

          return http.post<any>(`${environment.api_url}/auth/refresh`, {})
            .flatMap(data => {
              localStorage.setItem('token', data.token);
              const cloneRequest = request.clone({setHeaders: {'Authorization': `Bearer ${data.token}`}});

              return next.handle(cloneRequest);
            });
        }
        return Observable.throw(errorResponse);
      });
  }
}
