import { Component, OnInit } from '@angular/core';
import { MeetingService, UserService } from '../../../services/api';
import {PaginationInstance} from 'ngx-pagination';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-meeting-index',
  templateUrl: './meeting-index.component.pug',
  styleUrls: ['./meeting-index.component.scss'],
})
export class MeetingIndexComponent implements OnInit {

  loading = false;
  users = [];
  managers = [];
  statuses = ['All', 'Due & Upcoming', 'Past'];
  collection = [];
  sort_by: any;
  recordCount: number = 0;
  recordShownCount;
  queryParams: any;

  paginationControls: PaginationInstance = {
    id: 'meetingCollection',
    itemsPerPage: 20,
    currentPage: 1,
    totalItems: 0
  };

  private sub: any;

  constructor(
    private meetingApi: MeetingService,
    private userApi: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.sort_by = {set_schedule: 'asc'};
  }

  ngOnInit() {
    this.loadUsers();

    this.sub = this.route.queryParams.subscribe(params => {
      if(params.page) this.paginationControls['currentPage'] = params.page;
      if(params.sort && params.order){
        this.sort_by = {};
        this.sort_by[params.sort] = params.order;
      }
    });
    this.sub.unsubscribe();
  }

  search(queryParams) {
    if (queryParams instanceof Event) {return;}
    this.loading = true;
    this.queryParams = queryParams;
    queryParams['page'] = {
      number: this.paginationControls['currentPage'],
      size: this.paginationControls['itemsPerPage']
    };
    queryParams['order'] = this.sort_by;

    queryParams['status'] = {
      'Due & Upcoming': ['upcoming', 'due'],
      'Past': ['done']
    }[queryParams['status']];

    this.meetingApi.search(queryParams).subscribe(res => {
      this.loading = false;
      this.collection = res['collection']['data'];
      this.paginationControls['totalItems'] = res['metadata']['record_count'];
      this.calculateShownCount();
    }, err => {
      this.loading = false;
    });
  }

  loadUsers() {
    this.userApi.query({})
      .subscribe(res => {
        this.users = [ {id: '', display_name: 'All'} ];
        this.managers = [ {id: '', display_name: 'All'} ];
        res['collection']['data'].forEach(user => {
          this.users.push(user);
          user.is_manager && this.managers.push(user);
        });
      });
  }

  changeOrder(key, val){
    let key_exists = Object.keys(this.sort_by).some(k => k == key);
    if(key_exists){
      this.sort_by[key] = val;
    } else {
      this.sort_by = {};
      this.sort_by[key] = val;
    }

    let qparams = {sort: key, order: val};
    this.router.navigate([], {queryParams: qparams, queryParamsHandling: "merge"});
    this.search(this.queryParams);
  }

  changePage(evt) {
    this.paginationControls['currentPage'] = evt;
    this.search(this.queryParams);
  }

  calculateShownCount(){
    var totalPages = Math.ceil(this.paginationControls['totalItems'] / this.paginationControls['itemsPerPage']);
    var count = this.paginationControls['currentPage'] *  this.paginationControls['itemsPerPage'];

    if(this.paginationControls['currentPage'] == 1 && this.paginationControls['totalItems'] == 0) {
      this.recordShownCount = `0-${this.paginationControls['totalItems']}`;
    }else if(this.paginationControls['currentPage'] == 1 && this.paginationControls['totalItems'] <  this.paginationControls['itemsPerPage']) {
      this.recordShownCount = `${this.paginationControls['currentPage']}-${this.paginationControls['totalItems']}`;
    }else if(this.paginationControls['currentPage'] == totalPages ) {
      let endRange = (count - this.paginationControls['itemsPerPage']) + this.collection.length;
      this.recordShownCount = `${(count - 19)}-${endRange}`;
    }else {
      this.recordShownCount = `${(count - 19)}-${count}`;
    }


  }


}
