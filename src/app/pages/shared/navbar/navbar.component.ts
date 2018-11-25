import { Component, Output } from '@angular/core';
import { Router } from '@angular/router';
import { SessionService } from '../../../services/api';
import { AppSettings } from '../../../services/utils';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.pug'
})
export class NavbarComponent {

  opened: boolean = false;
  userLogged: boolean = false;
  isManager: boolean = false;

  constructor(
    private router: Router,
    private sessionApi: SessionService,
    private appSetting: AppSettings
  ) { }

  ngOnInit() {
    this.appSetting.currentSettings.subscribe(
      (setting) => {
        this.userLogged = setting['loggedIn'];
        this.isManager = setting['isManager'];
      }
    );
  }

  logout(){
    this.sessionApi.logout().subscribe(
      (data) => {
        this.appSetting.set({loggedIn: false, isManager: false});
        this.userLogged = false;
        this.isManager = false;
        this.sessionApi.clearSession();
      }
    );
  }
}
