import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormArray, FormGroup, Validators } from '@angular/forms';
import { MyMeetingService } from '../../../services/api';
import { PaginationInstance } from 'ngx-pagination';

@Component({
  selector: 'app-manager-meetings',
  templateUrl: './manager-meetings.component.pug',
  styleUrls: ['./manager-meetings.component.scss']
})

export class ManagerMeetingsComponent implements OnInit {

  loading: boolean = false;
  meetings: any = [];
  defaultQuestions: any = [];
  recordCount: number = 0;
  orderParams = {set_schedule: 'desc'};

  paginationControls: PaginationInstance = {
    id: 'paginationResults',
    itemsPerPage: 10,
    currentPage: 1,
    totalItems: 0
  }

  constructor(
    private fb: FormBuilder,
    private myMeetingApi: MyMeetingService,
  ) { }

  ngOnInit() {

    this.loadMeetings();
  }

  loadMeetings() {
    let pageParams = {
      number: this.paginationControls['currentPage'],
      size: this.paginationControls['itemsPerPage']
    };

    this.myMeetingApi.search({order: this.orderParams, page: pageParams}).subscribe(res => {
      this.loading = false;
      this.meetings = res['collection']['data'];
      this.paginationControls['totalItems'] = res['metadata']['record_count'];
    }, err => {
      this.loading = false;
    });
  }
}
