import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';
import { FormGroup , FormControl , ReactiveFormsModule , FormsModule } from '@angular/forms';


@NgModule({
    imports: [
        CommonModule,
        LoginRoutingModule,
        ReactiveFormsModule,
        FormsModule
    ],
    declarations: [LoginComponent]
})
export class LoginModule {}
