import { Component, OnInit } from '@angular/core';
import { SessionService, UserService, FeedbackService } from '../../services/api';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { User } from '../../models';
import { ContentValidator } from 'src/app/custom-validators/content-validator';

@Component({
  selector: 'app-manager',
  templateUrl: './manager.component.pug',
  styleUrls: ['./manager.component.scss', '../employee/employee.component.scss']
})


export class ManagerComponent implements OnInit {

  currentUser: User;
  users = [];
  feedBackState: string = 'out';
  feedback = {ask: false, give: false, request: false, show: false};
  submitted: boolean = false;
  loading: boolean = false;
  modalText: any = {body: ''};
  modalButtons: any = {confirm: {text: 'Close'}};
  showModal: boolean = false;
  giveForm: FormGroup;
  askForm: FormGroup;
  existingQs = [
    "What's one thing that I'm doing well with and should carry on doing?",
    "What's one thing that I could do to be more effective?",
    "What can I do to help take the company forward?",
    "What can I do to be more helpful to people on the team?",
    "What knowledge or skills do you think I may need to develop to meet my goals in this job?"
  ]
  isError = false;
  errorMsg = '';

  constructor(
    public fb: FormBuilder,
    public session: SessionService,
    public userApi: UserService,
    public feedbackApi: FeedbackService
  ) {
    this.currentUser = new User(this.session.getCurrentUser());
    this.userApi.query({})
      .subscribe(res => {
        this.users = res['collection']['data'].filter(u => u['id'] != this.currentUser.id);
      }, err => {
    });
  }

  get gf() { return this.giveForm.controls; }
  get af() { return this.askForm.controls; }

  ngOnInit() {
    this.askForm = this.fb.group({
      recipient_id: [this.currentUser.id, Validators.required],
      sender_ids: ['', Validators.required],
      question: ['', [Validators.required, ContentValidator.IsBlank]],
      questionFormat: ['', Validators.required]
    });

    this.giveForm = this.fb.group({
      recipient_id: ['', Validators.required],
      sender_id: [this.currentUser.id, Validators.required],
      comment: ['', [Validators.required, ContentValidator.IsBlank]]
    });
  }

  toggleFeedback(type, state) {
    this.feedBackState = state;
    this.feedback[type] = !this.feedback[type];
  }

  togglePopupModal(value) {
    this.showModal = value;
  }

  assignQuestion(value) {
    this.af.question.setValue(value);
  }

  submit(values) {
    this.submitted = true;
    this.loading = true;

    if(this.feedback['ask']) {
      if(this.askForm.invalid){
        this.loading = false;
        return;
      }else {
        values['sender_ids'] = values['sender_ids'].map(u => u['id']);
        this.feedbackApi.batchCreate(values).subscribe(res => {
          this.loading = false;
          this.submitted = false;
          this.toggleFeedback('ask','out');
          this.togglePopupModal(true);
          this.modalText['body'] = 'Thank you for asking feedback';

          this.askForm.patchValue({
            sender_ids: [],
            question: '',
            questionFormat: ''
          });
        }, err => {
          this.loading = false;
        });
      }
    }else{
      if(this.giveForm.invalid){
        this.loading = false;
        return;
      }else {
        this.feedbackApi.create(values).subscribe(res => {
          this.loading = false;
          this.submitted = false;
          this.toggleFeedback('give','out');
          this.togglePopupModal(true);
          this.modalText['body'] = "Thank you for giving your feedback";

          this.giveForm.patchValue({
            recipient_id: '',
            comment: ''
          });
        }, err => {
          this.isError = true;
          this.errorMsg = err.error.errors[0];
          this.loading = false;
        });
      }
    }
  }

}
