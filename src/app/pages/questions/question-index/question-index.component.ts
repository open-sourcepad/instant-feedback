import { Component, OnInit } from '@angular/core';
import { QuestionService } from '../../../services/api'
import * as moment from 'moment-timezone';
import { PaginationInstance } from 'ngx-pagination';

@Component({
  selector: 'app-question-index',
  templateUrl: './question-index.component.pug',
  styleUrls: ['./question-index.component.scss']
})
export class QuestionIndexComponent implements OnInit {

  questions = [];
  loading = false;
  errorMsg = '';

  paginationControls: PaginationInstance = {
    id: 'questionResults',
    itemsPerPage: 20,
    currentPage: 1,
    totalItems: 0
  }


  constructor(
    private questionApi: QuestionService
  ) { }

  ngOnInit() {
    this.loadQuestions();
  }

  loadQuestions() {
    this.loading = true;
    let pageParams = {
      number: this.paginationControls['currentPage'],
      size: this.paginationControls['itemsPerPage']
    }
    this.questionApi.query({page: pageParams})
      .subscribe(res => {
        this.loading = false;
        this.questions = res['collection']['data'];
        this.paginationControls['totalItems'] = res['metadata']['record_count'];
      }, err => {
        this.loading = false;
      });
  }

  formatTime(val){
    return moment(val).tz('EST').format('hh:mm A');
  }

  remove(question_id, idx) {
    this.loading = true;
    this.questionApi.destroy(question_id)
      .subscribe( res => {
        this.loading = false;
        this.questions.splice(idx, 1);
      }, err => {
        this.loading = false;
        this.errorMsg = `Row ${idx + 1} question cannot be deleted`;
      });
  }

  pageChange(evt) {
    this.paginationControls['currentPage'] = evt;
    this.loadQuestions();
  }
}
