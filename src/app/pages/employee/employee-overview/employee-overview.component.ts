import { Component, OnInit } from '@angular/core';
import { MeetingService, SessionService, UserService, MyMeetingService } from '../../../services/api';
import { User } from '../../../models';
import * as moment from 'moment';

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

  constructor(
    private meetingApi: MeetingService,
    private myMeetingApi: MyMeetingService
  ) { }

  ngOnInit() {
    this.loadMeetings();
  }

  loadMeetings() {
    this.loading = true;
    this.myMeetingApi.search({order: {set_schedule: 'desc'}}).subscribe(res => {
      this.loading = false;
      this.upcoming_meetings = res['collection']['data'].filter(d => d['status'] == 'upcoming');
      this.past_meetings = res['collection']['data'].filter(d => d['status'] == 'done');
    }, err => {
      this.loading = false;
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
    let sessionDate = moment(obj.actual_schedule).format('MMMM D');
    let text = `Are you sure you want to delete all action items on <span class="text-brown">${sessionDate}</span> 1-on-1 session?`;
    this.modalText = {body: text};
  }

  modalStateChange(value) {
    this.showModal = value;
  }

  removeItems(values){
    this.loading = true;
    this.meetingApi.removeEmployeeActionItems(values.data.id)
      .subscribe(res => {
        this.loading = false;
        this.past_meetings[values.idx]['action_items']['employee'] = [];
      }, err => {
        this.loading = false;
      });
  }

}
