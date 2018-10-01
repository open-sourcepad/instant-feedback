import { Component, Input, OnInit } from '@angular/core';
import { FormGroup,  FormBuilder,  Validators } from '@angular/forms';
import { Chart } from 'chart.js';
import { PulseService } from '../../../services/api/pulse.service';

@Component({
  selector: 'team-pulse',
  templateUrl: './team-pulse.pug',
  styleUrls: ['../dashboard.scss']
})
export class TeamPulseComponent implements OnInit {
  filter: string;
  happyCount: number;
  totalQuestion: number;
  questionsData: any;
  lineChartInstance: any;

  constructor(
    private pulseService: PulseService
  ) {
      this.happyCount = 0;
      this.totalQuestion = 0;
    }

  ngOnInit() {
    this.questionsData = []
    this.setFilter('today');
  }

  setFilter(filter){
    this.filter = filter;
    this.pulseService.query({filter: filter}).subscribe(
      resp => {
        this.doughnutChart(resp['meta']['happy_percent'], resp['meta']['total_remaining_percent']);
        this.lineChart(resp['meta']['team_pulse_data_history']);
        this.happyCount = resp['meta']['happy_count'];
        this.totalQuestion = resp['meta']['total_questions'];
        this.questionsData = resp['meta']['questions_data'];
      },
      error => {
        console.log(error);
      }
    );
  }

  doughnutChart(happyPercent, sadPercent) {
    let _extends = Object.assign || function (target) { for (let i = 1; i < arguments.length; i++) { let source = arguments[i]; for (let key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

    let red_min_hex = '45';
    let red_min_dec = parseInt(red_min_hex, 16);
    let red_max_hex = 'cc';
    let red_max_dec = parseInt(red_max_hex, 16);
    let green_min_hex = '35';
    let green_min_dec = parseInt(green_min_hex, 16);
    let green_max_hex = 'ac';
    let green_max_dec = parseInt(green_max_hex, 16);
    let blue_min_hex = '20';
    let blue_min_dec = parseInt(blue_min_hex, 16);
    let blue_max_hex = '78';
    let blue_max_dec = parseInt(blue_max_hex, 16);

    let pi = Math.PI;

    let animateArc = function animateArc(chart) {
        let arc = chart.getDatasetMeta(0).data[0];
        let angle = arc._view.endAngle + pi / 2;
        let angle_inverse = 2 * pi - angle;
        let blue = Math.round(angle / (2 * pi) * blue_max_dec + angle_inverse / (2 * pi) * blue_min_dec).toString(16);
        if (arc._view.endAngle < pi / 2) {
            let green = Math.round(angle / pi * green_max_dec + (pi - angle) / pi * green_min_dec).toString(16);
            if (green.length < 2) green = '0' + green;
            let color = '#' + red_max_hex + green + blue;
            arc.round.backgroundColor = color;
            drawArc(chart, arc, color);
        } else {
            let red = Math.round((2 * pi - angle) / pi * red_max_dec + (angle - pi) / pi * red_min_dec).toString(16);
            if (red.length < 2) red = '0' + red;
            if (red === '45') red = '50';
            if (blue === '78') blue = '74';
            let _color = '#83d6c0';
            arc.round.backgroundColor = _color;
            drawArc(chart, arc, _color);
        }
    };

    let drawArc = function drawArc(chartm, arc, color) {
        let x = (chart.chartArea.left + chart.chartArea.right) / 2;
        let y = (chart.chartArea.top + chart.chartArea.bottom) / 2;
        chart.ctx.fillStyle = color;
        chart.ctx.strokeStyle = color;
        chart.ctx.beginPath();
        if (arc != null) {
            chart.ctx.arc(x, y, chart.outerRadius, arc._view.startAngle, arc._view.endAngle);
            chart.ctx.arc(x, y, chart.innerRadius, arc._view.endAngle, arc._view.startAngle, true);
        } else {
            chart.ctx.arc(x, y, chart.outerRadius, 0, 2 * pi);
            chart.ctx.arc(x, y, chart.innerRadius, 0, 2 * pi, true);
        }
        chart.ctx.fill();
    };

    let addCenterTextAfterUpdate = function addCenterTextAfterUpdate(chart) {
        if (chart.config.options.elements.center && chart.config.options.elements.centerSub && chart.ctx) {
            let centerConfig = chart.config.options.elements.center;
            let centerConfigSub = chart.config.options.elements.centerSub;
            let globalConfig = Chart.defaults.global;
            let fontStyle = centerConfig.fontStyle;
            let fontFamily = Chart.helpers.getValueOrDefault(centerConfig.fontFamily, 'Avenir');
            let fontSize = Chart.helpers.getValueOrDefault(centerConfig.minFontSize, 20);
            let maxFontSize = Chart.helpers.getValueOrDefault(centerConfig.maxFontSize, 60);
            let maxText = Chart.helpers.getValueOrDefault(centerConfig.maxText, centerConfig.text);
            do {
                chart.ctx.font = Chart.helpers.fontString(fontSize, fontStyle, fontFamily);
                let textWidth = chart.ctx.measureText(maxText).width;
                if (textWidth < chart.innerRadius * 2 && fontSize < maxFontSize) fontSize += 1;else {
                    fontSize -= 1;
                    break;
                }
            } while (true);
            chart.center = {
                font: Chart.helpers.fontString(fontSize, fontStyle, fontFamily),
                fillStyle: Chart.helpers.getValueOrDefault(centerConfig.fontColor, globalConfig.defaultFontColor)
            };
            fontSize = Chart.helpers.getValueOrDefault(centerConfigSub.minFontSize, 10);
            maxFontSize = Chart.helpers.getValueOrDefault(centerConfigSub.maxFontSize, 15);
            maxText = centerConfigSub.text;
            do {
                chart.ctx.font = Chart.helpers.fontString(fontSize, fontStyle, fontFamily);
                let _textWidth = chart.ctx.measureText(maxText).width;
                if (_textWidth < chart.innerRadius * 2 && fontSize < maxFontSize) fontSize += 1;else {
                    fontSize -= 1;
                    break;
                }
            } while (true);
            chart.centerSub = {
                font: Chart.helpers.fontString(fontSize, fontStyle, fontFamily),
                fillStyle: Chart.helpers.getValueOrDefault(centerConfigSub.fontColor, globalConfig.defaultFontColor)
            };
        }
    };

    let roundCornersAfterUpdate = function roundCornersAfterUpdate(chart) {
        if (chart.config.options.elements.arc.roundCorners !== undefined) {
            let arc = chart.getDatasetMeta(0).data[chart.config.options.elements.arc.roundCorners];
            arc.round = {
                x: (chart.chartArea.left + chart.chartArea.right) / 2,
                y: (chart.chartArea.top + chart.chartArea.bottom) / 2,
                radius: (chart.outerRadius + chart.innerRadius) / 2,
                thickness: (chart.outerRadius - chart.innerRadius) / 2,
                backgroundColor: arc._model.backgroundColor
            };
        }
    };

    let addCenterTextAfterDraw = function addCenterTextAfterDraw(chart) {
        if (chart.center && chart.centerSub) {
            chart.ctx.textAlign = 'center';
            chart.ctx.textBaseline = 'middle';
            let centerX = (chart.chartArea.left + chart.chartArea.right) / 2;
            let centerY = (chart.chartArea.top + chart.chartArea.bottom) / 2;
            let lowerY = (chart.chartArea.top + chart.chartArea.bottom) / 2 + 65;
            let centerConfig = chart.config.options.elements.center;
            chart.ctx.font = chart.center.font;
            chart.ctx.fillStyle = chart.center.fillStyle;
            chart.ctx.fillText(centerConfig.text, centerX, centerY);
            let centerSubConfig = chart.config.options.elements.centerSub;
            chart.ctx.font = chart.centerSub.font;
            chart.ctx.fillStyle = chart.centerSub.fillStyle;
            chart.ctx.fillText(centerSubConfig.text, centerX, lowerY);
        }
    };

    let roundCornersAfterDraw = function roundCornersAfterDraw(chart) {
        if (chart.config.options.elements.arc.roundCorners !== undefined) {
            let arc = chart.getDatasetMeta(0).data[chart.config.options.elements.arc.roundCorners];
            let startAngle = pi / 2 - arc._view.startAngle;
            let endAngle = pi / 2 - arc._view.endAngle;
            chart.ctx.save();
            chart.ctx.translate(arc.round.x, arc.round.y);
            chart.ctx.fillStyle = arc.round.backgroundColor;
            chart.ctx.beginPath();
            chart.ctx.arc(arc.round.radius * Math.sin(startAngle), arc.round.radius * Math.cos(startAngle), arc.round.thickness, 0, 2 * pi);
            chart.ctx.arc(arc.round.radius * Math.sin(endAngle), arc.round.radius * Math.cos(endAngle), arc.round.thickness, 0, 2 * pi);
            chart.ctx.fill();
            chart.ctx.restore();
        }
    };
    let datasets = [{
        "data": [happyPercent, sadPercent],
        "backgroundColor": ["#36455a", "#36455a"]
    }];
    let chartData = {
        type: 'doughnut',
        data: { datasets: datasets },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutoutPercentage: 85,
            segmentShowStroke: false,
            events: [],
            elements: {
                arc: {
                    roundCorners: 0,
                    borderWidth: 0
                },
                center: {
                    text: '' + datasets[0].data[0] +'%',
                    fontColor: "#646464",
                    fontFamily: "Avenir",
                    fontStyle: "normal",
                    sidePadding: 10
                },
                centerSub: {
                    text: '',
                    fontColor: "#a6a6a6",
                    minFontSize: 10,
                    maxFontSize: 25
                }
            },
            animation: {
                onProgress: function onProgress(animation) {
                    animation.easing = 'linear';
                    animateArc(animation.chart);
                }
            }
        }
    };

    let canvas : any = document.getElementById("canvas");
    let ctx = canvas.getContext("2d");
    let chart = new Chart(ctx, _extends({}, chartData, {
        plugins: [{
            beforeDraw: function beforeDraw(chart) {
                drawArc(chart, null, '#36455a');
            },
            afterUpdate: function afterUpdate(chart) {
                addCenterTextAfterUpdate(chart);
                roundCornersAfterUpdate(chart);
            },
            afterDraw: function afterDraw(chart) {
                addCenterTextAfterDraw(chart);
                roundCornersAfterDraw(chart);
            },
            resize: function resize() {
                return new Chart(ctx, _extends({}, chartData, {
                    plugins: [{
                        beforeDraw: function beforeDraw(chart) {
                            drawArc(chart, null, '#36455a');
                        },
                        afterUpdate: function afterUpdate(chart) {
                            addCenterTextAfterUpdate(chart);
                            roundCornersAfterUpdate(chart);
                        },
                        afterDraw: function afterDraw(chart) {
                            addCenterTextAfterDraw(chart);
                            roundCornersAfterDraw(chart);
                        }
                    }]
                }));
            }
        }]
    }));
  }

  lineChart(teamPulseData){
    if (!!this.lineChartInstance) {
      this.lineChartInstance.destroy()
    }
    let canvas : any = document.getElementById('canvas2');
    let chart = canvas.getContext("2d");
    let data  = {
        labels: [ teamPulseData[0]["date"], teamPulseData[1]["date"], teamPulseData[2]["date"], teamPulseData[3]["date"], teamPulseData[4]["date"], teamPulseData[5]["date"], teamPulseData[6]["date"] ],
        datasets: [{
          backgroundColor: 'rgb(65, 82, 104)',
          pointBackgroundColor: 'white',
          borderWidth: 4,
          borderColor: '#83d6c0',
          data: [ teamPulseData[0]["happy_percent"], teamPulseData[1]["happy_percent"], teamPulseData[2]["happy_percent"], teamPulseData[3]["happy_percent"], teamPulseData[4]["happy_percent"], teamPulseData[5]["happy_percent"], teamPulseData[6]["happy_percent"]]
        }]
    };


    let options = {
      responsive: true,
      maintainAspectRatio: true,
      animation: {
        easing: 'easeInOutQuad',
        duration: 520
      },
      scales: {
        xAxes: [{
          gridLines: {
            color: 'rgba(200, 200, 200, 0.05)',
            lineWidth: 1
          }
        }],
        yAxes: [{
          gridLines: {
            color: 'rgba(200, 200, 200, 0.08)',
            lineWidth: 1
          },
          ticks: {
            beginAtZero: true,
            suggestedMin: 0,
            suggestedMax: 100,
            stepSize: 10,
            callback: function(tick) {
              return tick.toString() + '%';
            }
          }
        }]
      },
      elements: {
        line: {
          tension: 0.4
        }
      },
      legend: {
        display: false
      },
      point: {
        backgroundColor: 'white'
      },
      tooltips: {
        titleFontFamily: 'Open Sans',
        backgroundColor: 'rgba(0,0,0,0.3)',
        titleFontColor: 'red',
        caretSize: 5,
        cornerRadius: 2,
        xPadding: 10,
        yPadding: 10,
        callbacks: {
          label: function(tooltipItem, data) {
            let dataset = data.datasets[tooltipItem.datasetIndex];
            let label = data.labels[tooltipItem.index];
            return  'Happy for ' + label + ' is ' + dataset.data[tooltipItem.index] + "%";
          }
        }
      }
    };


    this.lineChartInstance = new Chart(chart, {
        type: 'line',
        data: data,
        options: options
    });
  }
}
