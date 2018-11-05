import { Component, Input, OnInit } from '@angular/core';
import { FormGroup,  FormBuilder,  Validators } from '@angular/forms';
import { Chart } from 'chart.js';
import { PulseService } from '../../../services/api/pulse.service';
import * as moment from 'moment';

@Component({
  selector: 'team-pulse',
  templateUrl: './team-pulse.pug',
  styleUrls: ['./team-pulse.scss']
})
export class TeamPulseComponent implements OnInit {
  filter: string;
  happyUsers: any;
  sadUsers: any;
  questionsData: any;
  questionChart: any;
  answerPercentage: any;
  questionInstance: any;
  loading = false;

  form: FormGroup;
  selectedDateFilter = 1;
  daterange = {
    start: moment().startOf('week').format('YYYY/MM/DD 00:00:00'),
    end: moment().endOf('week').format('YYYY/MM/DD 23:59:59')
  };
  //daterangepicker options
  options: any = {
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

  data: any;

  constructor(
    private pulseService: PulseService,
    private fb: FormBuilder
  ) {
      this.filter = 'week';
      this.happyUsers = [];
      this.sadUsers = [];
      this.questionsData = [];
      this.questionChart = {};
      this.answerPercentage = {x: 0, idle: 0};
    }

  ngOnInit() {
    this.form = this.fb.group({
      date_since: [this.daterange.start, Validators.required],
      date_until: [this.daterange.end, Validators.required],
      filter: [this.filter, Validators.required]
    });
    this.filterStats();
  }

  filterStats(){
    this.loading = true;
    this.pulseService.query(this.form.value)
      .subscribe(res => {
        this.loading = false;
        this.happyUsers = res['happy_users'];
        this.sadUsers = res['sad_users'];
        this.answerPercentage['x'] = res['answer_percentage']['x'];
        this.answerPercentage['idle'] = res['answer_percentage']['idle'];
        for(let question of res['stats_per_questions']){
          let currentData;
          if(question['data'].length > 0){
            for(let questionStats of question['data']) {
              if(questionStats['date'] == 'current') {
                currentData = questionStats['percentage'];
              }
            }
            this.generateQuestionChart(question);
          }
          this.questionsData.push({id: question['id'], question: question['question'], answers: currentData});
        }
    });
  }

  chooseDateRange(option) {
    this.selectedDateFilter = option;
    switch(option){
      case 1: {
        this.form.get('filter').setValue('week');
        this.daterange = {
          start: moment().startOf('week').format('YYYY/MM/DD 00:00:00'),
          end: moment().endOf('week').format('YYYY/MM/DD 23:59:59')
        };

        this.selectedDate(this.daterange);
        break;
      }
      case 2: {
        this.form.get('filter').setValue('month');
        this.daterange = {
          start: moment().startOf('month').format('YYYY/MM/DD 00:00:00'),
          end: moment().endOf('month').format('YYYY/MM/DD 23:59:59')
        };

        this.selectedDate(this.daterange);
        break;
      }
      case 3: {
        this.form.get('filter').setValue('year');
        this.daterange = {
          start: moment().startOf('year').format('YYYY/MM/DD 00:00:00'),
          end: moment().endOf('year').format('YYYY/MM/DD 23:59:59')
        };

        this.selectedDate(this.daterange);
        break;
      }
      default: {
        this.form.get('filter').setValue('custom');
        break;
      }
    }
  }

  selectedDate(value: any, datepicker?: any) {
    if(datepicker){
      datepicker.start = value.start;
      datepicker.end = value.end;
    }

    this.daterange.start = value.start;
    this.daterange.end = value.end;
    this.form.get('date_since').setValue(moment(value.start).format('YYYY/MM/DD 00:00:00'));
    this.form.get('date_until').setValue(moment(value.end).format('YYYY/MM/DD 23:59:59'));
  
    this.filterStats();
  }

  generateQuestionChart(question) {
    if (!!this.questionChart[question['id']]) {
      this.questionChart[question['id']].destroy()
    }

    let canvas_name = `canvas${question['id']}`;
    let canvas : any = document.getElementById(canvas_name);
    let chart = canvas.getContext("2d");

    let data  = {
        labels: question["data"].map(data => data['date']),
        datasets: [{
          backgroundColor: 'rgb(65, 82, 104)',
          pointBackgroundColor: 'white',
          borderWidth: 4,
          borderColor: '#83d6c0',
          data: question["data"].map(data => data['percentage']['happy'])
        }]
    };

    this.questionChart[question['id']] = new Chart(chart, {
        type: 'line',
        data: data,
        options: {
          scales: {
              yAxes: [{
                  ticks: {
                      beginAtZero:true
                  }
              }]
          }
        }
    });
  }


  // lineChart(teamPulseData){
  //   if (!!this.lineChartInstance) {
  //     this.lineChartInstance.destroy()
  //   }
  //   let canvas : any = document.getElementById('canvas2');
  //   let chart = canvas.getContext("2d");
  //   let data  = {
  //       labels: [ 'Aug 20', 'Aug 27', 'Sep 3', 'Sep 10', 'Sep 17','Sep 24', 'Oct 1', 'This Week' ],
  //       datasets: [{
  //         backgroundColor: 'rgb(65, 82, 104)',
  //         pointBackgroundColor: 'white',
  //         borderWidth: 4,
  //         borderColor: '#83d6c0',
  //         data: [ 20, 15, 27, 59, 24, 52, 74, 42]
  //       }]
  //   };


  //   let options = {
  //     responsive: true,
  //     maintainAspectRatio: true,
  //     animation: {
  //       easing: 'easeInOutQuad',
  //       duration: 300
  //     },
  //     scales: {
  //       xAxes: [{
  //         gridLines: {
  //           color: 'rgba(200, 200, 200, 0.05)',
  //           lineWidth: 1
  //         }
  //       }],
  //       yAxes: [{
  //         gridLines: {
  //           color: 'rgba(200, 200, 200, 0.08)',
  //           lineWidth: 1
  //         },
  //         ticks: {
  //           beginAtZero: true,
  //           suggestedMin: 0,
  //           suggestedMax: 100,
  //           stepSize: 10,
  //           callback: function(tick) {
  //             return tick.toString() + '%';
  //           }
  //         }
  //       }]
  //     },
  //     elements: {
  //       line: {
  //         tension: 0.4
  //       }
  //     },
  //     legend: {
  //       display: false
  //     },
  //     point: {
  //       backgroundColor: 'white'
  //     },
  //     tooltips: {
  //       titleFontFamily: 'Open Sans',
  //       backgroundColor: 'rgba(0,0,0,0.3)',
  //       titleFontColor: 'red',
  //       caretSize: 5,
  //       cornerRadius: 2,
  //       xPadding: 10,
  //       yPadding: 10,
  //       callbacks: {
  //         label: function(tooltipItem, data) {
  //           let dataset = data.datasets[tooltipItem.datasetIndex];
  //           let label = data.labels[tooltipItem.index];
  //           return  'Happy for ' + label + ' is ' + dataset.data[tooltipItem.index] + "%";
  //         }
  //       }
  //     },
  //     annotation: {
  //       annotations: [{
  //         type: 'line',
  //         mode: 'horizontal',
  //         scaleID: 'y-axis-0',
  //         value: 40,
  //         borderColor: 'rgb(75, 192, 192)',
  //         borderWidth: 4,
  //         label: {
  //           enabled: false,
  //           content: 'Test label'
  //         }
  //       }]
  //     }
  //   };


  //   this.lineChartInstance = new Chart(chart, {
  //       type: 'line',
  //       data: data,
  //       options: options
  //   });
  // }
}
