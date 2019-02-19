import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { trigger, state, style, transition, animate, query, stagger, keyframes} from '@angular/animations';
import * as moment from 'moment';
import { Router, ActivatedRoute } from '@angular/router';
import { isArray } from 'util';

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
export class SearchFiltersComponent implements OnInit, OnChanges {

  @Input() users;
  @Input() managers;
  @Input() statuses;
  @Input() currentPage;
  @Input() sort;
  @Output() submit = new EventEmitter<object>();

  openSearchFilter = false;
  filterState = 'in';
  skipToggle = true;
  form: FormGroup;
  // daterange = {
  //   start: moment().format('YYYY/MM/DD'),
  //   end: moment().format('YYYY/MM/DD')
  // };
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
  dateOpts = [
    {id: 1, label: 'Today'},
    {id: 2, label: 'This Week'},
    {id: 3, label: 'This Month'},
    {id: 4, label: 'Date Range'},
  ]

  allUser = {id: '', display_name: 'All'};
  selectedDateFilter: number = this.dateOpts[1]['id'];
  selectedManagerFilter = this.allUser;
  selectedUserFilter = this.allUser;
  selectedStatusesFilter = ['All'];

  queryParams = {
    dateFilter: this.selectedDateFilter,
    startDate: this.options.startDate,
    endDate: this.options.endDate,
    employee_id: this.selectedUserFilter['id'],
    manager_id: this.selectedManagerFilter['id'],
    status: this.selectedStatusesFilter,
    page: 1,
    sort: 'scheduled_at',
    order: 'asc'
  }

  private sub: any;
  get f() { return this.form.controls; }

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      date_since: [this.options.startDate, Validators.required],
      date_until: [this.options.endDate, Validators.required],
      employee_id: [this.selectedUserFilter.id, Validators.required],
      manager_id: [this.selectedManagerFilter.id, Validators.required],
      'status': [this.selectedStatusesFilter, Validators.required],
    });

    this.sub = this.route.queryParams.subscribe(params => {
      if(Object.keys(params).length > 0) {
        var dateFilter = +params.dateFilter;
        this.chooseDateRange(dateFilter);
        this.selectedDate({start: params.startDate, end: params.endDate});
        this.options.startDate = params.startDate;
        this.options.endDate = params.endDate;
        if(isArray(params["status"])) {
          for(let s of params["status"]) {
            this.addFilter(this.selectedStatusesFilter, s, 'status');
          }
        }else {
          this.addFilter(this.selectedStatusesFilter, params["status"], 'status');
        }
        if(params.employee_id) this.f.employee_id.setValue(+params.employee_id);
        if(params.manager_id) this.f.manager_id.setValue(+params.manager_id);
      
        this.queryParams['page'] = params.page;
      }
    });
    this.sub.unsubscribe();
    this.onSubmit(this.form.value);
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes.users && !changes.users.isFirstChange()){
      this.addFilter2('selectedManagerFilter', 'manager_id');
      this.addFilter2('selectedUserFilter', 'employee_id');
    }

    if(changes.currentPage && (changes.currentPage.previousValue != changes.currentPage.currentValue)) {
      this.router.navigate([], {queryParams: {page: this.currentPage}, queryParamsHandling: "merge"});
    }

    if(changes.sort && (changes.sort.previousValue != changes.sort.currentValue)) {
      let key = Object.keys(this.sort);
      this.queryParams['sort'] = key[0];
      this.queryParams['order'] = this.sort[key[0]];
      this.router.navigate([], {queryParams: this.queryParams, queryParamsHandling: "merge"});
    }
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
  }

  addFilter2(selectedAttr, attr) {
    let userId = this.form.get(attr).value;

    this[selectedAttr] = this.users.find(user => user.id == userId);
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
    this.skipToggle = true;
    this.onSubmit(this.form.value);
  }

  resetFilter() {
    this.selectedDateFilter = 1;
    this.selectedUserFilter = this.allUser;
    this.selectedManagerFilter = this.allUser;
    this.selectedStatusesFilter = ['All'];

    this.form.patchValue({
      date_since: moment().startOf('isoWeek').format('YYYY/MM/DD 00:00:00'),
      date_until: moment().startOf('isoWeek').format('YYYY/MM/DD 23:59:59'),
      employee_id: this.selectedUserFilter,
      manager_id: this.selectedManagerFilter,
      'status':  this.selectedStatusesFilter
    });
    this.onSubmit(this.form.value);
  }

  chooseDateRange(option) {
    this.selectedDateFilter = option;
    switch(option){
      case 1: {
        this.form.patchValue({
          date_since: moment().format('YYYY/MM/DD 00:00:00'),
          date_until: moment().format('YYYY/MM/DD 23:59:59')
        });

        // this.selectedDate(this.daterange);
        break;
      }
      case 2: {
        this.form.patchValue({
          date_since: moment().startOf('isoWeek').format('YYYY/MM/DD 00:00:00'),
          date_until: moment().endOf('isoWeek').format('YYYY/MM/DD 23:59:59')
        });

        // this.selectedDate(this.daterange);
        break;
      }
      case 3: {
        this.form.patchValue({
          date_since: moment().startOf('month').format('YYYY/MM/DD 00:00:00'),
          date_until: moment().endOf('month').format('YYYY/MM/DD 23:59:59')
        });

        // this.selectedDate(this.daterange);
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
    this.form.get('date_since').setValue(moment(value.start).format('YYYY/MM/DD 00:00:00'));
    this.form.get('date_until').setValue(moment(value.end).format('YYYY/MM/DD 23:59:59'));
  }

  onSelectDateOpt(option) {
    this.chooseDateRange(option);
    if(option != 4) {
      this.onSubmit(this.form.value);
    }
  }

  toggleSearchFilter(action){
    this.filterState = action;
  }

  onSubmit(values) {
    this.toggleSearchFilter('out');
    this.handleQueryParams();
    this.submit.emit(values);
  }

  handleQueryParams() {
    this.queryParams['startDate'] = this.f.date_since.value;
    this.queryParams['endDate'] = this.f.date_until.value;
    this.queryParams['dateFilter'] = this.selectedDateFilter;
    this.queryParams['status'] = this.selectedStatusesFilter;
    this.queryParams['employee_id'] = this.f.employee_id.value;
    this.queryParams['manager_id'] = this.f.manager_id.value;

    this.router.navigate([], {queryParams: this.queryParams, queryParamsHandling: "merge"});  
  }
}
