import { Component, OnInit } from '@angular/core';
import { MyMeetingService, SessionService } from '../../../services/api';
import { User } from '../../../models';
import * as moment from 'moment';

@Component({
  selector: 'app-manager-overview',
  templateUrl: './manager-overview.component.pug',
  styleUrls: ['./manager-overview.component.scss']
})


export class ManagerOverviewComponent implements OnInit {

  meets: any = [];
  meetsThisWeek: any = [];
  meetsOnDue: any = [];
  currentUser: User;

  constructor(
    private session: SessionService,
    private myMeetingApi: MyMeetingService
  ) { }

  ngOnInit() {
    this.currentUser = new User(this.session.getCurrentUser());

    let loadedQueries = 0;

    // for action items
    this.myMeetingApi.query({}).subscribe(res => {
      this.meets = res['collection']['data'];
    }, err => {
      console.error(err);
    });

    // for 1-on-1s this week
    let params = {
      date_since: moment().startOf('isoWeek').format('YYYY/MM/DD 00:00:00'),
      date_until: moment().endOf('isoWeek').format('YYYY/MM/DD 23:59:59'),
    }
    this.myMeetingApi.search(params).subscribe(res => {
      this.meetsThisWeek = res['collection']['data'].map(m => {
        let isFacilitator = this.currentUser['display_name'] == m['manager']['display_name'];
        m['other_party'] = {
          show_facilitator_label: !isFacilitator,
          display_name: m[isFacilitator ? 'employee' : 'manager']['display_name']
        };
        return m;
      }).slice().reverse();
    }, err => {
      console.error(err);
    });

    // for due meetings
    this.myMeetingApi.search({'status[]': 'due'}).subscribe(res => {
      this.meetsOnDue = res['collection']['data'].map(m => {
        let isFacilitator = this.currentUser['display_name'] == m['manager']['display_name'];
        m['other_party'] = {
          show_facilitator_label: !isFacilitator,
          display_name: m[isFacilitator ? 'employee' : 'manager']['display_name']
        };
        return m;
      }).slice().reverse();
    }, err => {
      console.error(err);
    });
  }

  isForThisWeek(meet) {
    return moment(meet.set_schedule).week() == moment().week();
  }

}
