import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs';


@Injectable()
export class CommonService {

  extractData(response: Response) {
    return response || { };
  }

  handleError (error: Response | any) {
    return Observable.throw(error);
  }

}
