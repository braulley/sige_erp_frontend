import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { Observable } from 'rxjs/Observable';


@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router) {}

    canActivate( route: ActivatedRouteSnapshot, state: RouterStateSnapshot ): Observable<boolean>|Promise<boolean>|boolean {
        if (this.authService.check()) {
          return true;
        }
        this.router.navigate(['']);
        return false;
    }

    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
        if (this.authService.check()) {
          return true;
        }
        this.router.navigate(['']);
        return false;
      }

}
