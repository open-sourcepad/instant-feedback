import { Component, OnInit } from '@angular/core';
import { AnswerService, QuestionService } from '../../services/api'

@Component({
  selector: 'app-responses',
  templateUrl: './responses.component.pug',
  styleUrls: ['./responses.component.scss']
})
export class ResponsesComponent implements OnInit {

  questions: any;
  answers = ['All', 'Happy', 'Sad', 'X', 'Idle'];
  users = ['All', 'Yana V'];
  loading = false;
  collection = [];
  recordCount = 0;
  recordShownCount;
  queryParams;
  page = {number: 1, size: 10};

  constructor(
    private answerApi: AnswerService,
    private questionApi: QuestionService
  ) { }

  ngOnInit() {
    this.loadQuestions();
  }

  search(queryParams) {
    if (queryParams instanceof Event) {return;}
    this.queryParams = queryParams;
    queryParams['page'] = this.page;

    this.answerApi.query({query: queryParams})
      .subscribe(res => {
        this.collection = res['collection']['data'];
        this.recordCount = res['metadata']['record_count'];
        this.calculateShownCount();
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

  changePage(evt) {
    console.log(evt);
    this.page['number'] = evt;
    this.search(this.queryParams);
  }

  calculateShownCount(){
    var totalPages = Math.ceil(this.recordCount / this.page['size']);
    var count = this.page['number'] * this.page['size'];
    if(this.page['number'] == 1 && this.recordCount < this.page['size']) {
      this.recordShownCount = `${this.page['number']}-${this.recordCount}`;
    }else if(this.page['number'] == totalPages ) {
      let endRange = (count - this.page['size']) + this.collection.length;
      this.recordShownCount = `${(count - 9)}-${endRange}`;
    }else {
      this.recordShownCount = `${(count - 9)}-${count}`;
    }
  }

}