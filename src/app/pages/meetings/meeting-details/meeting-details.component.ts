import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { trigger, state, style, transition, animate, query, stagger, keyframes} from '@angular/animations';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { MeetingService, DiscussionService, SessionService } from '../../../services/api';
import { MeetingDiscussion, Meeting } from 'src/app/models';

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
  meeting = new Meeting();
  actionItems: any = [];
  discussionObj: any = null;
  menuState: string = 'out';
  showActionsIdx: number = null;
  actionEditable: boolean = false;
  meetingStatus: string = 'upcoming';
  currentUser: any = {};
  userIsManager: boolean = false;
  addNoteIdx: number = null;
  addNoteObj: Object = null;

  discussionForm: FormGroup;
  talkingPointForm: FormGroup;
  submittedPointForm: boolean = false;
  submittedNoteForm: boolean = false;
  showReschedModal: boolean = false;

  //confirmation modal
  showRemoveModal: boolean = false;
  modalText: any = {body: 'Are you sure you want to delete it?'};
  modalButtons: any = {cancel: {text: 'Cancel'}, confirm: {text: 'Yes, delete.'}};
  showEditLockedQuestion: boolean = false;
  editMode: boolean = false;;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private meetingApi: MeetingService,
    private discussionApi: DiscussionService,
    private session: SessionService
  ) {
    this.currentUser = this.session.getCurrentUser();
    this.userIsManager = this.currentUser['is_manager'];
  }

  // convenience getter for easy access to form fields
  get tp() { return this.talkingPointForm.controls; }
  get discussions() { return <FormArray>this.discussionForm.controls['discussions']; }
  get discussionFormData() { return this.discussionForm.get('discussions')['controls']; }

  ngOnInit() {
    this.discussionForm = this.fb.group({
      discussions: this.fb.array([])
    });

    this.activeRoute.params.subscribe(params => {
      this.slug_id = +params['id'];

      if(this.slug_id){
        this.loadData(this.slug_id);
      }
    });

    this.talkingPointForm = this.fb.group({
      meeting_objective_type: ['custom', Validators.required],
      question: ['', Validators.required]
    });
  }

  loadData(slug_id: number) {
    this.loading = true;
    this.meetingApi.get(slug_id)
      .subscribe( res => {
        this.loading = false;
        this.meeting = new Meeting(res['data']);
        this.meetingStatus = this.meeting.status;
        this.actionEditable = this.meetingStatus != 'done';
        res['data']['discussions']['data'].forEach(discussion => {
          let obj = new MeetingDiscussion(discussion);
          this.discussions.push(obj.setForm());
        });
        this.actionItems = res['data']['action_items'];
      }, err => {
        this.loading = false;
      });
  }

  showTalkingPointMenu() {
    this.menuState = this.menuState === 'out' ? 'in' : 'out';
    if(this.menuState === 'out'){
      this.discussionObj = null;
      this.showEditLockedQuestion = false;
      this.editMode = false;
    }
  }

  saveDiscussion(obj) {
    this.loading = true;
    var params = Object.assign(obj.values, {meeting_id: this.slug_id});
    if(obj.action == "create") {
      this.discussionApi.create(params)
        .subscribe( res => {
          let obj = new MeetingDiscussion(res['data']);
          this.discussions.push(obj.setForm());
          this.loading = false;
        }, err => {
          this.loading = false;
        });
    }else {
      let idx = this.discussions.controls.findIndex(x => x.value.id == this.discussionObj.id);
      this.discussionApi.update(this.discussionObj.id, params)
        .subscribe( res => {
          this.loading = false;
          this.discussions.at(idx).patchValue(res['data']);
        }, err => {
          this.loading = false;
        });
    }
  }

  editDiscussion(obj) {
    this.discussionObj = obj;
    if(obj.is_question_locked) {
      this.showEditLockedQuestion = true;
    }
    this.editMode = true;
    this.showTalkingPointMenu();
  }

  // reorder discussions
  moveUp(item, idx) {
    item.point_order -= 1;
    let adjItem = this.discussions.controls[idx - 1];
    let adjNewOrder = adjItem.get('point_order').value + 1;
    adjItem.patchValue({point_order: adjNewOrder});

    this.discussions.at(idx).patchValue(adjItem.value);
    this.discussions.at(idx - 1).patchValue(item);

    this.updateOrder(item);
    this.updateOrder(adjItem);
  }

  moveDown(item, idx) {
    item.point_order += 1;
    let adjItem = this.discussions.controls[idx + 1];
    let adjNewOrder = adjItem.get('point_order').value - 1;
    adjItem.patchValue({point_order: adjNewOrder});

    this.discussions.at(idx).patchValue(adjItem.value);
    this.discussions.at(idx + 1).patchValue(item);

    this.updateOrder(item);
    this.updateOrder(adjItem);
  }

  updateOrder(values) {
    this.discussionApi.update(values.id, values);
  }

  // redirect page: start meeting
  startDiscussion(){
    if(!this.meeting.started_at) {
      this.meetingApi.start(this.slug_id).subscribe(res => {
        this.router.navigateByUrl(`/one-on-ones/${this.slug_id}/discussion?action=start`);
      });
    }else {
      this.router.navigateByUrl(`/one-on-ones/${this.slug_id}/discussion?action=start`);
    }
  }

  // employee add note on discussion
  addNotes(idx, obj) {
    if(this.addNoteIdx) this.discussions.at(this.addNoteIdx).patchValue(this.addNoteObj);
    this.addNoteIdx = idx;
    this.addNoteObj = obj;
    this.submittedNoteForm = false;
  }

  submitNote(values) {
    this.loading = true;
    this.submittedNoteForm = true;

    if(this.discussions.controls[this.addNoteIdx].invalid) {
      this.loading = false;
      return;
    }else {
      this.discussionApi.update(values.id, values)
        .subscribe( res => {
          this.loading = false;
          this.submittedNoteForm = false;
          this.addNoteIdx = null;
          this.addNoteObj = null;
        }, err => {
          this.loading = false;
        });
    }
    return false;
  }

  // employee add new discussion
  submitTopic(values) {
    this.submittedPointForm = true;

    if (this.talkingPointForm.valid) {
      this.saveDiscussion({action: 'create', values: values});
      this.tp.question.setValue('');
      this.tp.question.updateValueAndValidity();
      this.submittedPointForm = false;
    }
  }

  // reschedule meeting
  closeReschedModal() {
    this.showReschedModal = false;
  }

  updateMeeting(meeting) {
    this.meeting = meeting;
  }

  // remove discussion
  removeDiscussion(values) {
    this.showRemoveModal = true;
    this.discussionObj = values;
  }

  confirmModalState(value){
    this.showRemoveModal = value;
  }

  onRemove(values) {
    this.loading = true;

    let idx = this.discussions.controls.findIndex(x => x.value.id == values.id);
    this.discussionApi.destroy(values.id)
      .subscribe( res => {
        this.loading = false;
        this.discussions.removeAt(idx)
        this.discussionObj = 'reset';
      }, err => {
        this.loading = false;
      });
  }
}
