import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from '../utils/http.service';
import { BaseService } from './base.service';
import { environment } from '../../../environments/environment';

const ENDPOINT = `${environment.api_url}/api/feedbacks`;

@Injectable()
export class FeedbackService extends BaseService {

  constructor(
    public http: HttpService
  ) {
    super(http, ENDPOINT);
  }

  batchCreate(payload: Object): any {
    return this.http.post(`${this.apiEndpoint}/batch_create`, payload);
  }
}
