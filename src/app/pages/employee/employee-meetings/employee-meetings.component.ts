import { Component, OnInit } from '@angular/core';
import { UserService, SessionService } from '../../../services/api';

@Component({
  selector: 'app-employee-meetings',
  templateUrl: './employee-meetings.component.pug',
  styleUrls: ['./employee-meetings.component.scss']
})
export class EmployeeMeetingsComponent implements OnInit {

  loading: boolean = false;
  collection: any = [];
  recordCount: number = 0;
  page: any = {number: 1, size: 20};

  constructor(
    private session: SessionService,
    private userApi: UserService
  ) { }

  ngOnInit() {
    this.loadCollection(this.page);
  }

  loadCollection(page) {
    this.userApi.allMeetings({page: page}).subscribe(res => {
      this.loading = false;
      this.collection = res['collection']['data'];
      this.recordCount = res['metadata']['record_count'];
    }, err => {
      this.loading = false;
    });
  }

}
