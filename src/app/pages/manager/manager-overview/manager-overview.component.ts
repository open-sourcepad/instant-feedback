import { Component, OnInit } from '@angular/core';
import { MyMeetingService, SessionService } from '../../../services/api';
import { User } from '../../../models';
import { PaginationInstance } from 'ngx-pagination';
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
  paginationControls: PaginationInstance = {
    id: 'paginationResults',
    itemsPerPage: 5,
    currentPage: 1,
    totalItems: 0
  }

  constructor(
    private session: SessionService,
    private myMeetingApi: MyMeetingService
  ) { }

  ngOnInit() {
    this.currentUser = new User(this.session.getCurrentUser());

    let loadedQueries = 0;

    // for action items
    this.loadActionItems();

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

  loadActionItems() {
    let params = {
      number: this.paginationControls['currentPage'],
      size: this.paginationControls['itemsPerPage']
    };
    this.myMeetingApi.query({page: params}).subscribe(res => {
      this.meets = res['collection']['data'];
      this.paginationControls['totalItems'] = res['metadata']['record_count'];
    }, err => {
      console.error(err);
    });
  }

  pageChange(evt) {
    this.paginationControls['currentPage'] = evt;
    this.loadActionItems();
  }

}
