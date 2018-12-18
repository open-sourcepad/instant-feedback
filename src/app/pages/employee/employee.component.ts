import { Component, OnInit } from '@angular/core';
import { MeetingService, SessionService, UserService } from '../../services/api';
import { User } from '../../models';


@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.pug',
  styleUrls: ['./employee.component.scss']
})
export class EmployeeComponent implements OnInit {

  currentUser: User;

  constructor(
    private session: SessionService
  ) { }

  ngOnInit() {
    this.currentUser = new User(this.session.getCurrentUser());
  }

}
