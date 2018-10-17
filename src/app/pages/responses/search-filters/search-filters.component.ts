import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'search-filters',
  templateUrl: './search-filters.component.pug',
  styleUrls: ['./search-filters.component.scss']
})
export class SearchFiltersComponent implements OnInit {

  @Input() questions;
  @Input() answers;

  public daterange: any = {};

  constructor() { }

  ngOnInit() {
  }

  public options: any = {
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

  public selectedDate(value: any, datepicker?: any) {
    // this is the date the iser selected
    console.log(value);

    // any object can be passed to the selected event and it will be passed back here
    datepicker.start = value.start;
    datepicker.end = value.end;

    // or manupulat your own internal property
    this.daterange.start = value.start;
    this.daterange.end = value.end;
    this.daterange.label = value.label;
  }

}
