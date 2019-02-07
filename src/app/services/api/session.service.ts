import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from '../utils/http.service';
import { environment } from '../../../environments/environment';
import { BehaviorSubject } from 'rxjs';
import { LocalStorage } from '../utils/local-storage.service';
import { User } from '../../models';

@Injectable()
export class SessionService {
  public apiEndpoint = `${environment.api_url}/api/sessions`;
  public currentUser = new BehaviorSubject<User>(new User());
  public defaultApiKey = new BehaviorSubject("");
  constructor(
    private storage: LocalStorage,
    private router: Router,
    private http: HttpService) {}

  getCurrentUser(): any {
    return this.storage.getObject('currentUser');
  }

  login(payload: any): any {
    return this.http.post(this.apiEndpoint, payload, true);
  }

  setSession(user: any): void {
    this.storage.set('currentUser', JSON.stringify(user));
    this.currentUser.next(user);
  }

  getSession(){
    let user = this.getCurrentUser();
    this.currentUser.next(user);
  }

  logout(): any {
    return this.http.delete(this.apiEndpoint);
  }

  clearSession(): void {
    this.storage.clear();
    this.router.navigate(['login']);
  }

  isLogged() {
    return this.storage.getObject('currentUser') != null;
  }

}
