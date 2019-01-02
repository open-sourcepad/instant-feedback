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
  //feedbackState: string = null;
  feedbackState: string = 'ask';
  users: object[] = [];
  usersForQuestionForm: object[] = [];
  chosenUsers = [];
  loading: boolean = false;
  submitted: boolean = false;
  showModal: boolean = false;
  modalText: any = {body: ''};
  modalButtons: any = {confirm: {text: 'Close'}};
  questionFormat: string;

  feedbackForm: FormGroup;
  existingQs = [
    "What's one thing that I'm doing well with and should carry on doing?",
    "What's one thing that I could do to be more effective?",
    "What can I do to help take the company forward?",
    "What can I do to be more helpful to people on the team?",
    "What knowledge or skills do you think I may need to develop to meet my goals in this job?"
  ]
  questionForm: object;

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
        this.users = res['collection']['data'].filter(u => u['id'] != this.currentUser.id);
      }, err => {
        this.loading = false;
      });

    this.questionForm = {
      errors: {},
      question: '',
      chosen_question: this.existingQs[0],
    }

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

  submit(values) {
    if (this.feedbackState == 'ask') {
      this.submitQuestion();
    } else {
      this.submitFeedback(values);
    }
  }

  submitQuestion() {
    this.submitted = true;
    this.loading = true;

    let values = this.questionForm;

    if (this.questionFormat == 'existingQ') {
      values['question'] = values['chosen_question'];
    }

    // validation
    values['errors'] = {};
    if (this.chosenUsers.length < 1) values['errors']['no sender'] = true
    if (values['question'].trim() == '') values['errors']['no question'] = true;
    if (values['errors'] != {}) return;

    values['sender_ids'] = this.chosenUsers.map(u => u['id']);
    values['recipient_id'] = this.currentUser.id;

    this.feedbackApi.batchCreate(values).subscribe(res => {
      this.loading = false;
      this.toggleSideMenuState('out');
      this.modalStateChange(true);
      this.modalText['body'] = 'Thank you for asking feedback';

      this.questionForm = {
        question: '',
        chosen_question: this.existingQs[0],
      };
    }, err => {
      this.loading = false;
    });
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
