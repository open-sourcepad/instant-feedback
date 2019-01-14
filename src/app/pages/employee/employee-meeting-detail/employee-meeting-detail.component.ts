import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MeetingService, SessionService, DiscussionService, UserService } from 'src/app/services/api';

@Component({
  selector: 'app-employee-meeting-detail',
  templateUrl: './employee-meeting-detail.component.pug',
  styleUrls: ['./employee-meeting-detail.component.scss']
})
export class EmployeeMeetingDetailComponent implements OnInit {

  private sub: any;
  private slug_id: number;

  currentObj;
  actionItems;
  currentUser;
  meetingStatus;
  discussions = [];
  userIsManager: boolean = false;
  loading: boolean = false;
  paginate = {prev: null, next: null};

  //notes
  addNoteIdx: number = null;
  submittedNoteForm: boolean = false;
  employeeInputNote: string = '';

  //topic
  talkingPointForm: FormGroup;
  submittedPointForm: boolean = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private meetingApi: MeetingService,
    private discussionApi: DiscussionService,
    private userApi: UserService,
    private session: SessionService
  ) {
    this.currentUser = this.session.getCurrentUser();
    this.userIsManager = this.currentUser['is_manager'];
  }

  get tp() { return this.talkingPointForm.controls; }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.slug_id = +params['id'];

      if(this.slug_id){
        this.loadData(this.slug_id);
      }
    });

    // this.sub.unsubscribe();

    this.talkingPointForm = this.fb.group({
      meeting_id: [this.slug_id],
      talking_point_type: ['custom', Validators.required],
      custom_question: ['', Validators.required]
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  loadData(slug_id: number) {
    this.loading = true;
    this.meetingApi.get(slug_id)
      .subscribe( res => {
        this.loading = false;
        this.currentObj = res['data'];
        this.meetingStatus = this.currentObj['status'];
        this.discussions = res['data']['discussions']['data'];
        this.actionItems = res['data']['action_items'];
      }, err => {
        this.loading = false;
      });
    this.userApi.traverseMeeting(slug_id)
      .subscribe(res => {
        this.paginate['prev'] = res['prev']['data'];
        this.paginate['next'] = res['next']['data'];
      });
  }

  addNotes(idx) {
    this.addNoteIdx = idx;
    this.employeeInputNote = '';
  }

  submitTopic(values) {
    this.loading = true;
    this.submittedPointForm = true;

    if (this.talkingPointForm.valid) {
      this.discussionApi.create(values)
        .subscribe( res => {
          this.loadData(this.slug_id);
        }, err => {
          this.loading = false;
        });
      this.tp.custom_question.setValue('');
      this.tp.custom_question.updateValueAndValidity();
      this.submittedPointForm = false;
    }else {
      this.loading = false;
    }
  }

  submitNote(value, obj) {
    this.submittedNoteForm = true;

    if(value.trim() == '') {
      this.employeeInputNote = '';
      return;
    }
    let params = {employee_notes: value};
    this.discussionApi.update(obj.id, params)
      .subscribe(res => {
        this.loadData(this.slug_id);
      }, err => {
        this.loading = false;
      });
    this.submittedNoteForm = false;
  }
}
