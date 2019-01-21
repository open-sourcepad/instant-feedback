import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormArray, FormGroup, Validators } from '@angular/forms';
import { MyMeetingService, TalkingPointService, SessionService } from '../../../services/api';
import { PaginationInstance } from 'ngx-pagination';
import { MeetingTopic, User } from 'src/app/models';

@Component({
  selector: 'app-manager-meetings',
  templateUrl: './manager-meetings.component.pug',
  styleUrls: ['./manager-meetings.component.scss']
})

export class ManagerMeetingsComponent implements OnInit {

  loading: boolean = false;
  submitted: boolean = false;
  submitUpdated: boolean = false;
  meetings: any = [];
  defaultQuestions: any = [];
  recordCount: number = 0;
  orderParams: any = {set_schedule: 'desc'};
  currentUser: User;
  editIndex: number;
  editObj: any;

  questionForm: FormGroup;
  addQuestionForm: FormGroup;

  paginationControls: PaginationInstance = {
    id: 'paginationResults',
    itemsPerPage: 10,
    currentPage: 1,
    totalItems: 0
  }

  constructor(
    private fb: FormBuilder,
    private myMeetingApi: MyMeetingService,
    private topicApi: TalkingPointService,
    private session: SessionService
  ) { }

  get questions() { return <FormArray>this.questionForm.controls['questions']; }
  get f() { return this.addQuestionForm.controls; }

  ngOnInit() {
    this.currentUser = new User(this.session.getCurrentUser());
    //existing questions
    this.questionForm = this.fb.group({
      questions: this.fb.array([])
    });

    //add new question
    this.addQuestionForm = this.createQuestionForm();

    this.loadMeetings();
    this.loadTopics();
  }

  createQuestionForm(){
    return this.fb.group({
      id: [''],
      question: ['', Validators.required],
      user_id: [null, Validators.required] 
    })
  }

  loadMeetings() {
    let pageParams = {
      number: this.paginationControls['currentPage'],
      size: this.paginationControls['itemsPerPage']
    };

    this.myMeetingApi.search({order: this.orderParams, page: pageParams}).subscribe(res => {
      this.loading = false;
      this.meetings = res['collection']['data'];
      this.paginationControls['totalItems'] = res['metadata']['record_count'];
    }, err => {
      this.loading = false;
    });
  }

  loadTopics() {
    this.loading = true;
    this.topicApi.myTopics().subscribe(res => {
        this.loading = false;
        res['collection']['data'].forEach( x => {
          var obj = new MeetingTopic(x);
          this.questions.push(obj.setForm(this.createQuestionForm()));
        });
      }, err => {
        this.loading = false;
      });
  }

  editQuestion(obj,idx) {
    var prevIdx = this.editIndex;
    if(prevIdx) {
      debugger;
      this.questions.controls[prevIdx].get('question').setValue(this.editObj.question);
    }
    this.editObj = obj;
    this.editIndex = idx;
    this.submitUpdated = false;
  }

  submitQuestion(values) {
    this.loading = true;
    this.submitted = true;

    if(values.question.trim() == '') this.f.question.setValue('');
    if(this.addQuestionForm.invalid) {
      this.loading = false;
      return;
    }

    this.topicApi.create(values).subscribe(res => {
      var obj = new MeetingTopic(res['data']);
      this.questions.push(obj.setForm(this.createQuestionForm()));
      this.addQuestionForm = this.createQuestionForm();      
      this.loading = false;
      this.submitted = false;
    }, err => {
      this.loading = false;
    });
  }

  updateQuestion(values){
    this.loading = true;
    this.submitUpdated = true;

    if(values.question.trim() == ''){
      this.loading = false;
    }else {
      this.topicApi.update(values.id, values).subscribe(res => {
          this.loading = false;
          this.submitUpdated = false;
          this.editIndex = null;
          this.editObj = null;
        }, err => {
          this.loading = false;
        });
    }
    return false;
  }

  removeQuestion(values, idx) {
    this.loading = true;

    this.topicApi.destroy(values.id).subscribe(res => {
      this.loading = false;
      this.questions.removeAt(idx);
    }, err =>{
      this.loading = false;
    });
  }
}
