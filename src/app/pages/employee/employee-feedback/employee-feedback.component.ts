import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { EmployeeComponent } from '../employee.component';
import { FeedbackService, MeetingService, SessionService, UserService } from '../../../services/api';
import {PaginationInstance} from 'ngx-pagination';
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
  selectedUser = "";
  currentTab = 'received';

  //request feedback
  loadingPending: boolean = false;
  requests = [];
  requestedFeedback = null;

  //show feedback
  showFeedback: string = 'out';
  selectedFeedback = null;

  paginationControls: PaginationInstance = {
    id: 'paginationResults',
    itemsPerPage: 10,
    currentPage: 1,
    totalItems: 0
  }

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
    opens: 'right',
    startDate: moment().startOf('isoWeek').format('MM/DD/YYYY'),
    endDate: moment().endOf('isoWeek').format('MM/DD/YYYY')
  };

  constructor(public fb: FormBuilder,
    public feedbackApi: FeedbackService,
    public session: SessionService,
    public userApi: UserService,
    private route: ActivatedRoute) {
    super(fb, feedbackApi, session, userApi);
  }

  ngOnInit() {
    this.feedbackForm = this.fb.group({
      comment: ['', Validators.required]
    });
    this.loadFeedbacks();
    this.loadRequestFeedbacks();
  }

  handleRouteParams() {
    this.route.queryParams.subscribe(params => {
      var action = Object.keys(params)[0];
      if(action == "show_feedback"){
        this.getFeedback(+params[action]);
        this.toggleShowFeedback('in');
      }else if(action == "give_feedback"){
        let idx = this.requests.findIndex(x => x.id == +params[action]);

        if(idx > -1){
          this.sideMenuState = 'in';
          this.feedbackState = 'give';
          this.requestedFeedback = this.requests[idx];
        }else {
          this.modalStateChange(true);
          this.modalText['body'] = "Request feedback has already been answered or does not exist";
        }
      }
    });
  }

  getFeedback(id) {
    this.loading = true;
    this.feedbackApi.get(id).subscribe(res => {
      this.loading = false;
      this.selectedFeedback = res['data'];
    }, err => {
      this.loading = false;
    });
  }

  //request feedbacks
  loadRequestFeedbacks() {
    this.loadingPending = true;
    this.feedbackApi.pending().subscribe(res => {
      this.loadingPending = false;
      this.requests = res['collection']['data'];
      this.handleRouteParams();
    }, err => {
      this.loadingPending = false;
    });
  }

  submitFeedback(values) {
    this.submitted = true;
    this.loading = true;

    if(values.comment.trim() == '') this.f.comment.setValue('');
    if(this.feedbackForm.invalid) {
      this.loading = false;
      return;
    }

    this.feedbackApi.update(this.requestedFeedback.id, values).subscribe(res => {
      this.loading = false;
      this.toggleSideMenuState('out');
      this.modalStateChange(true);
      this.modalText['body'] = "Thank you for giving your feedback";
      let idx = this.requests.findIndex(x => x.id == this.requestedFeedback.id);
      this.requests.splice(idx, 1);
      this.requestedFeedback = null;
    }, err => {
      this.loading = false;
    });
  }


  //answered feedbacks
  loadFeedbacks() {
    this.loading = true;
    let query = {
      date_since: this.daterange.start,
      date_until: this.daterange.end,
      page: {
        number: this.paginationControls['currentPage'],
        size: this.paginationControls['itemsPerPage']
      }
    };
    query[this.currentTab] = true;
    delete query['received_from'];
    delete query['given_to'];
    if(this.selectedUser) {
      if(this.currentTab == 'received') {
        query['received_from'] = this.selectedUser;
      }else {
        query['given_to'] = this.selectedUser;
      }
    }
    this.feedbackApi.query(query)
      .subscribe(res => {
        this.loading = false;
        this.collection = res['collection']['data'];
        this.paginationControls['totalItems'] = res['metadata']['record_count'];
      }, err => {
        this.loading = false;
      });
  }

  toggleShowFeedback(value){
    this.showFeedback = value;
  }

  changeTab(tab) {
    this.currentTab = tab;
    this.paginationControls['currentPage'] = 1;
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

  pageChange(evt) {
    this.paginationControls['currentPage'] = evt;
    this.loadFeedbacks();
  }


}
