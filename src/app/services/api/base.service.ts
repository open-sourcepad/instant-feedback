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
      if (!value) {
        continue;
      }
      if (Array.isArray(value)) {
        let payloadArr = [];
        for (let val of value) {
          if (val instanceof Object) {
            payloadArr.push(this.encodeObject(val, item));
          }else {
            payloadArr.push(`${item}[]=${encodeURIComponent(val)}`);
          }
        }
        payload = payloadArr.join("&");
      } else if(value instanceof Object){
        let payloadArr = [];
        let keys = Object.keys(value);
        for(let key of keys) {
          if (!value[key]) {
            continue;
          }
          if (value[key] instanceof Object) {
            if (Array.isArray(value[key])) {
              for(let val of value[key]) {
                payloadArr.push(`${item}[${key}][]=${encodeURIComponent(val)}`);
              }
            } else {
              let objKeys = Object.keys(value[key]);
              for(let k of objKeys) {
                payloadArr.push(`${item}[${key}[${k}]]=${encodeURIComponent(value[key][k])}`);
              }
            }
          }else {
            payloadArr.push(`${item}[${key}]=${encodeURIComponent(value[key])}`);
          }
          
        }
        payload = payloadArr.join("&");
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

  private encodeObject(query, arrKey) {
    let payload = '';
    let params = [];
    
    let keys = Object.keys(query);
    for (let item of keys) {
      let value = query[item];
      params.push(`${arrKey}[][${item}]=${encodeURIComponent(value)}`);
    }
    return params.join("&");

  }

}
