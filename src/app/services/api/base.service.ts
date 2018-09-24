import { Injectable } from '@angular/core';
import { HttpService } from '../utils/http.service';
import { Observable } from 'rxjs';
import { CommonService } from '../utils/common.service';

@Injectable()
export class BaseService {

  public apiEndpoint: String;

  constructor(
    public http: HttpService,
    public url: string
  ) {
    this.apiEndpoint = url;
  }

  update(id, payload: Object): any {
    return this.http.patch(`${this.apiEndpoint}/${id}`, payload);
  }

  get(id): any {
    return this.http.get(`${this.apiEndpoint}/${id}`);
  }

  query(query: Object): any {
    return this.http.get(`${this.apiEndpoint}?${this.buildParams(query)}`);
  }

  buildParams(query: Object): any {
    let paramsArray = [];
    let payload = "";
    let keys = Object.keys(query);
    for (let item of keys) {
      let value = query[item];
      if (value == null) {
        continue;
      }
      if (Array.isArray(value)) {
        let payloadArr = [];
        for (let val of value) {
          payloadArr.push(`${item}[]=${encodeURIComponent(val)}`);
        }
        payload = payloadArr.join("&");
        console.log(payload);
      } else {
        payload = item+"="+encodeURIComponent(value);
      }
      paramsArray.push(payload);
    }
    return paramsArray.join("&");
  }

  create(payload: Object): any {
    return this.http.post(this.apiEndpoint, payload);
  }

  destroy(id: number, payload: Object): any {
   return this.http.delete(`${this.apiEndpoint}/${id}`);
  }

}
