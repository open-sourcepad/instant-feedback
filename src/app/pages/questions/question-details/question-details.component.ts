import { Component, OnInit } from '@angular/core';
import { FormGroup,  FormBuilder,  Validators } from '@angular/forms';
import * as moment from 'moment';

@Component({
  selector: 'app-question-details',
  templateUrl: './question-details.component.pug',
  styleUrls: ['./question-details.component.scss']
})
export class QuestionDetailsComponent implements OnInit {

  //daterangepicker options
  datepickeroptions: any = {
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
    opens: 'left',
    singleDatePicker: true
  };

  form: FormGroup;
  chosenDate = moment().format("D MMMM YYYY");
  recipientTypes = [
    { value: 'all', label: 'All' },
    { value: 'specific', label: 'Specific' }
  ]

  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      'message': ["", Validators.required],
      'occurence': [1, Validators.required],
      'trigger_schedule': ["once", Validators.required],
      'trigger_datetime': ["", Validators.required],
      'recipients': [""],
      'chosenDate': [this.chosenDate],
      'recipientType': [this.recipientTypes[0].value, Validators.required]
    });
  }

  selectedDate(value, datepicker){
    this.chosenDate = value.start.format("D MMMM YYYY");
    this.form.get('chosenDate').setValue(this.chosenDate);

  }

}
