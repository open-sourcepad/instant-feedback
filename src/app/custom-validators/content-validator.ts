import { FormControl } from "@angular/forms";

export class ContentValidator {
  static IsBlank(control : FormControl) {
    let text = control.value;
    if(text && text.trim() == ''){
      return {isBlank: true};
    }
     
    return null;
  }
}