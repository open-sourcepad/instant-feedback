import { Component, OnInit, OnChanges, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { FormGroup,  FormBuilder, FormControl, Validators } from '@angular/forms';
import { MeetingService } from '../../../services/api';

import * as moment from 'moment';

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
      set_schedule: [this.options.startDate, Validators.required],
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.meeting && !changes.meeting.isFirstChange()) {
      let initSched = moment(this.meeting.set_schedule).format('DD MMMM YYYY');
      this.meetingForm.get('set_schedule').setValue(initSched);
    }
  }

  selectedDate(value: any, datepicker?: any) {
    let newSchedule = moment(value.start).format('D MMMM YYYY');
    this.meetingForm.get('set_schedule').setValue(newSchedule);
    this.meetingForm.get('set_schedule').updateValueAndValidity();
  }

  save(values) {
    this.loading = true;
    if (this.meetingForm.valid) {
      this.meetingApi.update(this.meeting.id, values)
      .subscribe( res => {
        this.updateMeeting.emit(res.data);
        this.close.emit();
      }, err => {
        this.loading = false;
      });
    }
  }

}
