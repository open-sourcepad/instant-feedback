import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { MeetingService } from '../../../services/api';

@Component({
  selector: 'app-meeting-details',
  templateUrl: './meeting-details.component.pug',
  styleUrls: ['./meeting-details.component.scss']
})
export class MeetingDetailsComponent implements OnInit {

  slug_id = null;
  loading = false;
  obj = null;

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

}
