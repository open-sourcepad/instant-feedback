import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MeetingService, DiscussionService, SessionService, TalkingPointService} from '../../../services/api';
import { MeetingDiscussion, Meeting } from 'src/app/models';

@Component({
  selector: 'edit-talking-points',
  templateUrl: './edit-talking-points.component.pug',
  styleUrls: ['./edit-talking-points.component.scss']
})
export class EditTalkingPointsComponent implements OnInit {

  @Input() talkingPoint;
  @Output() toggleEdit = new EventEmitter<object>();
  @Output() loadData = new EventEmitter<object>();
  @Input() slug_id;
  @Input() formAction;
  @Output() changeQuery = new EventEmitter<object>();

  talkingPointForm: FormGroup;
  question;

  constructor(
    private router: Router,
    private activeRoute: ActivatedRoute,
    private fb: FormBuilder,
    private talkingPointApi: TalkingPointService,
    private discussionApi: DiscussionService,
  ) { }

  get t() { return this.talkingPointForm.controls; }

  ngOnInit() {

    this.talkingPointForm = this.fb.group({
      'talking_point': ['', Validators.required]
    });

    if(this.formAction == 'edit' && !!this.talkingPoint) {
      this.question = this.talkingPoint.question;
    }
  }

  submit(val) {
    if(this.formAction == 'edit' && !!this.talkingPoint) {
      this.editTalkingPoint(val)
    } else {
      this.addTalkingPoint(val)
    }
  }

  editTalkingPoint(val) {
    let params = {
      question: val.talking_point
    }

    if(!!val.talking_point) {
      this.discussionApi.update(this.talkingPoint.id, params)
        .subscribe( res => {
          this.loadData.emit();
          this.toggleEdit.emit({action: 'edit'});
        }, err => {
        });
    } else {
      this.toggleEdit.emit({action: 'edit'});
    }
  }

  addTalkingPoint(val) {

    if(!!val.talking_point) {
      let params  = {
        meeting_objective_type: 'custom',
        meeting_id: this.slug_id,
        question: val.talking_point,
        is_question_locked: false
      }
      
      this.discussionApi.create(params)
        .subscribe( res => {
          this.toggleEdit.emit({action: 'add'});
          this.changeQuery.emit(res['data'].point_order);
          this.loadData.emit();
        }, err => {
        });
    } else {
      this.toggleEdit.emit({action: 'add'});
    }

  }

  cancel() {
    this.toggleEdit.emit({action: this.formAction});
  }

}
