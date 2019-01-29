import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { FeedbackService, SessionService, UserService } from 'src/app/services/api';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/models';

@Component({
  selector: 'app-employee-profile',
  templateUrl: './employee-profile.component.pug',
  styleUrls: ['./employee-profile.component.scss', '../employee/employee.component.scss']
})
export class EmployeeProfileComponent implements OnInit {

  currentUser: User;
  slug_id: number;

  constructor(
    private fb: FormBuilder,
    private feedbackApi: FeedbackService,
    private session: SessionService,
    private userApi: UserService,
    private route: ActivatedRoute
  ) {
    
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.slug_id = +params['id'];
      this.userApi.get(this.slug_id).subscribe(res => {
        this.currentUser = new User(res['data']);
      });
    })
  }

}
