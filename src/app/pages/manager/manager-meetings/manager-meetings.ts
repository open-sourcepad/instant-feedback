import { Component, OnInit } from '@angular/core';
import { SessionService, UserService } from '../../../services/api';
import { PaginationInstance } from 'ngx-pagination';

@Component({
  selector: 'app-manager-meetings',
  templateUrl: './manager-meetings.component.pug',
  styleUrls: ['./manager-meetings.component.scss']
})

export class ManagerMeetingsComponent implements OnInit {

  loading: boolean = false;
  collection: any = [];
  recordCount: number = 0;

  paginationControls: PaginationInstance = {
    id: 'paginationResults',
    itemsPerPage: 10,
    currentPage: 1,
    totalItems: 0
  }

  constructor(
    private session: SessionService,
    private userApi: UserService
  ) { }

  ngOnInit() {
  }

}
