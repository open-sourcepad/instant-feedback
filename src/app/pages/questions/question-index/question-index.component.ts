import { Component, OnInit } from '@angular/core';
import { QuestionService } from '../../../services/api'

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
    this.questionApi.query({})
      .subscribe(res => {
        this.questions = res['collection']['data'];
      });
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
