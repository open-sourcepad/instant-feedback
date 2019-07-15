import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormArray, FormGroup, Validators } from '@angular/forms';
import { MyMeetingService, SessionService } from '../../../services/api';
import { PaginationInstance } from 'ngx-pagination';
import { MeetingTopic, User } from 'src/app/models';
import * as moment from 'moment';
import { Router, ActivatedRoute } from '@angular/router';
import { RoutingState } from 'src/app/services/utils';

@Component({
  selector: 'app-manager-meetings',
  templateUrl: './manager-meetings.component.pug',
  styleUrls: ['./manager-meetings.component.scss']
})

export class ManagerMeetingsComponent implements OnInit {

  loading: any = {meetings: false};
  meetings: any = [];
  orderParams: any = {scheduled_at: 'desc'};
  currentUser: User;
  queryParams = {page: 1};

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
    private session: SessionService,
    private router: Router,
    private route: ActivatedRoute,
    private routingState: RoutingState
  ) { }

  get filters() { return this.searchForm.controls; }

  ngOnInit() {
    this.currentUser = new User(this.session.getCurrentUser());

    //search form filters
    this.searchForm = this.fb.group({
      date_since: [this.options.startDate],
      date_until: [this.options.endDate],
      username: ['']
    });

    this.routingState.loadRouting();
    if(this.routingState.getPreviousUrl() == null) this.routingState.setPreviousUrl('/manager/one-on-ones');

    this.route.queryParams.subscribe(params => {
      if(Object.keys(params).length > 0){
        this.searchForm.patchValue({
          date_since: params['date_since'],
          date_until: params['date_until'],
          username: params['username']
        });
        this.paginationControls['currentPage'] = params['page'];

        this.loadMeetings(this.searchForm.value);
      } else {
        this.loadMeetings(this.searchForm.value);
      }
    });
  }

  ngOnDestroy(){
    this.routingState.stopRouting();
  }

  loadMeetings(values) {
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

  selectedDate(value: any, datepicker?: any) {
    if(datepicker){
      datepicker.start = value.start;
      datepicker.end = value.end;
    }

    this.searchForm.patchValue({
      date_since: moment(value.start).format('YYYY/MM/DD 00:00:00'),
      date_until: moment(value.end).format('YYYY/MM/DD 23:59:59')
    });

    this.onSearch(this.searchForm.value);
  }

  changeOrder(key, val){
    let key_exists = Object.keys(this.orderParams).some(k => k == key);
    if(key_exists){
      this.orderParams[key] = val;
    } else {
      this.orderParams = {};
      this.orderParams[key] = val;
    }

    this.onSearch(this.searchForm.value);
  }

  pageChange(evt) {
    this.paginationControls['currentPage'] = evt;
    this.onSearch(this.searchForm.value);
  }

  onSearch(values) {
    for(let key of Object.keys(values)){
      this.queryParams[key] = values[key];
    }
    this.queryParams['page'] = this.paginationControls['currentPage'];

    this.router.navigate([], { queryParams: this.queryParams});
  }
}
