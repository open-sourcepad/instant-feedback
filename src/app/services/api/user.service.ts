import { Injectable } from '@angular/core';
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

  meetings(user_id, query) {
    return this.http.get(`${ENDPOINT}/${user_id}/meetings?${this.buildParams(query)}`);
  }

  showMeeting(user_id, id, query={order: {scheduled_at: 'desc'}}) {
    return this.http.get(`${ENDPOINT}/${user_id}/meetings/${id}?${this.buildParams(query)}`);
  }

  remove_action_items(user_id, id) {
    return this.http.delete(`${ENDPOINT}/${user_id}/meetings/${id}/remove_objectives`);
  }

  feedbacks(user_id, query) {
    return this.http.get(`${ENDPOINT}/${user_id}/feedbacks?${this.buildParams(query)}`);
  }

  teamPulse(user_id, query) {
    return this.http.get(`${ENDPOINT}/${user_id}/my_team_pulse?${this.buildParams(query)}`);
  }
}
