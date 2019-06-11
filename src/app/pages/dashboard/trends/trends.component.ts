import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { PulseService } from '../../../services/api/pulse.service';

@Component({
  selector: 'trends',
  templateUrl: './trends.pug',
  styleUrls: ['./trends.scss']
})
export class TrendsComponent implements OnInit, OnChanges {
  @Input() filter: string;
  @Input() daterange: any;

  trends: any;


  constructor(
    private pulseService: PulseService
  ) {
  }

  ngOnChanges(changes: any) {
    if (changes.filter || changes.daterange) {
      this.fetch_trends()
    }
  }

  ngOnInit() {
    this.fetch_trends()
  }

  fetch_trends() {
    this.pulseService.trends(this.params()).subscribe((params)=> {
      this.trends = params
    })
  }

  get_trend(key) {
    if (this.trends[key] >= 0.6) {
      return 'happy'
    } else if (this.trends[key] <= 0.4) {
      return 'sad'
    }

    return null
  }

  is_sad(trend) {
    trend <= 0.4
  }

  is_happy(trend) {
    trend > 0.6
  }

  get_duration(user_trend) {
    switch(this.filter) {
      case 'week':
        return user_trend ? 'for the last 3 weeks' : 'recently'
      case 'month':
        return 'this month'
      case 'year':
        return 'this year'
      case 'custom':
        return 'during this period'
    }
  }

  params() {
    return {
      date_since: this.daterange.start,
      date_until: this.daterange.end,
      filter: this.filter
    }
  }

  getDateQueryParams(filter=null, user=null) {
    return {
      questionFilter: filter,
      dateFilter: 4,
      dateSince: this.daterange.start,
      dateUntil: this.daterange.end,
      userFilter: !!user ? JSON.stringify({id: user.id, display_name: user.display_name}) : ''
    }
  }
}
