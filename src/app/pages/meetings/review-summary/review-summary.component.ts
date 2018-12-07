import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { ActionItemService, MeetingService } from '../../../services/api';
import * as moment from 'moment';

@Component({
  selector: 'review-summary',
  templateUrl: './review-summary.component.pug',
  styleUrls: ['./review-summary.component.scss']
})
export class ReviewSummaryComponent implements OnInit, OnChanges {

  @Input() actionItems;
  @Input() discussions;
  @Input() slug_id;
  @Input() meeting;


  action: string = '';
  actionItemEditable: boolean = true;
  new_schedule: string = moment().format('D MMMM YYYY');
  loading: boolean = false;

  meetingForm: FormGroup;

  daterange: any;
  //daterangepicker options
  options: any = {
    locale: {
      format: 'DD MMMM YYYY',
      monthNames: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
      ]
    },
    autoApply: true,
    autoUpdateInput: true,
    opens: 'left',
    startDate: this.new_schedule,
    singleDatePicker: true
  };

  constructor(
    private router: Router,
    private activeRoute: ActivatedRoute,
    private actionItemApi: ActionItemService,
    private meetingApi: MeetingService,
    private fb: FormBuilder
  ) {
    this.activeRoute.queryParams
      .subscribe(params => {
        var cur_position = (+params['action']);
        if((params['action'] == 'review' || params['action'] == 'schedule')) {
          this.action = params['action'];
        }else if(cur_position){
          this.changeQuery(cur_position);
        }else {
          this.changeQuery('start');
        }
      });
  }

  ngOnInit() {
    this.meetingForm = this.fb.group({
      'employee_id': [''],
      'manager_id': [''],
      'set_schedule': [this.options.startDate, Validators.required],
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes.meeting && !changes.meeting.isFirstChange()){
      var setSchedule = moment(this.meeting.set_schedule).add(2, 'M').format('D MMMM YYYY');
      this.meetingForm = this.fb.group({
        'employee_id': [this.meeting.employee.id],
        'manager_id': [this.meeting.manager.id],
        'set_schedule': [setSchedule, Validators.required],
      });
    }
  }


  changeQuery(action) {
    this.router.navigate(['.'], { relativeTo: this.activeRoute, queryParams: {action: action}});
  }

  prevAction(){
    if(this.action == 'review'){
      this.changeQuery(this.discussions.length);
    }

    if(this.action == 'schedule'){
      this.changeQuery('review');
    }
  }

  nextAction(action){
    this.changeQuery(action);
  }

  selectedDate(value: any, datepicker?: any) {
    this.new_schedule = moment(value.start).format('D MMMM YYYY');
  }

  setSchedule(value){
    this.meetingForm.get('set_schedule').setValue(value);
    this.meetingForm.get('set_schedule').updateValueAndValidity();
  }

  createMeeting(values){
    this.meetingApi.create(values)
      .subscribe(res => {
        this.router.navigateByUrl(`/one-on-ones/${this.slug_id}`);
      }, err => {
        this.loading = false;
      });
  }

  finishMeeting(createVal){
    this.loading = true;
    this.meetingApi.update(this.slug_id, {status: 'done', actual_schedule: moment().format('YYYY-MM-DD')})
      .subscribe(res => {
        this.createMeeting(createVal);
      }, err => {
        this.loading = false;
      });
  }

}
