import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { trigger, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'modal',
  templateUrl: './modal.component.pug',
  styleUrls: ['./modal.component.scss'],
  animations: [
    trigger('openModal', [
      transition('void => *', [
        style({ transform: 'scale3d(.3, .3, .3)' }),
        animate(150)
      ]),
      transition('* => void', [
        animate(150, style({ transform: 'scale3d(.0, .0, .0)' }))
      ])
    ])
  ]
})
export class ModalComponent implements OnInit {

  @Input() visible;
  @Input() currentSession;
  @Input() modalText;
  @Input() buttons;
  @Output() modalStateChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() removeItems: EventEmitter<object> = new EventEmitter<object>();

  constructor() { }

  ngOnInit() {
  }

  onCancel() {
    this.modalStateChange.emit(false);
  }

  onConfirm() {
    this.modalStateChange.emit(false);
    if(this.currentSession) this.removeItems.emit(this.currentSession);
  }

}
