import { Component, OnInit } from '@angular/core';
import { AnswerService } from '../../services/api'

@Component({
  selector: 'app-responses',
  templateUrl: './responses.component.pug',
  styleUrls: ['./responses.component.scss']
})
export class ResponsesComponent implements OnInit {

  questions = ['All', 'Team This Week', 'Amount of Tasks', 'Scrum Today', 'Mental Health', 'Growth Trajectory'];
  answers = ['All', 'Happy', 'Sad', 'No Answer - X', 'No Answer - Idle'];
  users = ['All', 'Yana V'];
  loading = false;
  collection = [];
  page = {number: 1, size: 1};

  constructor(private answerApi: AnswerService) { }

  ngOnInit() {
  }

  search(queryParams) {
    if (queryParams instanceof Event) {return;}
    queryParams['page'] = this.page;

    this.answerApi.query({query: queryParams})
      .subscribe(res => {
        this.collection = res['collection']['data'];
        this.loading = false;
      }, err => {
        this.loading = false;
      });
  }

}