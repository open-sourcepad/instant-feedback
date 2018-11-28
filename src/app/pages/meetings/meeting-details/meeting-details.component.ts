import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { trigger, state, style, transition, animate} from '@angular/animations';

import { MeetingService, DiscussionService } from '../../../services/api';

@Component({
  selector: 'app-meeting-details',
  templateUrl: './meeting-details.component.pug',
  styleUrls: ['./meeting-details.component.scss'],
  animations: [
    trigger('slideInOut', [
      state('in', style({
        transform: 'translate3d(0, 0, 0)'
      })),
      state('out', style({
        transform: 'translate3d(100%, 0, 0)'
      })),
      transition('in => out', animate('400ms ease-in-out')),
      transition('out => in', animate('400ms ease-in-out'))
    ]),
  ]
})
export class MeetingDetailsComponent implements OnInit {

  slug_id = null;
  loading = false;
  obj = null;
  discussions: any = [];
  discussionObj: any = null;
  menuState: string = 'out';

  constructor(
    private router: Router,
    private activeRoute: ActivatedRoute,
    private meetingApi: MeetingService,
    private discussionApi: DiscussionService
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

  addTalkingPoints() {
    this.menuState = this.menuState === 'out' ? 'in' : 'out';
    if(this.menuState === 'out'){
      this.discussionObj = null;
    }
  }

  saveDiscussion(obj) {
    this.loading = true;
    var params = Object.assign(obj.values, {meeting_id: this.slug_id});
    if(obj.action == "create") {
      this.discussionApi.create(params)
        .subscribe( res => {
          this.loading = false;
          this.loadData(this.slug_id);
          this.addTalkingPoints();
        }, err => {
          this.loading = false;
        });
    }else {
      this.discussionApi.update(this.discussionObj.id, params)
        .subscribe( res => {
          this.loading = false;
          this.loadData(this.slug_id);
          this.addTalkingPoints();
        }, err => {
          this.loading = false;
        });
    }
  }

  editDiscussion(obj) {
    this.discussionObj = obj;
    this.addTalkingPoints();
  }

  removeDiscussion(obj, idx) {
    this.loading = true;
    this.discussionApi.destroy(obj.id)
      .subscribe( res => {
        this.loading = false;
        this.discussions.splice(idx, 1);
      }, err => {
        this.loading = false;
      });
  }



}
