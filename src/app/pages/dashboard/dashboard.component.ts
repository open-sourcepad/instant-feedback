import { Component, OnInit } from '@angular/core'
import * as moment from 'moment';

@Component({
  templateUrl: './dashboard.pug',
  styleUrls: ['./dashboard.scss']
})

export class DashboardComponent implements OnInit {
  public isCollapsed = true;
  public filter = "week"
  public daterange = {
    start: moment().startOf('isoWeek').format('YYYY/MM/DD 00:00:00'),
    end: moment().endOf('isoWeek').format('YYYY/MM/DD 23:59:59')
  }

  constructor(
  ) {
  }

  ngOnInit() {

  }



}
