import { Component, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.pug'
})
export class NavbarComponent {

  opened: boolean = false;
  constructor(
    private router: Router
  ) {}

  toggleHamburger(){
  }
}
