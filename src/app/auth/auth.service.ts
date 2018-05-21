import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/toPromise';
import { HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { User } from '../interface/user.model';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment.prod';

@Injectable()
export class AuthService {

  constructor(private http: HttpClient,
    private router: Router) { }
    headers: any = new HttpHeaders();

    check(): boolean {
        return localStorage.getItem('user') ? true : false;
    }

    login(credentials: {email: string, password: string} ): Observable<any> {

        return this.http.post<any>(`${ environment .api_url}/auth/login`, credentials)
        .do( data => {
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', btoa(JSON.stringify(data.user)));
        });
    }

    logout(): void {
        this.http.get(`${environment.api_url}/auth/logout`).subscribe( resp => {
          console.log(resp);
          localStorage.clear();
          this.router.navigate(['/auth/login']);
        });
    }

    getUser(): User {
        return localStorage.getItem('user') ? JSON.parse(atob(localStorage.getItem('user'))) : null;
    }

    setUser(): Promise <boolean> {
        return this.http.get<any>(`${environment.api_url}/auth/me`).toPromise()
          .then( data => {
            if (data.user) {
              localStorage.setItem('user', JSON.stringify(btoa(data.user)));
              return true;
            }
            return false;
          });
      }

}
