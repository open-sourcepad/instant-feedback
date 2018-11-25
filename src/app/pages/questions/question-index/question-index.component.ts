import { Component, OnInit } from '@angular/core';
import { QuestionService } from '../../../services/api'
import * as moment from 'moment-timezone';

@Component({
  selector: 'app-question-index',
  templateUrl: './question-index.component.pug',
  styleUrls: ['./question-index.component.scss']
})
export class QuestionIndexComponent implements OnInit {

  questions = [];
  loading = false;
  errorMsg = '';

  constructor(
    private questionApi: QuestionService
  ) { }

  ngOnInit() {
    this.loadQuestions();
  }

  loadQuestions() {
    this.loading = true;
    this.questionApi.query({})
      .subscribe(res => {
        this.loading = false;
        this.questions = res['collection']['data'];
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
}
