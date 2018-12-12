import { Component, OnInit } from '@angular/core';
import { SessionService, UserService } from '../../../services/api';
import { User } from '../../../models';

@Component({
  selector: 'app-employee-overview',
  templateUrl: './employee-overview.component.pug',
  styleUrls: ['./employee-overview.component.scss']
})
export class EmployeeOverviewComponent implements OnInit {

  currentUser: User;
  upcoming_meetings: any = [];
  past_meetings: any = [];
  loading: boolean = false;
  hoverActionItemIdx = null;

  constructor(
    private session: SessionService,
    private userApi: UserService
  ) { }

  ngOnInit() {
    this.currentUser = new User(this.session.getCurrentUser());
    this.loadMeetings();
  }

  loadMeetings() {
    this.loading = true;
    this.userApi.meetings().subscribe(res => {
      this.loading = false;
      this.upcoming_meetings = res['upcoming']['data'];
      this.past_meetings = res['past']['data'];
    }, err => {
      this.loading = false;
    });
  }

  past_meeting_text(obj) {
    let employee = new User(obj.employee);
    let manager = new User(obj.manager);

    return `${employee.first_display_name()} & ${manager.first_display_name()}`
  }

}
