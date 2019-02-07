import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SessionService } from '../services/api';

@Injectable({
  providedIn: 'root'
})
export class NeedAuthGuard implements CanActivate {

  constructor(
    private session: SessionService,
    private router: Router
  ) { }

  canActivate(route: ActivatedRouteSnapshot) {
      const redirectUrl = route['_routerState']['url'];

      if (this.session.isLogged()) {
        return true;
      }

      this.router.navigateByUrl(
        this.router.createUrlTree(
          ['/login'], {
            queryParams: {
              redirectUrl
            }
          }
        )
      );

      return false;
    }
}
