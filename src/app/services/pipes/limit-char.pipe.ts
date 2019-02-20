import { Pipe, PipeTransform } from '@angular/core';
@Pipe({ name: 'limitChar' })
export class limitChar implements PipeTransform {
  transform(value: string, charLim: number = 200): string {

    let strLen = value.length;
    let str = value;
    
    if(strLen > 200){
      str = value.slice(0,charLim).concat('...');
    }

    return str;

  }
}