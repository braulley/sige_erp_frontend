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

  urlFinanceiro:any =  `https://corerestserver20180515102643plan.azurewebsites.net/api/financeiro`;
  urlRh:any =  `http://ec2-54-236-22-229.compute-1.amazonaws.com/?id=2`;
  urlVendas:any = `https://erp-vendas.azurewebsites.net/financeiro.php`;
  urlEstoque:any = `https://slim-webservice.azurewebsites.net/Estoque/Financeiro`;


    getAll(): Observable<any[]> {
        return this.http.get(this.urlFinanceiro)
            .map(res=>res.json())
            .catch(err=> Observable.throw(err.message));
    }

    getRh(): Observable<any[]> {
        return this.http.get(this.urlRh)
            .map(res=>res.json())
            .catch(err=> Observable.throw(err.message));
    }

    getVendas(): Observable<any[]> {
        return this.http.get(this.urlVendas)
            .map(res=>res.json())
            .catch(err=> Observable.throw(err.message));
    }

    getEstoque(): Observable<any[]> {
        return this.http.get(this.urlEstoque)
            .map(res=>res.json())
            .catch( err=> Observable.throw(err.message));
    }


}
