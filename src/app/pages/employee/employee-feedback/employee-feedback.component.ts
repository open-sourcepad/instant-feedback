import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { EmployeeComponent } from '../employee.component';
import { FeedbackService, MeetingService, SessionService, UserService } from '../../../services/api';

@Component({
  selector: 'app-employee-feedback',
  templateUrl: './employee-feedback.component.pug',
  styleUrls: ['./employee-feedback.component.scss', '../employee.component.scss']
})
export class EmployeeFeedbackComponent extends EmployeeComponent implements OnInit  {

  feedbackForm: FormGroup;

  constructor(public fb: FormBuilder,
    public feedbackApi: FeedbackService,
    public session: SessionService,
    public userApi: UserService) {
    super(fb, feedbackApi, session, userApi);
  }

  // get f() { return this.feedbackForm.controls; }

  ngOnInit() {
    this.feedbackForm = this.fb.group({
      recipient_id: ['', Validators.required],
      sender_id: ['', Validators.required],
      comment: ['', Validators.required]
    });
  }


}
