import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';

import { ActionItemService, MeetingService } from '../../../services/api';
import * as moment from 'moment-timezone';

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
  @Input() prevActionItems;

  action: string = '';
  actionItemEditable: boolean = true;
  new_schedule: string = moment().add(2, 'w').format('D MMMM YYYY');
  addToCalendar: boolean = true;
  loading: boolean = false;
  localTimezone: string = Intl.DateTimeFormat().resolvedOptions().timeZone;
  editSchedule: boolean = false;
  tz: string = Intl.DateTimeFormat().resolvedOptions().timeZone;
  time;

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

  get m() { return this.meetingForm.controls; }

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
    this.loading = true;
    this.meetingForm = this.fb.group({
      'add_to_calendar': [Validators.required],
      'scheduled_at': [this.options.startDate, Validators.required],
      'time': [Validators.required],
    });
    if(this.meeting) {
      this.meetingForm.addControl('employee_id', new FormControl(this.meeting['employee']['id']));
      this.meetingForm.addControl('manager_id', new FormControl(this.meeting['manager']['id']));
      this.loading = false;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes.meeting && !changes.meeting.isFirstChange()){
      this.meetingForm.addControl('employee_id', new FormControl(this.meeting['employee']['id']));
      this.meetingForm.addControl('manager_id', new FormControl(this.meeting['manager']['id']));
      this.meetingForm.get('time').patchValue(this.time);
    }
    this.loading = false;
  }

  extractTime(date) {
    let time = {
      hour: parseInt(moment(date).format('HH')),
      minute: parseInt(moment(date).format('mm')),
    }
    return time
  }


  changeQuery(action) {
    this.router.navigate(['.'], { relativeTo: this.activeRoute, queryParams: {action: action}});
  }

  prevAction(){
    if(this.action == 'review' && this.discussions.length > 1){
      this.changeQuery(this.discussions.length);
    }

    if(this.action == 'review' && this.discussions.length == 1) {
      this.changeQuery('start')
    }

    if(this.action == 'schedule'){
      this.changeQuery('review');
    }
  }

  nextAction(action){
    this.changeQuery(action);
  }

  selectedDate(value: any, datepicker?: any) {
    this.new_schedule = moment.tz(value.start, this.localTimezone).format('D MMMM YYYY');
  }

  doneEdit(values) {
    this.editSchedule = false;
    this.meetingForm.get('scheduled_at').setValue(this.formatDateTime());
  }

  createMeeting(values){
    values['add_to_calendar'] = this.addToCalendar;
    values['scheduled_at'] = moment.tz(values.scheduled_at.slice(0, 19), moment.defaultFormat.slice(0, 19), 'America/New_york').format();
    this.meetingApi.create(values)
      .subscribe(res => {
        this.router.navigateByUrl(`/one-on-ones/${this.slug_id}`);
      }, err => {
        this.loading = false;
      });
  }

  finishMeeting(createVal){
    this.loading = true;
    this.meetingApi.update(this.slug_id, {status: 'done', finished_at: moment().format('YYYY-MM-DD HH:mm')})
      .subscribe(res => {
        this.createMeeting(createVal);
      }, err => {
        console.log('error', err);
        this.loading = false;
      });
  }

  formatDateTime() {
    let formatted = moment.tz(this.new_schedule, 'DD MMMM YYYY', this.localTimezone);

    if (this.time) {
      formatted.hours(this.time['hour']);
      formatted.minutes(this.time['minute']);
    } else {
      formatted.hours(0);
      formatted.minutes(0);
    }

    return formatted.format();
  }

  followUps() {
    return !!this.prevActionItems && this.prevActionItems.total_count > 0
  }

  isTalkingPoint(param) {
    return /^\d+$/.test(param) || param == 'start'
  }

}
