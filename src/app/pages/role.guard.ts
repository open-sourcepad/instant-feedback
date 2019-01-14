import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SessionService } from '../services/api';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private session: SessionService, private router: Router) {}
  
  canActivate(route: ActivatedRouteSnapshot) {
    let currentUser = this.session.getCurrentUser();
    if (currentUser && currentUser.is_manager == false) {
      this.router.navigate(['/employee/overview']);
      return false;
    } else {
      if(route.url[0].path == "employee"){
        this.router.navigate(['**']);
        return false;
      }
      return true;
    }
  }
}
