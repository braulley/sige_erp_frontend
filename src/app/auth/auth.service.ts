import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/toPromise';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AuthService {

  constructor(private http: HttpClient,
    private router: Router) { }

    login(credentials: {email: string, password: string}): Observable<boolean> {

        return this.http.post<any>(`${environment.api_url}/auth/login`, credentials)
        .do( data => {
            console.log('Data', data);
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', btoa(JSON.stringify(data.user)));
        });
      }

}
