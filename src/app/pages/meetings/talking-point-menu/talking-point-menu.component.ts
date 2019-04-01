import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup,  FormBuilder, FormControl, Validators } from '@angular/forms';
import { TalkingPointService } from '../../../services/api';

@Component({
  selector: 'talking-point-menu',
  templateUrl: './talking-point-menu.component.pug',
  styleUrls: ['./talking-point-menu.component.scss']
})
export class TalkingPointMenuComponent implements OnInit, OnChanges {

  @Input() discussionObj;
  @Input() selectedPoints;
  @Output() cancel = new EventEmitter<object>();
  @Output() save = new EventEmitter<object>();
  @Input() showEditLockedQuestion;
  @Input() editMode;


  form: FormGroup;
  loading: boolean = false;
  submitted: boolean = false;
  talkingPoints: any = [];

  constructor(
    private fb: FormBuilder,
    private talkingPointApi: TalkingPointService
  ) { }

  get f() { return this.form.controls; }

  ngOnInit() {
    this.form = this.fb.group({
      meeting_objective_type: ['custom', Validators.required],
      question: ['', Validators.required]
    });
    this.loadTalkingPoints();
  }

  loadTalkingPoints() {
    this.talkingPointApi.query({unassigned: true}).subscribe( res => {
      this.talkingPoints = res['collection']['data'];
      this.loading = false;
    }, err => {
      this.loading = false;
    });
  }

  ngOnChanges() {
    if(this.discussionObj){
      this.form.patchValue({
        meeting_objective_type: this.discussionObj.discuss_type,
        question: this.discussionObj.question
      });
    } else if(this.discussionObj == 'reset'){
      this.form.patchValue({
        meeting_objective_type: 'custom',
        question: ''
      });
      this.showEditLockedQuestion = false;
    }
  }

  updateFormQuestion(value) {
    this.form.get('question').setValue(value);
    this.form.get('question').updateValueAndValidity();
  }

  onSubmit(values, action){
    this.loading = true;
    this.submitted = true;

    if(this.form.invalid) {
      this.loading = false;
      return;
    }

    this.save.emit({values, action});
    this.form.patchValue({question: ''});
    this.loading = false;
    this.submitted = false;
    this.cancel.emit();

  }

  onCancel(){
    this.cancel.emit();
    this.form.patchValue({question: ''});
  }

  alreadySelected(question){
    return this.selectedPoints.find(x => x.value.question == question);
  }

}
