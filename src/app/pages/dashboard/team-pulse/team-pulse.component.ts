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
  questionsChart: any;
  answerPercentage: any;
  happyChart: any;
  loading = false;

  form: FormGroup;
  selectedDateFilter = 1;
  daterange = {
    start: moment().startOf('isoWeek').format('YYYY/MM/DD 00:00:00'),
    end: moment().endOf('isoWeek').format('YYYY/MM/DD 23:59:59')
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
      this.questionsChart = {};
      this.answerPercentage = {x: 0, idle: 0, happy: 0};
    }

  ngOnInit() {
    this.form = this.fb.group({
      date_since: [this.daterange.start, Validators.required],
      date_until: [this.daterange.end, Validators.required],
      filter: [this.filter, Validators.required]
    });
    this.filterStats();
  }

  setHeight(){
    var height = document.getElementById('cardHappyChart');
    return ((height.offsetHeight / 2)- 15);
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
        this.answerPercentage['happy'] = res['happiness_meter'].slice(-1)[0]['percentage'];

        if(this.filter != 'custom'){
          this.generateHappyMeter(res['happiness_meter']);
         }

        let idx = 1;
        for(let question of res['stats_per_questions']){
          let currentData;
          if(question['data'].length > 0){
            for(let questionStats of question['data']) {
              if(questionStats['date'] == 'current') {
                currentData = questionStats['percentage'];
              }
            }
            if(this.filter != 'custom'){
              this.generateQuestionChart(question, idx);
            }
          }
          this.questionsData.push({id: question['id'], question: question['question'], answers: currentData});
          idx++;
        }
    });
  }

  chooseDateRange(option) {
    this.selectedDateFilter = option;
    switch(option){
      case 1: {
        this.filter = 'week'
        this.form.get('filter').setValue(this.filter);
        this.daterange = {
          start: moment().startOf('isoWeek').format('YYYY/MM/DD 00:00:00'),
          end: moment().endOf('isoWeek').format('YYYY/MM/DD 23:59:59')
        };

        this.selectedDate(this.daterange);
        break;
      }
      case 2: {
        this.filter = 'month'
        this.form.get('filter').setValue(this.filter);
        this.daterange = {
          start: moment().startOf('month').format('YYYY/MM/DD 00:00:00'),
          end: moment().endOf('month').format('YYYY/MM/DD 23:59:59')
        };

        this.selectedDate(this.daterange);
        break;
      }
      case 3: {
        this.filter = 'year'
        this.form.get('filter').setValue(this.filter);
        this.daterange = {
          start: moment().startOf('year').format('YYYY/MM/DD 00:00:00'),
          end: moment().endOf('year').format('YYYY/MM/DD 23:59:59')
        };

        this.selectedDate(this.daterange);
        break;
      }
      default: {
        break;
      }
    }
  }

  selectedDate(value: any, datepicker?: any) {
    if(datepicker){
      datepicker.start = value.start;
      datepicker.end = value.end;
      this.filter = 'custom'
      this.form.get('filter').setValue(this.filter);
    }

    this.daterange.start = value.start;
    this.daterange.end = value.end;
    this.form.get('date_since').setValue(moment(value.start).format('YYYY/MM/DD 00:00:00'));
    this.form.get('date_until').setValue(moment(value.end).format('YYYY/MM/DD 23:59:59'));
  
    this.filterStats();
  }

  generateQuestionChart(question, idx) {
    if (!!this.questionsChart[idx]) {
      this.questionsChart[idx].destroy()
    }

    let canvas_name = `canvas${idx}`;
    let canvas : any = document.getElementById(canvas_name);
    let chart = canvas.getContext("2d");
    let gradientFill = chart.createLinearGradient(0, 0, 0, 150);
    gradientFill.addColorStop(0, "rgba(0,172,255,1)");
    gradientFill.addColorStop(1, "rgba(0,172,255,0)");

    let data  = {
        labels: question["data"].map(data => data['date']),
        datasets: [{
          backgroundColor: gradientFill,
          pointBackgroundColor: 'rgba(162,185,253,1)',
          pointHoverBorderWidth: 3,
          pointRadius: 0.5,
          pointHoverRadius: 7,
          pointHoverBorderColor: '#fff',
          borderWidth: 3,
          borderColor: "rgba(0,170,255,0.8)",
          data: question["data"].map(data => data['percentage']['happy'])
        }]
    };

    this.questionsChart[question['id']] = new Chart(chart, {
        type: 'line',
        data: data,
        options: {
          labels: {
            display: false
          },
          legend: {
            display: false
          },
          title: {
            display: true,
            text: 'Overall Activity',
            fontColor: '#323C47',
            fontStyle: 'light',
            fontSize: 11,
            padding: 15
          },
          tooltips: {
            backgroundColor: 'transparent',
            bodyFontFamily: 'Avenir',
            bodyFontColor: '#4A4A4A',
            bodyFontStyle: 'light',
            bodySpacing: 5,
            custom: function(tooltip) {
              if (!tooltip) return;
              tooltip.displayColors = false;
            },
            callbacks: {
              label: function(tooltipItem, data) {
                return tooltipItem.yLabel + "%";
              },
              title: function(tooltipItem, data) {
                return;
              }
            }
          },
          scales: {
            xAxes: [{
              display: false,
              gridLines: {
                display:false
              }
            }],
            yAxes: [{
              display: false,
              gridLines: {
                display: false
              },
              ticks: {
                beginAtZero: true,
                max: 105
              }
            }]
          },
          layout: {
            padding: {
                left: 8,
                right: 8,
                top: 1.5,
                bottom: 15
            }
          }
        }
    });
  }

  generateHappyMeter(stats) {
    if (!!this.happyChart) {
      this.happyChart.destroy();
    }

    let canvas : any = document.getElementById('happyMeterChart');
    let chart = canvas.getContext("2d");

    let gradientStroke = chart.createLinearGradient(0, 0, 350, 0);
    gradientStroke.addColorStop(0, '#FFC875');
    gradientStroke.addColorStop(0.4, '#F3595B');
    gradientStroke.addColorStop(0.8, '#D9A783');
    gradientStroke.addColorStop(1, '#83D7C0');

    let gradientFill = chart.createLinearGradient(0, 50, 0, 100);
    gradientFill.addColorStop(0, "#293B52");
    gradientFill.addColorStop(1, "#4E617A");

    let data = {
        labels: stats.map(data => {
          if(data['date'] == 'current'){
           return `This ${this.filter.charAt(0).toUpperCase()}${this.filter.slice(1)}`;
          }else{
            return data['date'];
          }
        }),
        datasets: [{
          backgroundColor: gradientFill,
          pointBackgroundColor: 'rgba(162,185,253,1)',
          pointHoverBorderWidth: 3,
          pointRadius: 0,
          pointHoverRadius: 7,
          pointHoverBorderColor: '#fff',
          borderWidth: 5,
          borderColor: gradientStroke,
          data: stats.map(data => data['percentage'])
        }]
    };

    let options = {
        responsive: true,
        spanGaps: true,
        labels: {
          display: false
        },
        legend: {
          display: false
        },
        title: {
          display: false
        },
        tooltips: {
          backgroundColor: '#fff',
          bodyFontFamily: 'Avenir',
          bodyFontColor: '#4A4A4A',
          bodyFontStyle: 'light',
          custom: function(tooltip) {
            if (!tooltip) return;
            tooltip.displayColors = false;
          },
          callbacks: {
            label: function(tooltipItem, data) {
              return tooltipItem.yLabel + "%";
            },
            title: function(tooltipItem, data) {
              return;
            }
          }
        },
        scales: {
          xAxes: [{
            gridLines: {
              display: false,
              tickMarkLength: 5
            },
            fontColor: '#4A4A4A',
            ticks: {
              autoSkip: false,
              zeroLineColor: "transparent",
              unitStepSize: 5,
              tickMarkLength: 20
            }
          }],
          yAxes: [{
            display: false,
            gridLines: {
              drawTicks: false,
              display: false
            },
            ticks: {
              beginAtZero: 0,
              max: 105
            }
          }]
        },
        layout: {
          padding: {
              left: 0,
              right: 0,
              top: 0,
              bottom: 15
          }
        }
    };

    this.happyChart = new Chart(chart, {
        type: 'line',
        data: data,
        options: options
    });
  }
}
