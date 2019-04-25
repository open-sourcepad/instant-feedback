import { Component, OnInit } from '@angular/core';
import { AnswerService, QuestionService, UserService } from '../../services/api'
import {PaginationInstance} from 'ngx-pagination';

@Component({
  selector: 'app-responses',
  templateUrl: './responses.component.pug',
  styleUrls: ['./responses.component.scss']
})
export class ResponsesComponent implements OnInit {
  paginationControls: PaginationInstance = {
    id: 'paginationResults',
    itemsPerPage: 20,
    currentPage: 1,
    totalItems: 0
  }

  questions: any;
  answers = ['None', 'Happy', 'Not Happy', 'X', 'Idle'];
  users: any = [ {id: '', display_name: 'None'} ];
  loading = false;
  collection = [];
  recordShownCount;
  recordAnswerSummary;
  queryParams = {page:
    {
      number: this.paginationControls['currentPage'],
      size: this.paginationControls['itemsPerPage']
    }
  };
  order: any = {answered_at: 'desc'};

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
    queryParams['order'] = this.order;
    this.paginationControls['currentPage'] = this.queryParams['page']['number'];

    this.answerApi.query({query: queryParams})
      .subscribe(res => {
        this.collection = res['collection']['data'];
        this.paginationControls['totalItems'] = res['metadata']['record_count'];
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
        for(let user of res['collection']['data']){
          this.users.push(user);
        }
      });
  }

  loadQuestions() {
    this.questionApi.getMainQuestions()
      .subscribe(res => {
        this.questions = res['collection']['data'].map(question => {
          return question.category;
        });
        this.questions.unshift('None');
      });
  }

  changePage(evt) {
    this.queryParams['page']['number'] = evt;
    this.search(this.queryParams);
  }

  calculateShownCount(){
    var totalPages = Math.ceil(this.paginationControls['totalItems'] / this.paginationControls['itemsPerPage']);
    var count = this.paginationControls['currentPage'] * this.paginationControls['itemsPerPage'];

    if(this.paginationControls['currentPage'] == 1 && this.paginationControls['totalItems'] == 0) {
      this.recordShownCount = `0-${this.paginationControls['totalItems']}`;
    }else if(this.paginationControls['currentPage'] == 1 && this.paginationControls['totalItems'] < this.paginationControls['itemsPerPage']) {
      this.recordShownCount = `${this.paginationControls['currentPage']}-${this.paginationControls['totalItems']}`;
    }else if(this.paginationControls['currentPage'] == totalPages ) {
      let endRange = (count - this.paginationControls['itemsPerPage']) + this.collection.length;
      this.recordShownCount = `${(count - 19)}-${endRange}`;
    }else {
      this.recordShownCount = `${(count - 19)}-${count}`;
    }
  }

  changeOrder(key, val){
    let key_exists = Object.keys(this.order).some(k => k == key);
    if(key_exists){
      this.order[key] = val;
    } else {
      this.order = {};
      this.order[key] = val;
    }
    this.search(this.queryParams);
  }

}
