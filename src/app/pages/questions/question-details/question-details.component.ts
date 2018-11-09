import { Component, OnInit } from '@angular/core';
import { FormGroup,  FormBuilder,  Validators } from '@angular/forms';
import * as moment from 'moment';

import { UserService } from '../../../services/api';
import { Subject } from 'rxjs';


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
  chosenDate = moment().format("D MMMM YYYY 00:00:00");
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
  errorMsg = {addUser: ''};
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

  constructor(
    private fb: FormBuilder,
    private userService: UserService
  ) {
    this.userService.searchNames(this.searchUserTerm$)
      .subscribe(
        res => {
          this.users = res['collection']['data'];
          this.showSuggestion = !!this.searchUserTerm$;
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
      'chosenHour': [0, Validators.required],
      'chosenMinute': [0, Validators.required],
      'chosenDay': [this.chosenDay],
      'recipientType': [this.recipientTypes[0].value, Validators.required]
    });
  }

  selectedDate(value, datepicker=null){
    let hour = this.form.get('chosenHour').value;
    let minute = this.form.get('chosenMinute').value;
    this.chosenDate = value.start.format(`D MMMM YYYY ${hour}:${minute}:00`);
    this.form.get('chosenDay').setValue(value.start.format('D MMMM YYYY'));
  }

  selectedTime(){
    let hour = this.form.get('chosenHour').value;
    let minute = this.form.get('chosenMinute').value;
    this.chosenDate = moment(this.chosenDate).format(`D MMMM YYYY ${hour}:${minute}:00`);
  }

  selectUser(user) {
    this.searchName = user;
    this.users = [];
  }

  addUser(user) {
    this.userService.getSpecificUser({name: user})
      .subscribe(res => {
        if(res['data']){
          this.recipients.push(res['data']);
        }else {
          this.errorMsg.addUser = "User not found";
        }
      });
  }

  removeUser(idx){
    this.recipients.splice(idx, 0);
  }

  save(){
    let params = {
      question: this.form.value,
      user_question: {asking_date: this.chosenDate, users: this.recipients}
    };

    console.log(params);
  }

}
