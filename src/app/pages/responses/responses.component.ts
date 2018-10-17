import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-responses',
  templateUrl: './responses.component.pug',
  styleUrls: ['./responses.component.scss']
})
export class ResponsesComponent implements OnInit {

  questions = ['All', 'Team This Week', 'Amount of Tasks', 'Scrum Today', 'Mental Health', 'Growth Trajectory'];
  answers = ['All', 'Happy', 'Sad', 'No Answer - X', 'No Answer - Idle'];

  constructor() { }

  ngOnInit() {
  }

}
