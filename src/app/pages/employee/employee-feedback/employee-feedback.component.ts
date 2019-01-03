import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { EmployeeComponent } from '../employee.component';
import { FeedbackService, MeetingService, SessionService, UserService } from '../../../services/api';
import * as moment from 'moment';

@Component({
  selector: 'app-employee-feedback',
  templateUrl: './employee-feedback.component.pug',
  styleUrls: ['./employee-feedback.component.scss', '../employee.component.scss']
})
export class EmployeeFeedbackComponent extends EmployeeComponent implements OnInit  {

  feedbackForm: FormGroup;
  searchForm: FormGroup;
  collection = [];
  users: object[] = [{id: '', display_name: 'ALL'}];
  selectedUser = "";
  currentTab = 'received';

  daterange = {
    start: moment().startOf('isoWeek').format('YYYY/MM/DD 00:00:00'),
    end: moment().endOf('isoWeek').format('YYYY/MM/DD 23:59:59')
  };
  //daterangepicker options
  options: any = {
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
    opens: 'right'
  };

  constructor(public fb: FormBuilder,
    public feedbackApi: FeedbackService,
    public session: SessionService,
    public userApi: UserService) {
    super(fb, feedbackApi, session, userApi);
  }

  ngOnInit() {
    this.feedbackForm = this.fb.group({
      recipient_id: ['', Validators.required],
      sender_id: ['', Validators.required],
      comment: ['', Validators.required]
    });

    // this.userApi.query({})
    //   .subscribe(res => {
    //     this.loading = false;
    //     let users_data = res['collection']['data'].filter(u => u['id'] != this.currentUser.id);
    //     users_data.forEach(user => this.users.push(user));
    //   }, err => {
    //     this.loading = false;
    //   });
    this.loadFeedbacks();
  }

  loadFeedbacks() {
    this.loading = true;
    let query = {
      date_since: this.daterange.start,
      date_until: this.daterange.end
    }
    query[this.currentTab] = true;
    this.feedbackApi.query(query)
      .subscribe(res => {
        this.loading = false;
        this.collection = res['collection']['data'];
      }, err => {
        this.loading = false;
      });
  }

  changeTab(tab) {
    this.currentTab = tab;
    this.loadFeedbacks();
  }

  selectedDate(value: any, datepicker?: any) {
    if(datepicker){
      datepicker.start = value.start;
      datepicker.end = value.end;
    }

    this.daterange.start = moment(value.start).format('YYYY/MM/DD 00:00:00');
    this.daterange.end = moment(value.end).format('YYYY/MM/DD 23:59:59');
  
    this.loadFeedbacks();
  }

  formatDate(date) {
    return moment(date).startOf('day').fromNow();
  }


}
