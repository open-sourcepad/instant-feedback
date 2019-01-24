import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormArray, FormGroup, Validators } from '@angular/forms';
import { MyMeetingService, TalkingPointService, SessionService } from '../../../services/api';
import { PaginationInstance } from 'ngx-pagination';
import { MeetingTopic, User } from 'src/app/models';
import * as moment from 'moment';

@Component({
  selector: 'app-manager-meetings',
  templateUrl: './manager-meetings.component.pug',
  styleUrls: ['./manager-meetings.component.scss']
})

export class ManagerMeetingsComponent implements OnInit {

  loading: any = {meetings: false, topics: false};
  submitted: boolean = false;
  submitUpdated: boolean = false;
  meetings: any = [];
  defaultQuestions: any = [];
  recordCount: number = 0;
  orderParams: any = {scheduled_at: 'desc'};
  currentUser: User;
  editIndex: number;
  editObj: any;

  questionForm: FormGroup;
  addQuestionForm: FormGroup;
  searchForm: FormGroup;

  paginationControls: PaginationInstance = {
    id: 'paginationResults',
    itemsPerPage: 10,
    currentPage: 1,
    totalItems: 0
  }


  //daterangepicker options
  options: any = {
    locale: {
      format: 'YYYY/MM/DD',
      monthNames: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
      ]
    },
    alwaysShowCalendars: false,
    autoApply: true,
    autoUpdateInput: true,
    opens: 'left',
    startDate: moment().startOf('year').format('YYYY/MM/DD 00:00:00'),
    endDate: moment().endOf('year').format('YYYY/MM/DD 23:59:59')
  };

  constructor(
    private fb: FormBuilder,
    private myMeetingApi: MyMeetingService,
    private topicApi: TalkingPointService,
    private session: SessionService
  ) { }

  get questions() { return <FormArray>this.questionForm.controls['questions']; }
  get questionformData() { return this.questionForm.get('questions')['controls']; }
  get f() { return this.addQuestionForm.controls; }
  get filters() { return this.searchForm.controls; }

  ngOnInit() {
    this.currentUser = new User(this.session.getCurrentUser());
    //existing questions
    this.questionForm = this.fb.group({
      questions: this.fb.array([])
    });

    //add new question
    this.addQuestionForm = this.createQuestionForm();

    //search form filters
    this.searchForm = this.fb.group({
      date_since: [this.options.startDate],
      date_until: [this.options.endDate],
      username: ['']
    });

    this.searchMeetings(this.searchForm.value);
    this.loadTopics();
  }

  createQuestionForm(){
    return this.fb.group({
      id: [null],
      question: ['', Validators.required],
      user_id: [this.currentUser.id, Validators.required] 
    })
  }

  searchMeetings(values) {
    this.loading['meetings'] = true;
    let params = values;
    params['page'] = {
      number: this.paginationControls['currentPage'],
      size: this.paginationControls['itemsPerPage']
    };
    params['order'] = this.orderParams;

    this.myMeetingApi.search(params).subscribe(res => {
      this.loading['meetings'] = false;
      this.meetings = res['collection']['data'];
      this.paginationControls['totalItems'] = res['metadata']['record_count'];
    }, err => {
      this.loading['meetings'] = false;
    });

    return false;
  }

  loadTopics() {
    this.loading['topics'] = true;
    this.topicApi.myTopics().subscribe(res => {
        this.loading['topics'] = false;
        res['collection']['data'].forEach( x => {
          var obj = new MeetingTopic(x);
          this.questions.push(obj.setForm(this.createQuestionForm()));
        });
      }, err => {
        this.loading['topics'] = false;
      });
  }

  editQuestion(obj,idx) {
    var prevIdx = this.editIndex;
    if(prevIdx) {
      this.questions.controls[prevIdx].get('question').setValue(this.editObj.question);
    }
    this.editObj = obj;
    this.editIndex = idx;
    this.submitUpdated = false;
  }

  submitQuestion(values) {
    this.loading['topics'] = true;
    this.submitted = true;

    if(values.question.trim() == '') this.f.question.setValue('');
    if(this.addQuestionForm.invalid) {
      this.loading['topics'] = false;
      return;
    }

    this.topicApi.addDefaultTopic(values).subscribe(res => {
      var obj = new MeetingTopic(res['data']);
      this.questions.push(obj.setForm(this.createQuestionForm()));
      this.addQuestionForm = this.createQuestionForm();      
      this.loading['topics'] = false;
      this.submitted = false;
    }, err => {
      this.loading['topics'] = false;
    });
  }

  updateQuestion(values){
    this.loading['topics'] = true;
    this.submitUpdated = true;

    if(values.question.trim() == ''){
      this.loading = false;
    }else {
      this.topicApi.update(values.id, values).subscribe(res => {
          this.loading['topics'] = false;
          this.submitUpdated = false;
          this.editIndex = null;
          this.editObj = null;
        }, err => {
          this.loading['topics'] = false;
        });
    }
    return false;
  }

  removeQuestion(values, idx) {
    this.loading['topics'] = true;

    this.topicApi.destroy(values.id).subscribe(res => {
      this.loading['topics'] = false;
      this.questions.removeAt(idx);
    }, err =>{
      this.loading['topics'] = false;
    });
  }

  selectedDate(value: any, datepicker?: any) {
    if(datepicker){
      datepicker.start = value.start;
      datepicker.end = value.end;
    }

    this.searchForm.patchValue({
      date_since: moment(value.start).format('YYYY/MM/DD 00:00:00'),
      date_until: moment(value.end).format('YYYY/MM/DD 23:59:59')
    });

    this.searchMeetings(this.searchForm.value);
  }

  changeOrder(key, val){
    let key_exists = Object.keys(this.orderParams).some(k => k == key);
    if(key_exists){
      this.orderParams[key] = val;
    } else {
      this.orderParams = {};
      this.orderParams[key] = val;
    }

    this.searchMeetings(this.searchForm.value);
  }

  pageChange(evt) {
    this.paginationControls['currentPage'] = evt;
    this.searchMeetings(this.searchForm.value);
  }
}
