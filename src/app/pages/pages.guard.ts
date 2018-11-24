import { CanActivate, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { SessionService } from '../services/api';

@Injectable()
export class PagesGuard implements CanActivate {

  constructor(
    private sessionService: SessionService,
    private router: Router,
  ) {
  }

  canActivate() {
    if (!!this.sessionService.getCurrentUser()) {
      this.router.navigate(['/dashboard']);
      return false;
    } else {
      return true;
    }
  }
}
