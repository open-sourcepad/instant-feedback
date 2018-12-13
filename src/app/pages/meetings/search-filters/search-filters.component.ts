import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { trigger, state, style, transition, animate, query, stagger, keyframes} from '@angular/animations';
import * as moment from 'moment';

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
    ]),
    trigger('listAnimation', [
      transition('* => *', [

        query(':enter', style({ opacity: 0 }), {optional: true}),

        query(':enter', stagger('300ms', [
          animate('1s ease-in', keyframes([
            style({opacity: 0, transform: 'translateY(-75%)', offset: 0}),
            style({opacity: .5, transform: 'translateY(35px)',  offset: 0.3}),
            style({opacity: 1, transform: 'translateY(0)',     offset: 1.0}),
          ]))]), {optional: true})
      ])
    ])
  ]
})
export class SearchFiltersComponent implements OnInit {

  @Input() loading;
  @Input() users;
  @Input() managers;
  @Input() statuses;
  @Output() submit = new EventEmitter<object>();

  openSearchFilter = false;
  filterState = 'out';
  skipToggle = true;
  form: FormGroup;
  daterange: any;
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
  dateOpts = [
    {id: 1, label: 'Today'},
    {id: 2, label: 'This Week'},
    {id: 3, label: 'This Month'},
    {id: 4, label: 'Date Range'},
  ]

  allUser = {id: '', display_name: 'All'};
  selectedDateFilter: number;
  selectedManagerFilter = this.allUser;
  selectedUserFilter = this.allUser;
  selectedStatusesFilter = ['All'];

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.skipToggle = false;
    this.resetFilter();
  }

  addFilter(arr, value, attr) {
    if(arr.indexOf(value) < 0) {
      arr.push(value);

      if(arr.indexOf('All') > -1 && value != 'All') {
        let idx = arr.indexOf('All');
        this.removeFilter(arr, idx, attr);
      }else if(value == 'All'){
        arr.splice(0,arr.length-1);
      }

      this.form.get(attr).setValue(arr);
    }
    this.onSubmit(this.form.value);
  }

  addFilter2(selectedAttr, attr) {
    let userId = this.form.get(attr).value;

    this[selectedAttr] = this.users.find(user => user.id == userId);
    this.onSubmit(this.form.value);
  }

  removeFilter(arr, idx, attr) {
    arr.splice(idx, 1);
    if(arr.length < 1) {
      this.skipToggle = true;
      this.addFilter(arr, 'All', attr);
      this.skipToggle = false;
    }
    this.form.get(attr).setValue(arr);
  }

  removeFilter2(selectedAttr, attr) {
    this[selectedAttr] = this.allUser;
    this.form.get(attr).setValue(this.allUser.id);
  }

  resetFilter() {
    this.daterange = {
      start: moment().format('YYYY/MM/DD 00:00:00'),
      end: moment().format('YYYY/MM/DD 23:59:59')
    };
    this.selectedDateFilter = 1;
    this.selectedUserFilter = this.allUser;
    this.selectedManagerFilter = this.allUser;
    this.selectedStatusesFilter = ['All'];

    this.form = this.fb.group({
      date_since: [this.daterange.start, Validators.required],
      date_until: [this.daterange.end, Validators.required],
      employee_id: [this.selectedUserFilter.id, Validators.required],
      manager_id: [this.selectedManagerFilter.id, Validators.required],
      'status': [this.selectedStatusesFilter, Validators.required],
    });
    this.onSubmit(this.form.value);
  }

  chooseDateRange(option) {
    this.selectedDateFilter = option;
    switch(option){
      case 1: {
        this.daterange = {
          start: moment().format('YYYY/MM/DD 00:00:00'),
          end: moment().format('YYYY/MM/DD 23:59:59')
        };

        this.selectedDate(this.daterange);
        break;
      }
      case 2: {
        this.daterange = {
          start: moment().startOf('isoWeek').format('YYYY/MM/DD 00:00:00'),
          end: moment().endOf('isoWeek').format('YYYY/MM/DD 23:59:59')
        };

        this.selectedDate(this.daterange);
        break;
      }
      case 3: {
        this.daterange = {
          start: moment().startOf('month').format('YYYY/MM/DD 00:00:00'),
          end: moment().endOf('month').format('YYYY/MM/DD 23:59:59')
        };

        this.selectedDate(this.daterange);
        break;
      }
      default: {
        break;
      }
    }
  }

  selectedDate(value: any, datepicker?: any) {
    // any object can be passed to the selected event and it will be passed back here
    if(datepicker){
      datepicker.start = value.start;
      datepicker.end = value.end;
    }

    // or manipulate your own internal property
    this.daterange.start = value.start;
    this.daterange.end = value.end;
    this.form.get('date_since').setValue(moment(value.start).format('YYYY/MM/DD 00:00:00'));
    this.form.get('date_until').setValue(moment(value.end).format('YYYY/MM/DD 23:59:59'));
  
    this.onSubmit(this.form.value);
  }


  toggleSearchFilter(){
    this.filterState = this.filterState === 'out' ? 'in' : 'out';
  }

  onSubmit(values) {
    this.loading = true;
    if(!this.skipToggle) {
      this.toggleSearchFilter();
    }
    this.submit.emit(values);
  }
}
