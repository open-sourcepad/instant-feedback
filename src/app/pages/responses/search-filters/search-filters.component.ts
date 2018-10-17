import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import * as moment from 'moment';

@Component({
  selector: 'search-filters',
  templateUrl: './search-filters.component.pug',
  styleUrls: ['./search-filters.component.scss']
})
export class SearchFiltersComponent implements OnInit {

  @Input() questions;
  @Input() answers;
  @Input() loading;
  @Output() submit = new EventEmitter<object>();

  daterange: any = {
    start: moment().format('YYYY/MM/DD 00:00:00'),
    end: moment().format('YYYY/MM/DD 23:59:59')
  };
  //daterangepicker options
  options: any = {
    locale: {
      format: 'MM/DD/YYYY',
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
    alwaysShowCalendars: false,
    autoApply: true,
    autoUpdateInput: true,
    opens: 'left'
  };
  //dateranges option filters
  dateOpts = [
    {id: 1, label: 'Today'},
    {id: 2, label: 'This Week'},
    {id: 3, label: 'This Month'},
    {id: 4, label: 'Date Range'},
  ]

  openSearchFilter = true;
  form: FormGroup;

  //selected search filters
  selectedDateFilter = 1;
  selectedQuestionsFilter = ['All'];
  selectedAnswersFilter = ['All'];
  selectedUserFilter = 'All';

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.form = this.fb.group({
      date_since: [this.daterange.start, Validators.required],
      date_until: [this.daterange.end, Validators.required],
      user: [this.selectedUserFilter, Validators.required],
      questions: [this.selectedQuestionsFilter, Validators.required],
      answers: [this.selectedAnswersFilter, Validators.required],
    });
  }

  chooseDateRange(option) {
    this.selectedDateFilter = option;
    switch(option){
      case 1: {
        this.daterange = {
          start: moment().format('YYYY/MM/DD 00:00:00'),
          end: moment().format('YYYY/MM/DD 23:59:59')
        };
        break;
      }
      case 2: {
        this.daterange = {
          start: moment().startOf('week').format('YYYY/MM/DD 00:00:00'),
          end: moment().endOf('week').format('YYYY/MM/DD 23:59:59')
        };
        break;
      }
      case 3: {
        this.daterange = {
          start: moment().startOf('month').format('YYYY/MM/DD 00:00:00'),
          end: moment().endOf('month').format('YYYY/MM/DD 23:59:59')
        };
        break;
      }
      default: {
        break;
      }
    }

    this.selectedDate(this.daterange);
  }

  selectedDate(value: any, datepicker?: any) {
    // any object can be passed to the selected event and it will be passed back here
    if(datepicker){
      datepicker.start = value.start;
      datepicker.end = value.end;
    }

    // or manupulat your own internal property
    this.daterange.start = value.start;
    this.daterange.end = value.end;
    this.form.get('date_since').setValue(moment(value.start).format('YYYY/MM/DD 00:00:00'));
    this.form.get('date_until').setValue(moment(value.end).format('YYYY/MM/DD 23:59:59'));
  }

  addFilter(arr, value, attr) {
    arr.push(value)
    this.form.get(attr).setValue(arr);
  }

  toggleSearchFilter(){
    this.openSearchFilter = !this.openSearchFilter;
  }

  onSubmit(values) {
    this.loading = true;
    this.submit.emit(values);
  }

}
