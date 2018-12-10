import { Component, OnInit } from '@angular/core';
import { UserService, UserQuestionService } from '../../services/api';
import { FormGroup,  FormBuilder, FormControl, Validators } from '@angular/forms';
import * as moment from 'moment';

@Component({
  selector: 'app-user-questions',
  templateUrl: './user-questions.component.pug',
  styleUrls: ['./user-questions.component.scss']
})
export class UserQuestionsComponent implements OnInit {

  collection: any = [];
  recordCount: number = 0;
  loading: boolean = false;
  page = {number: 1, size: 20};
  new_schedule: string = moment().format('YYYY-MM-DD');
  currentObj: any = null;
  editIdx: number = null;
  users: any = [];

  //daterangepicker options
  options: any = {
    locale: {
      format: 'YYYY-MM-DD',
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

  daterange = {
    start: moment().startOf('isoWeek').format('YYYY/MM/DD 00:00:00'),
    end: moment().endOf('isoWeek').format('YYYY/MM/DD 23:59:59')
  };
  rangeOpts: any = {
    locale: {
      format: 'YYYY-MM-DD',
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
    opens: 'right',
    startDate: this.daterange.start,
    endDate: this.daterange.end
  };

  form: FormGroup;

  constructor(
    private userQuestonApi: UserQuestionService,
    private userApi: UserService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.userApi.query({})
      .subscribe(res => {
        this.users = res['collection']['data'].map(user => {
          return {id: user.id, name: user.display_name};
        });
        this.users.unshift({id:'', name: 'All'});
      });
    this.form = this.fb.group({
      user_id: [''],
      date_since: [this.daterange.start, Validators.required],
      date_until: [this.daterange.end, Validators.required],
    });

    this.loadCollection(this.form.value);
  }

  loadCollection(values){
    this.loading = true;
    let params = Object.assign(values, {page: this.page})
    this.userQuestonApi.searchByUser(params)
      .subscribe(res => {
        this.loading = false;
        this.collection = res['collection']['data'];
        this.recordCount = res['metadata']['record_count'];
      }, err => {
        this.loading = false;
      });
  }

  changePage(evt, values) {
    this.currentObj = null;
    this.editIdx = null;
    this.page['number'] = evt;
    this.loadCollection(values);
  }

  selectedDate(value: any, datepicker?: any) {
    this.new_schedule = moment(value.start).format('YYYY-MM-DD');
  }

  edit(obj, idx) {
    this.currentObj = obj;
    this.editIdx = idx;
  }

  cancel(){
    this.currentObj = null;
    this.editIdx = null;
  }

  update(obj, idx){
    this.loading = true;
    this.userQuestonApi.update(obj.id, {asking_date: this.new_schedule})
      .subscribe(res => {
        this.loading = false;
        this.currentObj = null;
        this.editIdx = null;
        this.loadCollection(this.form.value);
      }, err => {
        this.loading = false;
      });
  }

  selectedRange(value: any, datepicker?: any) {
    if(datepicker){
      datepicker.start = value.start;
      datepicker.end = value.end;
    }

    this.daterange.start = value.start;
    this.daterange.end = value.end;
    this.form.get('date_since').setValue(moment(value.start).format('YYYY/MM/DD 00:00:00'));
    this.form.get('date_until').setValue(moment(value.end).format('YYYY/MM/DD 23:59:59'));
  
    this.loadCollection(this.form.value);
  }

}
