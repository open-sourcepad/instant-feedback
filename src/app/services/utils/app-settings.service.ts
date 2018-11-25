import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';


@Injectable()
export class AppSettings {

  public currentSettings = new BehaviorSubject(this.initialState());

  public set(setting) {
    this.currentSettings.next(setting)
  }

  public initialState () {
    return {loggedIn: false, isManager: false}
  }

  public reset() {
    this.currentSettings.next(this.initialState());
  }

  public toggleSetting(state) {
    let current = this.currentSettings.getValue();
    current[state] = !current[state];
    this.currentSettings.next(current);
  }

}
