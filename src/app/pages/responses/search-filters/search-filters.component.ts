import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as moment from 'moment';
import { trigger, state, style, transition, animate } from '@angular/animations';
import $ from 'jquery';

@Component({
  selector: 'search-filters',
  templateUrl: './search-filters.component.pug',
  styleUrls: ['./search-filters.component.scss'],
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
    ])
  ]
})
export class SearchFiltersComponent implements OnInit {

  @Input() questions;
  @Input() answers;
  @Input() users;
  @Input() loading;
  @Output() submit = new EventEmitter<object>();

  daterange: any;
  //daterangepicker options
  options: any = {
    locale: {
      format: 'YYYY/MM/DD',
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
    opens: 'left',
    startDate: moment().startOf('isoWeek').format('YYYY/MM/DD 00:00:00'),
    endDate: moment().endOf('isoWeek').format('YYYY/MM/DD 23:59:59')
  };
  //dateranges option filters
  dateOpts = [
    {id: 1, label: 'Today'},
    {id: 2, label: 'This Week'},
    {id: 3, label: 'This Month'},
    {id: 4, label: 'Date Range'},
  ]

  filterMenu = 'out';
  skipToggle = true;
  form: FormGroup;
  allUser = {id: '', display_name: 'None'};

  //selected search filters
  selectedDateFilter: number;
  selectedQuestionsFilter: any;
  selectedAnswersFilter: any;
  selectedUserFilter: any;
  showDateRangePicker = false;

  constructor(private fb: FormBuilder) { }

  get filters() { return this.form.controls; }

  ngOnInit() {
    this.resetFilter();
    this.skipToggle = false;
  }

  chooseDateRange(option) {
    this.selectedDateFilter = option;
    switch(option){
      case 1: {
        this.form.patchValue({
          date_since: moment().format('YYYY/MM/DD 00:00:00'),
          date_until: moment().format('YYYY/MM/DD 23:59:59')
        });

        break;
      }
      case 2: {
        this.form.patchValue({
          date_since: moment().startOf('isoWeek').format('YYYY/MM/DD 00:00:00'),
          date_until: moment().endOf('isoWeek').format('YYYY/MM/DD 23:59:59')
        });

        break;
      }
      case 3: {
        this.form.patchValue({
          date_since: moment().startOf('month').format('YYYY/MM/DD 00:00:00'),
          date_until: moment().endOf('month').format('YYYY/MM/DD 23:59:59')
        });

        break;
      }
      case 4: {
        this.showDateRangePicker = true;
        break;
      }
      default: {
        break;
      }
    }
    if(option != 4) {
      this.onSubmit(this.form.value);
      this.showDateRangePicker = false;
    }
  }

  selectedDate(value: any, datepicker?: any) {
    // any object can be passed to the selected event and it will be passed back here
    if(datepicker){
      datepicker.start = value.start;
      datepicker.end = value.end;
    }

    // or manupulat your own internal property
    this.form.patchValue({
      date_since: moment(value.start).format('YYYY/MM/DD 00:00:00'),
      date_until: moment(value.end).format('YYYY/MM/DD 23:59:59')
    });

    this.onSubmit(this.form.value);
  }

  addFilter(arr, value, attr) {
    if(arr.indexOf(value) < 0) {
      arr.push(value);

      if(arr.indexOf('None') > -1 && value != 'None') {
        let idx = arr.indexOf('None');
        this.removeFilter(arr, idx, attr);
      }else if(value == 'None'){
        arr.splice(0,arr.length-1);
      }

      this.form.get(attr).setValue(arr);
    }
    this.onSubmit(this.form.value);
    this.showDateRangePicker = false;
  }

  removeFilter(arr, idx, attr) {

    arr.splice(idx, 1);
    if(arr.length < 1) {
      this.skipToggle = true;
      this.addFilter(arr, 'None', attr);
      this.skipToggle = false;
    }
    this.form.get(attr).setValue(arr);
  }

  addUserFilter(selectedAttr, attr) {
    let userId = this.form.get(attr).value;

    this[selectedAttr] = this.users.find(user => user.id == userId);
  }

  removeUserFilter(selectedAttr, attr) {
    this[selectedAttr] = this.allUser;
    this.form.get(attr).setValue(this.allUser.id);
    this.skipToggle = true;
    this.onSubmit(this.form.value);
  }

  resetFilter() {
    this.selectedDateFilter = 2;
    this.selectedQuestionsFilter = ['None'];
    this.selectedAnswersFilter = ['None'];
    this.selectedUserFilter = this.allUser;

    this.form = this.fb.group({
      date_since: [this.options.startDate, Validators.required],
      date_until: [this.options.endDate, Validators.required],
      user_id: [this.selectedUserFilter.id, Validators.required],
      questions: [this.selectedQuestionsFilter, Validators.required],
      answers: [this.selectedAnswersFilter, Validators.required],
    });
    this.onSubmit(this.form.value);
  }

  toggleSearchFilter(value){
    this.filterMenu = value;
  }

  toggleDateRangePicker() {
    // $('#dateRangeInput').on('hide.daterangepicker', function(ev, picker) {
    //   $('#dateRangeInput').click();
    // });
    this.showDateRangePicker = true;

    // $('#dateRangeInput').click();
  }

  onSubmit(values) {
    this.loading = true;
    if(!this.skipToggle) {
      this.toggleSearchFilter('out');
    }
    values['page'] = {number: 1, size: 20};
    this.submit.emit(values);
  }

}
