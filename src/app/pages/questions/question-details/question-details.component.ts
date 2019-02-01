import { Component, OnInit } from '@angular/core';
import { FormGroup,  FormBuilder,  Validators } from '@angular/forms';
import * as moment from 'moment-timezone';

import { UserService, QuestionService } from '../../../services/api';
import { Subject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-question-details',
  templateUrl: './question-details.component.pug',
  styleUrls: ['./question-details.component.scss']
})
export class QuestionDetailsComponent implements OnInit {

  chosenDate = moment().add(1, 'days').format("YYYY-MM-DD 00:00:00");
  formatedDate = new Date(this.chosenDate.replace(/-/g, "/"));
  chosenDay = moment(this.chosenDate).format('D MMMM YYYY');
  //daterangepicker options
  datepickeroptions: any = {
    locale: {
      format: 'D MMMM YYYY',
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
    singleDatePicker: true,
    startDate: this.chosenDay,
    minDate: this.chosenDay
  };

  form: FormGroup;
  recipientTypes = [
    { value: 'all', label: 'All' },
    { value: 'specific', label: 'Specific' }
  ]
  recipients = [];
  searchUserTerm$ = new Subject<string>();
  searchName = '';
  users = [];
  showSuggestion = false;
  errorMsg = {addUser: '', question: ''};
  hourList = [
    {value: 0, label: '12am'},
    {value: 1, label: '01am'},
    {value: 2, label: '02am'},
    {value: 3, label: '03am'},
    {value: 4, label: '04am'},
    {value: 5, label: '05am'},
    {value: 6, label: '06am'},
    {value: 7, label: '07am'},
    {value: 8, label: '08am'},
    {value: 9, label: '09am'},
    {value: 10, label: '10am'},
    {value: 11, label: '11am'},
    {value: 12, label: '12pm'},
    {value: 13, label: '01pm'},
    {value: 14, label: '02pm'},
    {value: 15, label: '03pm'},
    {value: 16, label: '04pm'},
    {value: 17, label: '05pm'},
    {value: 18, label: '06pm'},
    {value: 19, label: '07pm'},
    {value: 20, label: '08pm'},
    {value: 21, label: '09pm'},
    {value: 22, label: '10pm'},
    {value: 23, label: '11pm'}
  ]
  minuteList = [];
  loading = false;
  submitted = false;

  //update
  private sub: any;
  slug_id = null;
  currentObj = null;
  isUpdate = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private userService: UserService,
    private questionService: QuestionService
  ) {
    this.searchUserTerm$.subscribe(next => {
      this.searchName = next;
    });
    this.userService.searchNames(this.searchUserTerm$)
      .subscribe(
        res => {
          if(this.recipients.length > 0){
            this.users = res['collection']['data'].filter(d => {
              if(this.recipients.findIndex(x => x.id == d['id']) < 0){
                return d;
              }
            });
          }else {
            this.users = res['collection']['data'];
          }

          if(!this.searchName) this.users = [];
          this.showSuggestion = !!this.searchName;
          this.errorMsg.addUser = "";
        }
      );
    for(let num=0; num <= 60; num++) {
      if(num < 10){
        this.minuteList.push({value: num, label: `0${num}m`})
      }else {
        this.minuteList.push({value: num, label: `${num}m`})
      }
    }
  }

  get f() { return this.form.controls; }

  ngOnInit() {
    this.form = this.fb.group({
      'message': ["", Validators.required],
      'occurence': [1, Validators.required],
      'trigger_schedule': ["once", Validators.required],
      'trigger_action': ["scheduled", Validators.required],
      'category': ["custom", Validators.required],
      'chosenHour': [0, Validators.required],
      'chosenMinute': [0, Validators.required],
      'chosenDay': [this.chosenDay],
      'recipient_type': [this.recipientTypes[0].value, Validators.required]
    });

    this.activeRoute.params.subscribe(params => {
      this.slug_id = +params['id'];

      if(this.slug_id){
        this.loadData(this.slug_id);
      }
    });
    
  }

  selectedDate(value, datepicker=null){
    let hour = this.form.get('chosenHour').value;
    let minute = this.form.get('chosenMinute').value;
    this.chosenDate = value.start.format(`YYYY-MM-DD ${hour}:${minute}:00`);
    this.form.get('chosenDay').setValue(value.start.format('D MMMM YYYY'));
  }

  selectedTime(){
    let hour = +this.form.get('chosenHour').value;
    let minute = +this.form.get('chosenMinute').value;

    let temp = moment(this.chosenDate);
    temp.hour(hour);
    temp.minute(minute);
    this.chosenDate = temp.format('YYYY-MM-DD hh:mm:00');
    this.formatedDate = new Date(this.chosenDate.replace(/-/g, "/"));
  }

  selectUser(user) {
    this.searchName = user;
    this.showSuggestion = false;
    this.users = [];
  }

  addUser(user) {
    this.userService.getSpecificUser({name: user})
      .subscribe(res => {
        if(res['data']){
          this.recipients.push(res['data']);
          this.searchName = '';
          this.searchUserTerm$.next('');
        }
      }, err => {
        this.errorMsg.addUser = "User not found";
      });
  }

  removeUser(idx){
    this.recipients.splice(idx, 1);
  }

  save(){
    this.submitted = true;
    this.loading = true;

    if(this.f.message.value.trim() == '') this.f.message.setValue('');
    if(this.form.invalid || (this.f.recipient_type.value == 'specific' && this.recipients.length < 1)) {
      this.loading = false;
      return;
    }
    let params = {
      question: this.form.value,
      user_question: {
        scheduled_at: this.chosenDate,
        user_ids: this.recipients.map( recipient => recipient.id)
      }
    };

    if(this.isUpdate) {
      this.questionService.update(this.slug_id, params).subscribe( res => {
        this.loading = false;
        this.router.navigate(['/questions']);
      }, err => {
        this.loading = false;
        this.errorMsg.question = "Failed to update question";
      });
    } else{
      this.questionService.create(params).subscribe( res => {
        this.loading = false;
        this.router.navigate(['/questions']);
      }, err => {
        this.loading = false;
        this.errorMsg.question = err.error.errors[0];
      });
    }
  }

  private loadData(slug_id: number) {
    this.questionService.get(slug_id)
      .subscribe(
        res => {
          this.currentObj = res['data'];
          let momentDate= moment(this.currentObj['scheduled_at']).tz('EST');
          this.chosenDate = momentDate.format(`YYYY-MM-DD hh:mm:00`);
          this.formatedDate = new Date(this.chosenDate.replace(/-/g, "/"));
          this.chosenDay = momentDate.format('D MMMM YYYY');
          this.datepickeroptions.startDate = this.chosenDay ;
          this.recipients = this.currentObj['recipients'];
          this.isUpdate = true;

          this.form.patchValue({
            message: this.currentObj['message'],
            recipient_type: this.currentObj['recipient_type'],
            chosenDay: this.chosenDay,
            chosenHour: momentDate.hour(),
            chosenMinute: momentDate.minute()
          });
        }
      );
  }

}
