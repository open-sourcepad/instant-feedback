import { Component, OnInit } from '@angular/core';
import { QuestionService } from '../../../services/api'

@Component({
  selector: 'app-question-index',
  templateUrl: './question-index.component.pug',
  styleUrls: ['./question-index.component.scss']
})
export class QuestionIndexComponent implements OnInit {

  questions = [];

  constructor(
    private questionApi: QuestionService
  ) { }

  ngOnInit() {
    this.loadQuestions();
  }

  loadQuestions() {
    this.questionApi.query({})
      .subscribe(res => {
        this.questions = res['collection']['data'];
      });
  }

}
