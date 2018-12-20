import { Component, OnInit } from '@angular/core';
import { MeetingService, SessionService, UserService } from '../../services/api';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { User } from '../../models';


@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.pug',
  styleUrls: ['./employee.component.scss']
})
export class EmployeeComponent implements OnInit {

  currentUser: User;
  sideMenuState: string = 'out';
  feedbackState: string = null;
  users: object[] = [];
  loading: boolean = false;

  constructor(
    private session: SessionService,
    private userApi: UserService
  ) { }

  ngOnInit() {
    this.loading = true;
    this.currentUser = new User(this.session.getCurrentUser());
    this.users = this.userApi.query({})
      .subscribe(res => {
        this.loading = false;
        this.users = res['collection']['data'];
      }, err => {
        this.loading = false;
      });
  }

  toggleSideMenuState(value) {
    this.sideMenuState = value;
  }

}
