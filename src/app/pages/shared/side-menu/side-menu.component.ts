import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'side-menu',
  templateUrl: './side-menu.component.pug',
  styleUrls: ['./side-menu.component.scss'],
  animations: [
    trigger('slideInOut', [
      state('in', style({
        transform: 'translate3d(0, 0, 0)'
      })),
      state('out', style({
        transform: 'translate3d(100%, 0, 0)'
      })),
      transition('in => out', animate('400ms ease-in-out')),
      transition('out => in', animate('400ms ease-in-out'))
    ])
  ]
})
export class SideMenuComponent implements OnInit {

  @Input() menuState;
  @Input() feedbackState;
  @Output() cancel = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {
  }

  onCancel() {
    this.cancel.emit('out');
  }

}
