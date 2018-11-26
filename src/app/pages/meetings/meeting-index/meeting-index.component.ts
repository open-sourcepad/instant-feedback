import { Component, OnInit } from '@angular/core';
import { MeetingService } from '../../../services/api';

@Component({
  selector: 'app-meeting-index',
  templateUrl: './meeting-index.component.pug',
  styleUrls: ['./meeting-index.component.scss']
})
export class MeetingIndexComponent implements OnInit {

  loading = false;
  collection = [];
  sort_by: any;
  recordCount: number = 0;
  page = {number: 1, size: 20};

  constructor(private meetingApi: MeetingService) {
    this.sort_by = {set_schedule: 'asc'};
  }

  ngOnInit() {
    this.loadCollection();
  }

  loadCollection() {
    this.loading = true;
    this.meetingApi.query({page: this.page, order: this.sort_by}).subscribe(res => {
      this.loading = false;
      this.collection = res['collection']['data'];
      this.recordCount = res['metadata']['record_count'];
    }, err => {
      this.loading = false;
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
    this.loadCollection();
  }

  changePage(evt) {
    this.page['number'] = evt;
    this.loadCollection();
  }

}
