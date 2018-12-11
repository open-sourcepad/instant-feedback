import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from '../utils/http.service';
import { BaseService } from './base.service';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { map, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';


const ENDPOINT = `${environment.api_url}/api/users`;

@Injectable()
export class UserService extends BaseService {

  constructor(
    public http: HttpService
  ) {
    super(http, ENDPOINT);
  }

  searchNames(terms: Observable<string>) {
    return terms.pipe(debounceTime(400))
      .pipe(distinctUntilChanged())
      .pipe(switchMap(term => this.query({name: term})));
  }

  getSpecificUser(params) {
    return this.http.get(`${ENDPOINT}/get_specific_user?${this.buildParams(params)}`);
  }

  meetings() {
    return this.http.get(`${ENDPOINT}/meetings`);
  }
}
