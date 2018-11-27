import { Component, OnInit } from '@angular/core';
import { FormGroup,  FormBuilder, FormControl, Validators } from '@angular/forms';
import { TalkingPointService } from '../../../services/api';

@Component({
  selector: 'talking-point-menu',
  templateUrl: './talking-point-menu.component.pug',
  styleUrls: ['./talking-point-menu.component.scss']
})
export class TalkingPointMenuComponent implements OnInit {

  form: FormGroup;
  loading: boolean = false;
  talkingPoints: any = [];

  constructor(
    private fb: FormBuilder,
    private talkingPointApi: TalkingPointService
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      'point_type': ['custom', Validators.required],
      'question': ['', Validators.required]
    });
    this.loadTalkingPoints();
  }

  loadTalkingPoints() {
    this.talkingPointApi.query({}).subscribe( res => {
      this.talkingPoints = res['collection']['data'];
      this.loading = false;
    }, err => {
      this.loading = false;
    });
  }

  updateForm(tp_type) {
    if(tp_type == 'default') {
      this.form.removeControl('question');
      this.form.addControl('talking_point', new FormControl('', Validators.required));
    }else {
      this.form.removeControl('talking_point');
      this.form.addControl('question', new FormControl('', Validators.required));

    }
  }

  selectTalkingPoint(value) {
    this.form.get('talking_point').setValue(value);
  }

}
