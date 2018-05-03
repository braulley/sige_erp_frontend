import { AuthService } from './../auth/auth.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { routerTransition } from '../router.animations';
import { FormsModule, FormGroup, FormBuilder, Validators,  ReactiveFormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    animations: [routerTransition()]
})
export class LoginComponent implements OnInit {

    f: FormGroup;
    errorCredentials = false;
    constructor(public router: Router,
        private authService: AuthService,
        private formBuilder: FormBuilder ) {}

    ngOnInit() {
        this.f = this.formBuilder.group({
          email: [null, [Validators.required, Validators.email]],
          password: [null, [Validators.required]]
        });
      }

      onSubmit() {
        this.authService.login(this.f.value).subscribe(
            (response) => {
                console.log('Response', response);
                this.router.navigate(['layout']);
            },
            (errorResponse: HttpErrorResponse) => {
              if (errorResponse.status === 401 ) {
                this.errorCredentials = true;
              }
            }
          );
    }
}
