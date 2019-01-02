import { Component, OnInit } from '@angular/core';
import { FeedbackService, MeetingService, SessionService, UserService } from '../../services/api';
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
  submitted: boolean = false;
  showModal: boolean = false;
  modalText: any = {body: ''};
  modalButtons: any = {confirm: {text: 'Close'}};

  feedbackForm: FormGroup;

  constructor(
    public fb: FormBuilder,
    public feedbackApi: FeedbackService,
    public session: SessionService,
    public userApi: UserService
  ) { }

  get f() { return this.feedbackForm.controls; }

  ngOnInit() {
    this.loading = true;
    this.currentUser = new User(this.session.getCurrentUser());
    this.userApi.query({})
      .subscribe(res => {
        this.loading = false;
        this.users = res['collection']['data'];
      }, err => {
        this.loading = false;
      });

    this.feedbackForm = this.fb.group({
      recipient_id: ['', Validators.required],
      sender_id: [this.currentUser.id, Validators.required],
      comment: ['', Validators.required]
    });
  }

  toggleSideMenuState(value) {
    this.sideMenuState = value;
  }

  modalStateChange(value) {
    this.showModal = value;
  }

  submitFeedback(values) {
    this.submitted = true;
    this.loading = true;

    if(values.comment.trim() == '') this.f.comment.setValue('');
    if(this.feedbackForm.invalid) {
      return;
    }

    this.feedbackApi.create(values).subscribe(res => {
      this.loading = false;
      this.toggleSideMenuState('out');
      this.modalStateChange(true);
      this.modalText['body'] = "Thank you for giving your feedback";
    }, err => {
      this.loading = false;
    });
  }

}
