import { Component, OnInit } from '@angular/core';
import { FeedbackService, MeetingService, SessionService, UserService } from '../../services/api';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { User } from '../../models';

@Component({
  selector: 'app-manager',
  templateUrl: './manager.component.pug',
  styleUrls: ['./manager.component.scss']
})


export class ManagerComponent implements OnInit {

  currentUser: User;
  users = [];

  constructor(
    public session: SessionService,
    public userApi: UserService
  ) {
    this.currentUser = new User(this.session.getCurrentUser());
    this.userApi.query({})
      .subscribe(res => {
        this.users = res['collection']['data'].filter(u => u['id'] != this.currentUser.id);
      }, err => {
    });
  }

  ngOnInit() {
    
  }

}
