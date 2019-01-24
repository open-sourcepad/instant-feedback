import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from '../utils/http.service';
import { BaseService } from './base.service';
import { environment } from '../../../environments/environment';

const ENDPOINT = `${environment.api_url}/api/meetings`;

@Injectable()
export class MeetingService extends BaseService {

  constructor(
    public http: HttpService
  ) {
    super(http, ENDPOINT);
  }

  search(query) {
    return this.http.get(`${ENDPOINT}/search?${this.buildParams(query)}`);
  }

  removeEmployeeActionItems(id) {
    return this.http.delete(`${this.apiEndpoint}/${id}/remove_employee_action_items`);
  }

  start(id){
    return this.http.get(`${this.apiEndpoint}/${id}/start`);
  }
}