import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { MeetingService } from '../../../services/api';


@Component({
  selector: 'app-meeting-discussion',
  templateUrl: './meeting-discussion.component.pug',
  styleUrls: ['./meeting-discussion.component.scss']
})
export class MeetingDiscussionComponent implements OnInit {

  slug_id = null;
  loading = false;
  obj: any = null;
  discussions: any = [];

  constructor(
    private meetingApi: MeetingService,
    private activeRoute: ActivatedRoute
  ) { }

  ngOnInit() {

    this.activeRoute.params.subscribe(params => {
      this.slug_id = +params['id'];

      if(this.slug_id){
        this.loadData(this.slug_id);
      }
    });
  }

  loadData(slug_id: number) {
    this.loading = true;
    this.meetingApi.get(slug_id)
      .subscribe( res => {
        this.loading = false;
        this.obj = res['data'];
        this.discussions = res['data']['discussions']['data'];
      }, err => {
        this.loading = false;
      });
  }
}
