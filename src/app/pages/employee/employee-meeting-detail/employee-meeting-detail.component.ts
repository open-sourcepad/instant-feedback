import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MeetingService, SessionService, DiscussionService, UserService, MyMeetingService } from 'src/app/services/api';

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
    private meetingApi: MyMeetingService,
    private discussionApi: DiscussionService,
    private session: SessionService,
    private router: Router,
    private userApi: UserService
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

    this.meetingApi.profile(slug_id)
      .subscribe( res => {
        this.loading = false;
        this.currentObj = res['data'];
        this.meetingStatus = this.currentObj['status'];
        this.discussions = res['data']['discussions']['data'];
        this.actionItems = res['data']['action_items'];
        this.paginate['prev'] = res['links']['prev'];
        this.paginate['next'] = res['links']['next']
      }, err => {
        this.loading = false;
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

  navigate(url) {
    this.router.navigateByUrl(url);
  }
}
