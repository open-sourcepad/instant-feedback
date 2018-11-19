import { Component, OnInit } from '@angular/core';
import { AnswerService, QuestionService, UserService } from '../../services/api'

@Component({
  selector: 'app-responses',
  templateUrl: './responses.component.pug',
  styleUrls: ['./responses.component.scss']
})
export class ResponsesComponent implements OnInit {

  questions: any;
  answers = ['All', 'Happy', 'Sad', 'X', 'Idle'];
  users: any;
  loading = false;
  collection = [];
  recordCount = 0;
  recordShownCount;
  recordAnswerSummary;
  queryParams;
  page = {number: 1, size: 20};
  order = {name: 'asc', created_at: 'desc'};

  constructor(
    private answerApi: AnswerService,
    private questionApi: QuestionService,
    private userApi: UserService
  ) { }

  ngOnInit() {
    this.loadQuestions();
    this.loadUsers();
  }

  search(queryParams) {
    if (queryParams instanceof Event) {return;}
    this.queryParams = queryParams;
    queryParams['page'] = this.page;
    queryParams['order'] = this.order;

    this.answerApi.query({query: queryParams})
      .subscribe(res => {
        this.collection = res['collection']['data'];
        this.recordCount = res['metadata']['record_count'];
        this.recordAnswerSummary = res['metadata']['answer_summary'];
        this.calculateShownCount();
        this.loading = false;
      }, err => {
        this.loading = false;
      });
  }

  loadUsers() {
    this.userApi.query({})
      .subscribe(res => {
        this.users = res['collection']['data'].map(user => {
          return user.display_name;
        });
        this.users.unshift('All');
      });
  }

  loadQuestions() {
    this.questionApi.getMainQuestions()
      .subscribe(res => {
        this.questions = res['collection']['data'].map(question => {
          return question.category;
        });
        this.questions.unshift('All');
      });
  }

  changePage(evt) {
    this.page['number'] = evt;
    this.search(this.queryParams);
  }

  calculateShownCount(){
    var totalPages = Math.ceil(this.recordCount / this.page['size']);
    var count = this.page['number'] * this.page['size'];

    if(this.page['number'] == 1 && this.recordCount == 0) {
      this.recordShownCount = `0-${this.recordCount}`;
    }else if(this.page['number'] == 1 && this.recordCount < this.page['size']) {
      this.recordShownCount = `${this.page['number']}-${this.recordCount}`;
    }else if(this.page['number'] == totalPages ) {
      let endRange = (count - this.page['size']) + this.collection.length;
      this.recordShownCount = `${(count - 19)}-${endRange}`;
    }else {
      this.recordShownCount = `${(count - 19)}-${count}`;
    }
  }

  changeOrder(key, val){
    this.order[key] = val;
    this.search(this.queryParams);
  }

}