import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeComponent } from '../employee.component';
import { FeedbackService, MeetingService, SessionService, UserService } from '../../../services/api';
import {PaginationInstance} from 'ngx-pagination';
import * as moment from 'moment';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

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
  employee_id: number = null;

  moodScore: number = 0;
  showMoodScore: boolean = false;

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
    start: moment().startOf('isoWeek').format('YYYY/MM/DD'),
    end: moment().endOf('isoWeek').format('YYYY/MM/DD')
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

  private sub: any;

  constructor(public fb: FormBuilder,
    public feedbackApi: FeedbackService,
    public session: SessionService,
    public userApi: UserService,
    private route: ActivatedRoute,
    private router: Router) {
    super(fb, feedbackApi, session, userApi);
  }

  ngOnInit() {
    this.feedbackForm = this.fb.group({
      comment: ['', Validators.required]
    });

    const urlParams =  combineLatest(
      this.route.parent.params,
      this.route.queryParams
    ).pipe(
        map(([params, queryParams]) => ({...params, ...queryParams}))
    );

    urlParams.subscribe(params => {
      if(params['id']) this.employee_id = +params['id'];
      if(Object.keys(params).length > 1) {
        this.currentTab = params.tab;
        this.daterange['start'] = params.startDate;
        this.daterange['end'] = params.endDate;
        this.selectedUser = params.user;
        this.paginationControls['currentPage'] = params.page;
      }
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
      date_since: `${this.daterange.start} 00:00:00`,
      date_until: `${this.daterange.end} 23:59:59`,
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

    this.handleQueryParams();
    if(this.employee_id){
      this.userApi.feedbacks(this.employee_id, query)
      .subscribe(res => {
        this.loading = false;
        this.collection = res['collection']['data'];
        this.paginationControls['totalItems'] = res['metadata']['record_count'];
        this.moodScore = this.collection.reduce((sum, obj) => sum + parseFloat(obj.sentiment_score), 0.0) / this.collection.length;
        this.showMoodScore = this.moodScore < 0 || this.moodScore > 0.24;
      }, err => {
        this.loading = false;
      });
    }else {
      this.feedbackApi.query(query)
        .subscribe(res => {
          this.loading = false;
          this.collection = res['collection']['data'];
          this.paginationControls['totalItems'] = res['metadata']['record_count'];
          this.moodScore = this.collection.reduce((sum, obj) => sum + parseFloat(obj.sentiment_score), 0.0) / this.collection.length;
          this.showMoodScore = this.moodScore < 0 || this.moodScore > 0.24;
        }, err => {
          this.loading = false;
        });
    }
  }

  handleQueryParams(){
    let queryParams = {
      tab: this.currentTab,
      startDate: this.daterange.start,
      endDate: this.daterange.end,
      user: this.selectedUser,
      page: this.paginationControls['currentPage']
    }
    this.router.navigate([], {queryParams: queryParams, queryParamsHandling: "merge"});
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

    this.daterange.start = moment(value.start).format('YYYY/MM/DD');
    this.daterange.end = moment(value.end).format('YYYY/MM/DD');
  
    this.loadFeedbacks();
  }

  pageChange(evt) {
    this.paginationControls['currentPage'] = evt;
    this.loadFeedbacks();
  }


}
