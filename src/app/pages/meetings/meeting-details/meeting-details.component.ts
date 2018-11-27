import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { trigger, state, style, transition, animate} from '@angular/animations';

import { MeetingService } from '../../../services/api';

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
  menuState: string = 'out';

  constructor(
    private router: Router,
    private activeRoute: ActivatedRoute,
    private meetingApi: MeetingService
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
        console.log(this.obj);
      }, err => {
        this.loading = false;
      });
  }

  addTalkingPoints() {
    this.menuState = this.menuState === 'out' ? 'in' : 'out';
  }

}
