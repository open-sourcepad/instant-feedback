import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'feedback-menu',
  templateUrl: './feedback-menu.component.pug',
  styleUrls: ['./feedback-menu.component.scss'],
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
export class FeedbackMenuComponent implements OnInit {

  @Input() menuState;
  @Input() feedbackState;
  @Input() form;
  @Output() cancel = new EventEmitter<string>();
  @Output() submitFeedback = new EventEmitter<object>();

  constructor() { }

  ngOnInit() {
  }

}
