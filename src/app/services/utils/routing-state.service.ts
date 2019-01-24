import { Injectable } from '@angular/core';
import { Router, NavigationEnd, RoutesRecognized } from '@angular/router';
import { filter, pairwise } from 'rxjs/operators';

@Injectable()
export class RoutingState {
  private previousUrl = '';
  private sub: any;

  constructor(
    private router: Router
  ) {}

  public loadRouting(): void {
    this.sub = this.router.events
      .pipe(filter((e: any) => e instanceof RoutesRecognized),
          pairwise()
      ).subscribe((e: any) => {
          console.log(e[0].urlAfterRedirects); // previous url
          this.previousUrl = e[0].urlAfterRedirects;
      });
  }
  
  public stopRouting(): void {
    this.sub.unsubscribe();
  }

  public getPreviousUrl(): string {
    return this.previousUrl || null;
  }

  public setPreviousUrl(url) {
    this.previousUrl = url
  }
}