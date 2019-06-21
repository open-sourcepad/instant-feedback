import { Component, Input, OnInit, AfterViewInit } from '@angular/core';
import { Chart } from 'chart.js';

@Component({
  selector: 'question-chart',
  templateUrl: './question-chart.component.pug',
  styleUrls: ['./question-chart.component.scss']
})
export class QuestionChartComponent implements AfterViewInit {
  
  @Input() filter: string;
  @Input() questionData: any;
  @Input() index: any;
  @Input() loading: any;

  questionChart: any;
  constructor() {}

  ngAfterViewInit() {
    this.generateQuestionChart()
  }

  ngOnInit() {

  }

  generateQuestionChart() {
    if (!!this.questionChart) {
      this.questionChart.destroy()
    }

    let canvas : any = document.getElementById('canvas' + this.index);
    let chart = canvas.getContext("2d");
    let gradientFill = chart.createLinearGradient(0, 0, 0, 150);
    gradientFill.addColorStop(0, "rgba(0,172,255,1)");
    gradientFill.addColorStop(1, "rgba(0,172,255,0)");

    let data  = {
        labels: this.questionData["data"].map(data => data['date']),
        datasets: [{
          backgroundColor: gradientFill,
          pointBackgroundColor: 'rgba(162,185,253,1)',
          pointHoverBorderWidth: 3,
          pointRadius: 0.5,
          pointHoverRadius: 7,
          pointHoverBorderColor: '#fff',
          borderWidth: 3,
          borderColor: "rgba(0,170,255,0.8)",
          data: this.questionData["data"].map(data => data['percentage']['happy'])
        }]
    };

    this.questionChart = new Chart(chart, {
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
}
