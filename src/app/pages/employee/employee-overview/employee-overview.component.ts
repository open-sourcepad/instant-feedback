import { Component, OnInit } from '@angular/core';
import { MeetingService, MyMeetingService, UserService } from '../../../services/api';
import { User } from '../../../models';
import * as moment from 'moment';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-employee-overview',
  templateUrl: './employee-overview.component.pug',
  styleUrls: ['./employee-overview.component.scss']
})
export class EmployeeOverviewComponent implements OnInit {

  upcoming_meetings: any = [];
  past_meetings: any = [];
  past_meeting_action_items: any = [];
  loading: boolean = false;
  hoverActionItemIdx: number = null;
  currentSession: any = {data: null, idx: null};
  showModal: boolean = false;
  modalText: any = {body: ''};
  modalButtons: any = {cancel: {text: 'Cancel'}, confirm: {text: 'Yes, delete.'}};
  employee_id: number = null;

  constructor(
    private meetingApi: MeetingService,
    private myMeetingApi: MyMeetingService,
    private userApi: UserService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.loadMeetings();
  }

  loadMeetings() {
    this.loading = true;
    this.route.parent.params.subscribe(params => {
      if(Object.keys(params).length > 0) {
        this.employee_id = +params['id'];
        this.userApi.meetings(this.employee_id, {order: {scheduled_at: 'desc'}}).subscribe(res => {
          this.loading = false;
          this.upcoming_meetings = res['collection']['data'].filter(d => d['status'] == 'upcoming');
          this.past_meetings = res['collection']['data'].filter(d => d['status'] == 'done');
        }, err => {
          this.loading = false;
        });
      }else {
        this.myMeetingApi.search({order: {scheduled_at: 'desc'}}).subscribe(res => {
          this.loading = false;
          this.upcoming_meetings = res['collection']['data'].filter(d => d['status'] == 'upcoming');
          this.past_meetings = res['collection']['data'].filter(d => d['status'] == 'done');
        }, err => {
          this.loading = false;
        });
      }
    });
  }

  past_meeting_text(obj) {
    let employee = new User(obj.employee);
    let manager = new User(obj.manager);

    return `${employee.first_display_name()} & ${manager.first_display_name()}`
  }

  clearItem(obj, idx) {
    this.modalStateChange(true);
    this.currentSession.data = obj;
    this.currentSession.idx = idx;
    let sessionDate = moment(obj.finished_at).format('MMMM D');
    let text = `Are you sure you want to delete all action items on <span class="text-brown">${sessionDate}</span> 1-on-1 session?`;
    this.modalText = {body: text};
  }

  modalStateChange(value) {
    this.showModal = value;
  }

  removeItems(values){
    this.loading = true;
    if(this.employee_id) {
      this.userApi.remove_action_items(this.employee_id, values.data.id)
        .subscribe(res => {
          this.loading = false;
          this.past_meetings[values.idx]['action_items']['employee'] = [];
        }, err => {
          this.loading = false;
        });
    }else {
      this.myMeetingApi.remove_action_items(values.data.id)
        .subscribe(res => {
          this.loading = false;
          this.past_meetings[values.idx]['action_items']['employee'] = [];
        }, err => {
          this.loading = false;
        });
    }
  }

}
