import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'discuss-multi-form',
  templateUrl: './discuss-multi-form.component.pug',
  styleUrls: ['./discuss-multi-form.component.scss']
})
export class DiscussMultiFormComponent implements OnInit {

  @Input() discussions;

  idx: number = 0;

  constructor() { }

  ngOnInit() {
  }

}
