import { Component, OnInit } from '@angular/core';
import { MeetingService, UserService } from '../../../services/api';

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

  page = {number: 1, size: 20};
  order = {name: 'asc', created_at: 'desc'};

  constructor(
    private meetingApi: MeetingService,
    private userApi: UserService
  ) {
    this.sort_by = {set_schedule: 'asc'};
  }

  ngOnInit() {
    this.loadUsers();
  }

  search(queryParams) {
    if (queryParams instanceof Event) {return;}
    this.loading = true;
    this.queryParams = queryParams;
    queryParams['page'] = this.page;
    queryParams['order'] = this.order;

    queryParams['status'] = {
      'Due & Upcoming': ['upcoming', 'due'],
      'Past': ['done']
    }[queryParams['status']];

    this.meetingApi.search(queryParams).subscribe(res => {
      this.loading = false;
      this.collection = res['collection']['data'];
      this.recordCount = res['metadata']['record_count'];
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
    this.search(this.queryParams);
  }

  changePage(evt) {
    this.page['number'] = evt;
    this.search(this.queryParams);
  }

  calculateShownCount(){
    var totalPages = Math.ceil(this.recordCount / this.page['size']);
    var count = this.page['number'] * this.page['size'];

    if(this.page['number'] == 1 && this.recordCount == 0) {
      this.recordShownCount = `0-${this.recordCount}`;
    }else if(this.page['number'] == 1 && this.recordCount < this.page['size']) {
      this.recordShownCount = `${this.page['number']}-${this.recordCount}`;
    }else if(this.page['number'] == totalPages ) {
      let endRange = (count - this.page['size']) + this.collection.length;
      this.recordShownCount = `${(count - 19)}-${endRange}`;
    }else {
      this.recordShownCount = `${(count - 19)}-${count}`;
    }
  }


}
