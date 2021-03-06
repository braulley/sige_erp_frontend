import { PageService } from './layout/page/page.service';
import { DataService } from './data/data.service';
import { Data } from './data/data';

import { AuthService } from './auth/auth.service';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { AuthGuard } from './shared';

const routes: Routes = [
    { path: '', loadChildren: './login/login.module#LoginModule' },
    { path: 'layout', loadChildren: './layout/layout.module#LayoutModule', canActivate: [AuthGuard], canActivateChild: [AuthGuard] },
    { path: 'signup', loadChildren: './signup/signup.module#SignupModule', canActivate: [AuthGuard], canActivateChild: [AuthGuard] },
    { path: 'error', loadChildren: './server-error/server-error.module#ServerErrorModule' },
    { path: 'access-denied', loadChildren: './access-denied/access-denied.module#AccessDeniedModule' },
    { path: 'not-found', loadChildren: './not-found/not-found.module#NotFoundModule' },
    { path: '**', redirectTo: 'not-found' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers: [ AuthService , DataService, Data, PageService]
})
export class AppRoutingModule {}
