import { Component, OnInit } from '@angular/core';
import { PaginationInstance } from 'ngx-pagination';
import { FeedbackService, SessionService, UserService } from 'src/app/services/api';
import * as moment from 'moment';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ManagerComponent } from '../manager.component';

@Component({
  selector: 'app-manager-feedback',
  templateUrl: './manager-feedback.component.pug',
  styleUrls: ['./manager-feedback.component.scss',
    '../../employee/employee.component.scss',
    '../../employee/employee-feedback/employee-feedback.component.scss']
})
export class ManagerFeedbackComponent extends ManagerComponent implements OnInit {

  loading: boolean = false;
  feedbacks: any = [];
  queryParams = {page: 1};
  moodScore: number = 0;
  showMoodScore: boolean = false;
  selectedUser = '';

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
    public session: SessionService,
    public userApi: UserService,
    private fb: FormBuilder,
    private feedbackApi: FeedbackService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    super(session, userApi);
  }

  get filters() { return this.searchForm.controls; }

  ngOnInit() {
    this.searchForm = this.fb.group({
      date_since: [this.daterangeOpts.startDate],
      date_until: [this.daterangeOpts.endDate],
      received_from: [null],
      given_to: [null],
      received: [true],
      given: [false]
    });

    this.loadRequestFeedbacks();

    this.route.queryParams.subscribe(params => {
      let keys = Object.keys(params);
      if(keys.length > 0){
        for(let key of keys.filter(e => e !== 'page')){
          let value = params[key]
          if(key == 'received' || key == 'given') value = (params[key] == 'true');
          if(key == 'received_from' || key == 'given_to') value = +params[key];
          this.searchForm.get(key).setValue(value);
        }
        this.selectedUser = params['received_from'];
        this.paginationControls['currentPage'] = params['page'];

        this.loadFeedbacks(this.searchForm.value);
      } else {
        this.loadFeedbacks(this.searchForm.value);
      }
    });
  }

  //request feedbacks
  loadRequestFeedbacks() {
    this.loadingPending = true;
    this.feedbackApi.pending().subscribe(res => {
      this.loadingPending = false;
      this.requests = res['collection']['data'];
    }, err => {
      this.loadingPending = false;
    });
  }

  // answered feedbacks
  loadFeedbacks(query) {
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
  
    this.onSearch(this.searchForm.value);
  }

  selectUser(value){
    this.searchForm.patchValue({
      received_from: value,
      given_to: value
    });
    this.onSearch(this.searchForm.value);
  }

}
