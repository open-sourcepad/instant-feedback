import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { MeetingService, SessionService } from '../../../services/api';


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
  actionItems: any = [];
  action: string = '';
  prevActionItems: any = [];
  previousMeeting: any = [];
  currentUser: any = {};

  constructor(
    private meetingApi: MeetingService,
    private session: SessionService,
    private activeRoute: ActivatedRoute,
    private router: Router
  ) {
    this.currentUser = this.session.getCurrentUser();
  }

  ngOnInit() {

    this.activeRoute.params.subscribe(params => {
      this.slug_id = +params['id'];

      if(this.slug_id){
        this.loadData(this.slug_id);
      }
    });

    this.activeRoute.queryParams
      .subscribe(params => {
        this.action = params['action'];
       });
  }

  loadData(slug_id: number) {
    this.loading = true;
    this.meetingApi.get(slug_id)
      .subscribe( res => {
        this.loading = false;
        this.obj = res['data'];
        if(this.obj['manager']['id'] != this.currentUser['id']) {
          this.router.navigate(['/page-not-found']);
        }
        this.discussions = res['data']['discussions']['data'];
        this.actionItems = res['data']['action_items'];
        this.prevActionItems = res["data"]["prev_meet_action_items"];
        this.previousMeeting = res["data"]["previous_meeting"];
      }, err => {
        this.loading = false;
      });
  }
}
