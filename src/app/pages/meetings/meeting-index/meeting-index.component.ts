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

  constructor(private meetingApi: MeetingService) {
    this.sort_by = {set_schedule: 'asc'};
  }

  ngOnInit() {
    this.loadCollection();
  }

  loadCollection() {
    this.loading = true;
    this.meetingApi.query({order: this.sort_by}).subscribe(res => {
      this.loading = false;
      this.collection = res['collection']['data'];
      console.log(this.collection);
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

}
