import { Component, OnInit } from '@angular/core';
import { AnswerService, QuestionService } from '../../services/api'

@Component({
  selector: 'app-responses',
  templateUrl: './responses.component.pug',
  styleUrls: ['./responses.component.scss']
})
export class ResponsesComponent implements OnInit {

  questions: any;
  answers = ['All', 'Happy', 'Sad', 'No Answer - X', 'No Answer - Idle'];
  users = ['All', 'Yana V'];
  loading = false;
  collection = [];
  page = {number: 1, size: 20};

  constructor(
    private answerApi: AnswerService,
    private questionApi: QuestionService
  ) { }

  ngOnInit() {
    this.loadQuestions();
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

  loadQuestions() {
    this.questionApi.query({})
      .subscribe(res => {
        this.questions = res['collection']['data'].map(question => {
          return question.category;
        });
        this.questions.unshift('All');
      });
  }

}