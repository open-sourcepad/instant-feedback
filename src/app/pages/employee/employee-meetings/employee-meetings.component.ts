import { Component, OnInit } from '@angular/core';
import { MyMeetingService, UserService } from '../../../services/api';
import {PaginationInstance} from 'ngx-pagination';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-employee-meetings',
  templateUrl: './employee-meetings.component.pug',
  styleUrls: ['./employee-meetings.component.scss']
})
export class EmployeeMeetingsComponent implements OnInit {

  loading: boolean = false;
  collection: any = [];
  recordCount: number = 0;
  orderParams = {scheduled_at: 'desc'};
  employee_id: number = null;

  paginationControls: PaginationInstance = {
    id: 'paginationResults',
    itemsPerPage: 10,
    currentPage: 1,
    totalItems: 0
  }

  constructor(
    private myMeetingApi: MyMeetingService,
    private userApi: UserService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.loadCollection();
  }

  loadCollection() {
    let pageParams = {
      number: this.paginationControls['currentPage'],
      size: this.paginationControls['itemsPerPage']
    };
    this.route.parent.params.subscribe(params => {
      if(Object.keys(params).length > 0) {
        this.employee_id = +params['id'];
        this.userApi.meetings(this.employee_id, {order: this.orderParams, page: pageParams}).subscribe(res => {
          this.loading = false;
          this.collection = res['collection']['data'];
          this.paginationControls['totalItems'] = res['metadata']['record_count'];
        }, err => {
          this.loading = false;
        });
      }else {
        this.myMeetingApi.search({order: this.orderParams, page: pageParams}).subscribe(res => {
          this.loading = false;
          this.collection = res['collection']['data'];
          this.paginationControls['totalItems'] = res['metadata']['record_count'];
        }, err => {
          this.loading = false;
        });
      }
    });
  }

  pageChange(evt) {
    this.paginationControls['currentPage'] = evt;
    this.loadCollection();
  }

}
