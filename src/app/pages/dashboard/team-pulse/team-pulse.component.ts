import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup,  FormBuilder,  Validators } from '@angular/forms';
import { Chart } from 'chart.js';
import { PulseService } from '../../../services/api/pulse.service';
import * as moment from 'moment';
import { QuestionService } from 'src/app/services/api';

@Component({
  selector: 'team-pulse',
  templateUrl: './team-pulse.pug',
  styleUrls: ['./team-pulse.scss']
})
export class TeamPulseComponent implements OnInit {
  
  @Input() filter: string;
  @Output() filterChange: EventEmitter<any> = new EventEmitter<any>();

  happyUsers: any;
  sadUsers: any;
  questionsData: any;
  questionsChart: any;
  closePercentage: number = 0;
  idlePercentage: number = 0;
  happyMeter: number = 0;
  happyChart: any;
  loading = false;
  questionStats: any = [];

  form: FormGroup;
  selectedDateFilter = 1;

  @Input() daterange: any;
  @Output() daterangeChange: EventEmitter<any> = new EventEmitter<any>();

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
  onHover = {happy: false, sad: false};

  constructor(
    private pulseService: PulseService,
    private fb: FormBuilder,
    private questionApi: QuestionService
  ) {
      this.filter = 'week';
      this.happyUsers = [];
      this.sadUsers = [];
      this.questionsData = [];
      this.questionsChart = {};
    }

  ngOnInit() {
    this.form = this.fb.group({
      date_since: [this.daterange.start, Validators.required],
      date_until: [this.daterange.end, Validators.required],
      filter: [this.filter, Validators.required]
    });
    this.questionApi.getMainQuestions().subscribe(res => {
      this.questionStats = res['collection']['data'].map( q => {
        return {id: q.id, question: q.message, data: []}
      });
      this.filterStats();
    });
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
        let keys = Object.keys(res);
        let i = 0;
        var happiness_meter = [];
        for(let obj of this.questionStats){
          obj['data'] = [];
        }
        for(let key of keys){
          if(i == (keys.length - 1) || key == 'current'){
            this.happyUsers = res[key]['happy_users'];
            this.sadUsers = res[key]['sad_users'];
            this.closePercentage = res[key]['close_percentage'];
            this.idlePercentage = res[key]['idle_percentage'];
            this.happyMeter = res[key]['happiness_meter'];
            happiness_meter.push({date: 'current', percentage: (res[key]['happiness_meter'] * 100)});
            for(let stats of res[key]['stats_per_question']){
              let qStatsIdx = this.questionStats.findIndex(x => x.id == stats.question.id);
              delete(stats['question']);
              this.questionStats[qStatsIdx]['data'].push({
                date: 'current', percentage: stats
              });
            }
          }else{
            happiness_meter.push({date: key, percentage: (res[key]['happiness_meter'] * 100)});
            for(let stats of res[key]['stats_per_question']){
              let qStatsIdx = this.questionStats.findIndex(x => x.id == stats.question.id);
              delete(stats['question']);
              this.questionStats[qStatsIdx]['data'].push({
                date: key, percentage: stats
              });
            }
          }
          i++;
        }

        if(this.filter != 'custom'){
          this.generateHappyMeter(happiness_meter);
         }

        let idx = 1;
        for(let question of this.questionStats){
          let currentData;
          if(question['data'].length > 0){
            for(let questionStats of question['data']) {
              if(questionStats['date'] == 'current') {
                let ansPct = {};
                for(let key of Object.keys(questionStats['percentage'])){
                  ansPct[key] = Math.trunc(questionStats['percentage'][key]);
                }

                currentData = ansPct;
              }
            }
          }
          let qIdx = this.questionsData.findIndex(el => el.id == question['id']);
          if(qIdx > -1){
            this.questionsData[qIdx]['answers'] = currentData;
          }else {
            this.questionsData.push({id: question['id'], question: question['question'], answers: currentData});
          }
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

    this.filterChange.emit(this.filter)
  }

  selectedDate(value: any, datepicker?: any) {
    if(datepicker){
      datepicker.start = value.start;
      datepicker.end = value.end;
      this.filter = 'custom'
      this.filterChange.emit(this.filter)
      this.form.get('filter').setValue(this.filter);
    }

    this.daterangeChange.emit(value);
    this.daterange.start = value.start;
    this.daterange.end = value.end;
    this.form.get('date_since').setValue(moment(value.start).format('YYYY/MM/DD 00:00:00'));
    this.form.get('date_until').setValue(moment(value.end).format('YYYY/MM/DD 23:59:59'));

    this.filterStats();
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
          bodyFontFamily: 'Barlow',
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

  generate_query_param(user) {
    return {
      dateFilter: 4,
      dateSince: this.daterange.start,
      dateUntil: this.daterange.end,
      userFilter: JSON.stringify({id: user.id, display_name: user.user})
    }
  }
}
