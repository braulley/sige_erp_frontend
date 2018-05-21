import { Validators } from '@angular/forms';
import { ErrorHandler ,Injectable } from '@angular/core';
import {Http, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import { HttpErrorResponse, HttpClient  } from '@angular/common/http';
@Injectable()
export class DataService {

  constructor(private http: Http) { }

  url:any =  `https://corerestserver20180515102643plan.azurewebsites.net/api/financeiro`;


    getAll(): Observable<any[]> {
        return this.http.get(this.url)
            .map(res=>res.json())
            .catch(err=> Observable.throw(err.message));
    }

}
