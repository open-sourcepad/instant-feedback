import { Component, OnInit } from '@angular/core';
import { AnswerService, QuestionService, UserService } from '../../services/api'
import {PaginationInstance} from 'ngx-pagination';

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
  recordShownCount;
  recordAnswerSummary;
  queryParams;
  order = {name: 'asc', created_at: 'desc'};

  paginationControls: PaginationInstance = {
    id: 'paginationResults',
    itemsPerPage: 20,
    currentPage: 1,
    totalItems: 0
  }

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
    queryParams['page'] = {
      number: this.paginationControls['currentPage'],
      size: this.paginationControls['itemsPerPage']
    };
    queryParams['order'] = this.order;

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
    this.paginationControls['currentPage'] = evt;
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
    this.order[key] = val;
    this.search(this.queryParams);
  }

}