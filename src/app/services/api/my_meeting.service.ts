import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from '../utils/http.service';
import { BaseService } from './base.service';
import { environment } from '../../../environments/environment';

const ENDPOINT = `${environment.api_url}/api/my_meetings`;

@Injectable()
export class MyMeetingService extends BaseService {

  constructor(
    public http: HttpService
  ) {
    super(http, ENDPOINT);
  }

  search(query) {
    return this.http.get(`${ENDPOINT}/search?${this.buildParams(query)}`);
  }

  profile(id, query={order: {set_schedule: 'desc'}}) {
    return this.http.get(`${ENDPOINT}/${id}?${this.buildParams(query)}`);
  }

}
