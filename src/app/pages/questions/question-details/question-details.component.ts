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

  //daterangepicker options
  datepickeroptions: any = {
    locale: {
      format: 'MM/DD/YYYY',
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
    singleDatePicker: true
  };

  form: FormGroup;
  chosenDate = moment().format("YYYY-MM-DD 00:00:00");
  chosenDay = moment().format("D MMMM YYYY");
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
    this.userService.searchNames(this.searchUserTerm$)
      .subscribe(
        res => {
          this.users = res['collection']['data'];
          this.showSuggestion = !!this.searchUserTerm$;
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
    let hour = this.form.get('chosenHour').value;
    let minute = this.form.get('chosenMinute').value;
    this.chosenDate = moment(this.chosenDate).format(`YYYY-MM-DD ${hour}:${minute}:00`);
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
        }
      }, err => {
        this.errorMsg.addUser = "User not found";
      });
  }

  removeUser(idx){
    this.recipients.splice(idx, 1);
  }

  save(){
    this.loading = true;
    let params = {
      question: this.form.value,
      user_question: {
        asking_date: this.form.get('chosenDay').value,
        asking_time: this.chosenDate,
        user_ids: this.recipients.map( recipient => recipient.id)
      }
    };
    if(this.isUpdate) {
      this.questionService.update(this.slug_id, params).subscribe( res => {
        this.loading = false;
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
          this.form.get('message').setValue(this.currentObj['message']);
          this.form.get('recipient_type').setValue(this.currentObj['recipient_type']);
          let momentDate= moment(this.currentObj['asking_time']).tz('EST');
          this.chosenDate = momentDate.format(`D MMMM YYYY hh:mm:00`);
          this.chosenDay = momentDate.format(`D MMMM YYYY`);
          this.form.get('chosenDay').setValue(this.chosenDay);  
          this.form.get('chosenHour').setValue(momentDate.hour());  
          this.form.get('chosenMinute').setValue(momentDate.minute());  
          this.recipients = this.currentObj['recipients'];
          this.isUpdate = true;
        }
      );
  }

}
