import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { trigger, state, style, transition, animate, query, stagger, keyframes} from '@angular/animations';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MeetingService, DiscussionService,
  SessionService, TalkingPointService } from '../../../services/api';

@Component({
  selector: 'app-meeting-details',
  templateUrl: './meeting-details.component.pug',
  styleUrls: ['./meeting-details.component.scss'],
  animations: [
    trigger('slideInOut', [
      state('in', style({
        transform: 'translate3d(0, 0, 0)'
      })),
      state('out', style({
        transform: 'translate3d(100%, 0, 0)'
      })),
      transition('in => out', animate('400ms ease-in-out')),
      transition('out => in', animate('400ms ease-in-out'))
    ]),
    trigger('listAnimation', [
      transition('* => *', [

        query(':enter', style({ opacity: 0 }), {optional: true}),

        query(':enter', stagger('300ms', [
          animate('1s ease-in', keyframes([
            style({opacity: 0, transform: 'translateY(-75%)', offset: 0}),
            style({opacity: .5, transform: 'translateY(35px)',  offset: 0.3}),
            style({opacity: 1, transform: 'translateY(0)',     offset: 1.0}),
          ]))]), {optional: true})
      ])
    ])
  ]
})
export class MeetingDetailsComponent implements OnInit {

  slug_id = null;
  loading = false;
  obj = null;
  discussions: any = [];
  actionItems: any = [];
  discussionObj: any = null;
  menuState: string = 'out';
  showActionsIdx: number = null;
  actionEditable: boolean = false;
  meetingStatus: string = 'upcoming';
  currentUser: any = {};
  userIsManager: boolean = false;
  addNoteIdx: number = null;
  employeeInputNote: string = '';

  talkingPointForm: FormGroup;
  submittedPointForm: boolean = false;
  submittedNoteForm: boolean = false;
  showReschedModal: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private meetingApi: MeetingService,
    private discussionApi: DiscussionService,
    private session: SessionService,
    private talkingPointApi: TalkingPointService
  ) {
    this.currentUser = this.session.getCurrentUser();
    this.userIsManager = this.currentUser['is_manager'];
  }

  // convenience getter for easy access to form fields
  get tp() { return this.talkingPointForm.controls; }

  ngOnInit() {
    this.activeRoute.params.subscribe(params => {
      this.slug_id = +params['id'];

      if(this.slug_id){
        this.loadData(this.slug_id);
      }
    });

    this.talkingPointForm = this.fb.group({
      talking_point_type: ['custom', Validators.required],
      custom_question: ['', Validators.required]
    });
  }

  loadData(slug_id: number) {
    this.loading = true;
    this.meetingApi.get(slug_id)
      .subscribe( res => {
        this.loading = false;
        this.obj = res['data'];
        this.meetingStatus = this.obj.status;
        this.actionEditable = this.meetingStatus != 'done';
        this.discussions = res['data']['discussions']['data'];
        this.actionItems = res['data']['action_items'];
      }, err => {
        this.loading = false;
      });
  }

  addTalkingPoints() {
    this.menuState = this.menuState === 'out' ? 'in' : 'out';
    if(this.menuState === 'out'){
      this.discussionObj = null;
    }
  }

  saveDiscussion(obj) {
    this.loading = true;
    var params = Object.assign(obj.values, {meeting_id: this.slug_id});
    if(obj.action == "create") {
      this.discussionApi.create(params)
        .subscribe( res => {
          this.loadData(this.slug_id);
        }, err => {
          this.loading = false;
        });
    }else {
      this.discussionApi.update(this.discussionObj.id, params)
        .subscribe( res => {
          this.loadData(this.slug_id);
        }, err => {
          this.loading = false;
        });
    }
  }

  editDiscussion(obj) {
    this.discussionObj = obj;
    this.addTalkingPoints();
  }

  removeDiscussion(obj, idx) {
    this.loading = true;
    this.discussionApi.destroy(obj.id)
      .subscribe( res => {
        this.loading = false;
        this.discussions.splice(idx, 1);
      }, err => {
        this.loading = false;
      });
  }

  moveUp(item, idx) {
    item.point_order -= 1;
    let adjItem = this.discussions[idx - 1];
    adjItem.point_order += 1;

    this.discussions.splice(idx, 1);
    this.discussions.splice(idx - 1, 0, item);

    this.updateOrder(item);
    this.updateOrder(adjItem);
  }

  moveDown(item, idx) {
    item.point_order += 1;
    let adjItem = this.discussions[idx + 1];
    adjItem.point_order -= 1;

    this.discussions.splice(idx, 1);
    this.discussions.splice(idx + 1, 0, item);

    this.updateOrder(item);
    this.updateOrder(adjItem);
  }

  updateOrder(values) {
    // this.loading = true;
    let params = Object.assign(values, {meeting_id: this.slug_id});
    this.discussionApi.update(params.id, params)
      .subscribe( res => {
        // this.loading = false;
      }, err => {
        // this.loading = false;
      });
  }

  startDiscussion(){
    this.router.navigateByUrl(`/one-on-ones/${this.slug_id}/discussion?action=start`);
  }

  addNotes(idx) {
    this.addNoteIdx = idx;
    this.employeeInputNote = '';
  }

  submitTopic(values) {
    this.submittedPointForm = true;

    if (this.talkingPointForm.valid) {
      this.saveDiscussion({action: 'create', values: values});
      this.tp.custom_question.setValue('');
      this.tp.custom_question.updateValueAndValidity();
      this.submittedPointForm = false;
    }
  }

  submitNote(value, obj) {
    this.submittedNoteForm = true;

    if(value.trim() == '') {
      this.employeeInputNote = value.trim();
      return;
    }
    let params = {employee_notes: value};
    this.discussionObj = obj;
    this.saveDiscussion({action: 'update', values: params});
    this.submittedNoteForm = false;
  }

  closeReschedModal() {
    this.showReschedModal = false;
  }

  updateMeeting(meeting) {
    this.obj = meeting;
  }
}
