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
      'talking_point_type': ['custom', Validators.required],
      'custom_question': ['', Validators.required],
      'talking_point_id': [null]
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
      if(this.discussionObj.discuss_type == 'custom') {
        this.form = this.fb.group({
          'talking_point_type': [this.discussionObj.discuss_type, Validators.required],
          'custom_question': [this.discussionObj.question, Validators.required],
          'talking_point_id': [null]
        });
      }else {
        this.form = this.fb.group({
          'talking_point_type': [this.discussionObj.discuss_type, Validators.required],
          'talking_point_id': [this.discussionObj.talking_point_id, Validators.required],
          'custom_question': [null]
        });
      }
    }else {
      this.form = this.fb.group({
        'talking_point_type': ['custom', Validators.required],
        'custom_question': ['', Validators.required],
        'talking_point_id': [null]
      });
    }
  }

  updateForm(tp_type) {
    if(tp_type == 'default') {
      this.form.get('custom_question').clearValidators();
      this.form.get('talking_point_id').setValidators(Validators.required);
    }else {
      this.form.get('talking_point_id').clearValidators();
      this.form.get('custom_question').setValidators(Validators.required);
    }

    this.form.get('custom_question').updateValueAndValidity();
    this.form.get('talking_point_id').updateValueAndValidity();

  }

  selectTalkingPoint(value) {
    this.form.get('talking_point_id').setValue(value.id);
    this.form.get('talking_point_id').updateValueAndValidity();
  }

  onSubmit(values, action){
    this.loading = true;
    this.submitted = true;

    if(this.form.invalid) {
      this.loading = false;
      return;
    }

    this.save.emit({values, action});
    this.form.get('custom_question').setValue('');
    this.form.get('talking_point_id').setValue('');
    this.form.get('custom_question').updateValueAndValidity();
    this.form.get('talking_point_id').updateValueAndValidity();
    this.loading = false;
    this.submitted = false;
    this.cancel.emit();

  }

  onCancel(){
    this.cancel.emit();
  }

  alreadySelected(id){
    return this.selectedPoints.find(x => x['talking_point_id'] == id);
  }

}
