import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeComponent } from '../employee.component';
import { FeedbackService, MeetingService, SessionService, UserService } from '../../../services/api';
import {PaginationInstance} from 'ngx-pagination';
import * as moment from 'moment';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { ContentValidator } from 'src/app/custom-validators/content-validator';

@Component({
  selector: 'app-employee-feedback',
  templateUrl: './employee-feedback.component.pug',
  styleUrls: ['./employee-feedback.component.scss', '../employee.component.scss']
})
export class EmployeeFeedbackComponent extends EmployeeComponent implements OnInit  {

  loading: boolean = false;
  feedbacks: any = [];
  queryParams = {page: 1};
  moodScore: number = 0;
  showMoodScore: boolean = false;
  selectedUser = '';
  employee_id: number = null;

  //request feedback
  loadingPending: boolean = false;
  requests = [];
  requestedFeedback = null;
  requestForm: FormGroup;

  //show feedback
  selectedFeedback = null;

  paginationControls: PaginationInstance = {
    id: 'paginationResults',
    itemsPerPage: 10,
    currentPage: 1,
    totalItems: 0
  }

  daterangeOpts: any = {
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
    opens: 'right',
    startDate: moment().startOf('isoWeek').format('YYYY/MM/DD 00:00:00'),
    endDate: moment().endOf('isoWeek').format('YYYY/MM/DD 23:59:59')
  };

  searchForm: FormGroup;

  constructor(
    public fb: FormBuilder,
    public session: SessionService,
    public userApi: UserService,
    public feedbackApi: FeedbackService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    super(fb, session, userApi, feedbackApi);
  }

  get filters() { return this.searchForm.controls; }
  get rf() { return this.requestForm.controls; }

  ngOnInit() {
    this.searchForm = this.fb.group({
      date_since: [this.daterangeOpts.startDate],
      date_until: [this.daterangeOpts.endDate],
      received_from: [''],
      given_to: [''],
      received: [true],
      given: [false]
    });

    this.requestForm = this.fb.group({
      comment: ['', [Validators.required, ContentValidator.IsBlank]]
    });

    this.loadRequestFeedbacks();

    const urlParams =  combineLatest(
      this.route.parent.params,
      this.route.queryParams
    ).pipe(
        map(([params, queryParams]) => ({...params, ...queryParams}))
    );

    urlParams.subscribe(params => {
      if(params['id']) this.employee_id = +params['id'];
      let keys = Object.keys(params);

      if(keys.length > 0){
        if(keys.findIndex(x => x == 'show_feedback') > -1){
          return;
        }else if(keys.findIndex(x => x == 'give_feedback') > -1){
          return;
        }else {
          for(let key of keys.filter(e => e !== 'page' && e !== 'id')){
            let value = params[key]
            if(key == 'received' || key == 'given') value = (params[key] == 'true');
            if((key == 'received_from' || key == 'given_to') && params[key]) value = +params[key];
            this.searchForm.get(key).setValue(value);
          }
          this.daterangeOpts.startDate = params['date_since'];
          this.daterangeOpts.endDate = params['date_until'];
          this.selectedUser = params['received_from'];
          this.paginationControls['currentPage'] = params['page'];

          this.loadFeedbacks(this.searchForm.value);
        }
      }else {
        this.loadFeedbacks(this.searchForm.value);
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
      let sub = this.route.queryParams.subscribe(params => {
        let keys = Object.keys(params);
  
        if(keys.length > 0){
          if(keys.findIndex(x => x == 'show_feedback') > -1){
            this.getFeedback(+params['show_feedback']);
            this.toggleFeedback('show', 'in');
          }else if(keys.findIndex(x => x == 'give_feedback') > -1){
            let idx = this.requests.findIndex(x => x.id == +params['give_feedback']);

            if(idx > -1){
            this.toggleFeedback('request', 'in');
              this.requestedFeedback = this.requests[idx];
            }else {
              this.togglePopupModal(true);
              this.modalText['body'] = "Request feedback has already been answered or does not exist";
            }
          }
        }
      });
      sub.unsubscribe();
      this.loadFeedbacks(this.searchForm.value);
    }, err => {
      this.loadingPending = false;
    });
  }

  submitFeedback(values) {
    this.loading = true;
    this.submitted = true;

    if(this.requestForm.invalid) {
      this.loading = false;
      return;
    }

    this.feedbackApi.update(this.requestedFeedback.id, values).subscribe(res => {
      this.loading = false;
      this.toggleFeedback('request', 'out');
      this.togglePopupModal(true);
      this.modalText['body'] = "Thank you for giving your feedback";
      let idx = this.requests.findIndex(x => x.id == this.requestedFeedback.id);
      this.requests.splice(idx, 1);
      this.requestedFeedback = null;
    }, err => {
      this.loading = false;
    });

  }

  // answered feedbacks
  loadFeedbacks(query) {
    this.loading = true;
    if(this.employee_id){
      this.userApi.feedbacks(this.employee_id, query)
      .subscribe(res => {
        this.loading = false;
        this.feedbacks = res['collection']['data'];
        this.paginationControls['totalItems'] = res['metadata']['record_count'];
        this.moodScore = this.feedbacks.reduce((sum, obj) => sum + parseFloat(obj.sentiment_score), 0.0) / this.feedbacks.length;
        this.showMoodScore = this.moodScore < 0 || this.moodScore > 0.24;
      }, err => {
        this.loading = false;
      });
    }else {
      this.feedbackApi.query(query)
      .subscribe(res => {
        this.loading = false;
        this.feedbacks = res['collection']['data'];
        this.paginationControls['totalItems'] = res['metadata']['record_count'];
        this.moodScore = this.feedbacks.reduce((sum, obj) => sum + parseFloat(obj.sentiment_score), 0.0) / this.feedbacks.length;
        this.showMoodScore = this.moodScore < 0 || this.moodScore > 0.24;
      }, err => {
        this.loading = false;
      });
    }
  }

  onSearch(values) {
    for(let key of Object.keys(values)){
      this.queryParams[key] = values[key];
    }
    this.queryParams['page'] = this.paginationControls['currentPage'];

    this.router.navigate([], { queryParams: this.queryParams});
  }

  changeTab(tab) {
    if(tab == 'received'){
      this.searchForm.patchValue({
        received: true,
        given: false
      });
    }else {
      this.searchForm.patchValue({
        received: false,
        given: true
      });
    }
    this.paginationControls['currentPage'] = 1;
    this.onSearch(this.searchForm.value);
  }

  selectedDate(value: any) {
    this.searchForm.patchValue({ 
      date_since: moment(value.start).format('YYYY/MM/DD 00:00:00'),
      date_until: moment(value.end).format('YYYY/MM/DD 23:59:59')
    });
  
    this.daterangeOpts['startDate'] = this.filters.date_since.value;
    this.daterangeOpts['endDate'] = this.filters.date_until.value;

    this.onSearch(this.searchForm.value);
  }

  selectUser(value){
    this.searchForm.patchValue({
      received_from: value,
      given_to: value
    });
    this.onSearch(this.searchForm.value);
  }

  pageChange(evt) {
    this.paginationControls['currentPage'] = evt;
    this.onSearch(this.searchForm.value);
  }

}
