import { Component, OnInit, OnChanges, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { FormGroup,  FormBuilder, FormControl, Validators } from '@angular/forms';
import { MeetingService } from '../../../services/api';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {NgbTimeStruct} from '@ng-bootstrap/ng-bootstrap';

import * as moment from 'moment-timezone';
@Component({
  selector: 'reschedule-modal',
  templateUrl: './reschedule-modal.component.pug',
  styleUrls: ['./reschedule-modal.component.scss']
})

export class RescheduleModalComponent implements OnInit, OnChanges {

  @Input() meeting;
  @Input() visible;
  @Output() close: EventEmitter<any> = new EventEmitter<any>();
  @Output() updateMeeting: EventEmitter<any> = new EventEmitter<any>();

  meetingForm: FormGroup;
  loading: boolean = false;
  newSchedule: string;
  meridian = true;
  localTimezone: string = Intl.DateTimeFormat().resolvedOptions().timeZone;

  daterange: any;
  options: any = {
    locale: {
      format: 'DD MMMM YYYY',
      monthNames: [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
      ]
    },
    autoApply: true,
    autoUpdateInput: true,
    opens: 'left',
    minDate: moment().add(1, 'day').format('D MMMM YYYY'),
    startDate: this.newSchedule,
    singleDatePicker: true
  };

  constructor(
    private meetingApi: MeetingService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.meetingForm = this.fb.group({
      add_to_calendar: [true, Validators.required],
      scheduled_at: [this.options.startDate, Validators.required],
      time: [Validators.required],
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.meeting && !changes.meeting.isFirstChange()) {
      let initSched = moment(this.meeting.scheduled_at).format('DD MMMM YYYY');
      let time = this.extractTime(this.meeting.scheduled_at);
      this.meetingForm.get('scheduled_at').setValue(initSched);
      this.meetingForm.get('time').patchValue(time);
      this.meetingForm.get('add_to_calendar').setValue(this.meeting.add_to_calendar);
    }
  }

  extractTime(date) {
    let time = {
      hour: parseInt(moment(date).format('HH')),
      minute: parseInt(moment(date).format('mm')),
    }
    return time
  }

  selectedDate(value: any, datepicker?: any) {
    let newSchedule = moment(value.start).format('D MMMM YYYY');
    this.meetingForm.get('scheduled_at').setValue(newSchedule);
    this.meetingForm.get('scheduled_at').updateValueAndValidity();
  }

  save(values) {
    let datetime = this.formatDateTime(values);
    let params = {
      add_to_calendar: values.add_to_calendar,
      scheduled_at: datetime
    }
    this.loading = true;
    if (this.meetingForm.valid) {
      this.meetingApi.update(this.meeting.id, params)
      .subscribe( res => {
        this.updateMeeting.emit(res.data);
        this.close.emit();
      }, err => {
        this.loading = false;
      });
    }
  }

  formatDateTime(values) {
    let formatted = moment.tz(values['scheduled_at'], 'DD MMMM YYYY', 'America/New_york');

    formatted.hours(values['time']['hour'] || 0);
    formatted.minutes(values['time']['minute'] || 0);

    return formatted.format();
  }

}
