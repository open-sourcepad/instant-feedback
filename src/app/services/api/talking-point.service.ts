import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from '../utils/http.service';
import { BaseService } from './base.service';
import { environment } from '../../../environments/environment';

const ENDPOINT = `${environment.api_url}/api/meeting_topics`;

@Injectable()
export class TalkingPointService extends BaseService {

  constructor(
    public http: HttpService
  ) {
    super(http, ENDPOINT);
  }

  myTopics(){
    return this.http.get(`${this.apiEndpoint}/my_default_topics`);
  }

  addDefaultTopic(payload){
    return this.http.post(`${this.apiEndpoint}/create_default_topic`, payload);
  }
}
