import { Component, OnInit } from '@angular/core';
import { MyMeetingService } from '../../../services/api';
import {PaginationInstance} from 'ngx-pagination';

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

  paginationControls: PaginationInstance = {
    id: 'paginationResults',
    itemsPerPage: 10,
    currentPage: 1,
    totalItems: 0
  }

  constructor(
    private myMeetingApi: MyMeetingService
  ) { }

  ngOnInit() {
    this.loadCollection();
  }

  loadCollection() {
    let pageParams = {
      number: this.paginationControls['currentPage'],
      size: this.paginationControls['itemsPerPage']
    };
    this.myMeetingApi.search({order: this.orderParams, page: pageParams}).subscribe(res => {
      this.loading = false;
      this.collection = res['collection']['data'];
      this.paginationControls['totalItems'] = res['metadata']['record_count'];
    }, err => {
      this.loading = false;
    });
  }

  pageChange(evt) {
    this.paginationControls['currentPage'] = evt;
    this.loadCollection();
  }

}
