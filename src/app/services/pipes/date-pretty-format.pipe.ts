import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({ name: 'datePrettyFormat' })
export class datePrettyFormat implements PipeTransform {
  transform(value: string): string {

    let momentDate = moment(value);
    let dateFormat = '';
    if(momentDate.isSame(moment().startOf('day'), 'd')) {
      dateFormat = momentDate.fromNow();
    }else if(momentDate.isSame(moment().subtract(1, 'days').startOf('day'), 'd')) {
      dateFormat = 'Yesterday';
    }else {
      dateFormat = momentDate.format('MMMM D');
    }
    return dateFormat;

  }
}