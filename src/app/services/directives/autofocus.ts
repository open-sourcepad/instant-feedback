import { Directive, OnInit, ElementRef } from '@angular/core';

@Directive({
  selector: '[autofocus]'
})
export class AutofocusDirective implements OnInit {

  constructor(private el: ElementRef) { };

  ngOnInit(): void {
    this.el.nativeElement.focus();
  }

}
