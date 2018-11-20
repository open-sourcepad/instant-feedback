import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-meeting-index',
  templateUrl: './meeting-index.component.pug',
  styleUrls: ['./meeting-index.component.scss']
})
export class MeetingIndexComponent implements OnInit {

  loading = false;
  collection: any;

  constructor() { }

  ngOnInit() {
    // this.loading = true;
  }

}
