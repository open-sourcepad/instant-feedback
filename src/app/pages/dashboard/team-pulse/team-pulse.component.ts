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
  chart = [];
  filter: string;
  happyCount: number;
  totalQuestion: number;
  constructor(
    private pulseService: PulseService
  ) {
      this.happyCount = 0;
      this.totalQuestion = 0;
    }

  ngOnInit() {

    // this.lineChart();
    this.setFilter('today');
  }

  setFilter(filter){
    this.filter = filter;
    this.pulseService.query({filter: filter}).subscribe(
      resp => {
        this.doughnutChart(resp['meta']['happy_percent'], resp['meta']['total_remaining_percent']);
        this.happyCount = resp['meta']['happy_count'];
        this.totalQuestion = resp['meta']['total_questions'];
      },
      error => {
        console.log(error);
      }
    );
  }

  doughnutChart(happyPercent, sadPercent) {
    var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

    var red_min_hex = '45';
    var red_min_dec = parseInt(red_min_hex, 16);
    var red_max_hex = 'cc';
    var red_max_dec = parseInt(red_max_hex, 16);
    var green_min_hex = '35';
    var green_min_dec = parseInt(green_min_hex, 16);
    var green_max_hex = 'ac';
    var green_max_dec = parseInt(green_max_hex, 16);
    var blue_min_hex = '20';
    var blue_min_dec = parseInt(blue_min_hex, 16);
    var blue_max_hex = '78';
    var blue_max_dec = parseInt(blue_max_hex, 16);

    var pi = Math.PI;

    var animateArc = function animateArc(chart) {
        var arc = chart.getDatasetMeta(0).data[0];
        var angle = arc._view.endAngle + pi / 2;
        var angle_inverse = 2 * pi - angle;
        var blue = Math.round(angle / (2 * pi) * blue_max_dec + angle_inverse / (2 * pi) * blue_min_dec).toString(16);
        if (arc._view.endAngle < pi / 2) {
            var green = Math.round(angle / pi * green_max_dec + (pi - angle) / pi * green_min_dec).toString(16);
            if (green.length < 2) green = '0' + green;
            var color = '#' + red_max_hex + green + blue;
            arc.round.backgroundColor = color;
            drawArc(chart, arc, color);
        } else {
            var red = Math.round((2 * pi - angle) / pi * red_max_dec + (angle - pi) / pi * red_min_dec).toString(16);
            if (red.length < 2) red = '0' + red;
            if (red === '45') red = '50';
            if (blue === '78') blue = '74';
            var _color = '#83d6c0';
            arc.round.backgroundColor = _color;
            drawArc(chart, arc, _color);
        }
    };

    var drawArc = function drawArc(chartm, arc, color) {
        var x = (chart.chartArea.left + chart.chartArea.right) / 2;
        var y = (chart.chartArea.top + chart.chartArea.bottom) / 2;
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

    var addCenterTextAfterUpdate = function addCenterTextAfterUpdate(chart) {
        if (chart.config.options.elements.center && chart.config.options.elements.centerSub && chart.ctx) {
            var centerConfig = chart.config.options.elements.center;
            var centerConfigSub = chart.config.options.elements.centerSub;
            var globalConfig = Chart.defaults.global;
            var fontStyle = centerConfig.fontStyle;
            var fontFamily = Chart.helpers.getValueOrDefault(centerConfig.fontFamily, 'Avenir');
            var fontSize = Chart.helpers.getValueOrDefault(centerConfig.minFontSize, 20);
            var maxFontSize = Chart.helpers.getValueOrDefault(centerConfig.maxFontSize, 60);
            var maxText = Chart.helpers.getValueOrDefault(centerConfig.maxText, centerConfig.text);
            do {
                chart.ctx.font = Chart.helpers.fontString(fontSize, fontStyle, fontFamily);
                var textWidth = chart.ctx.measureText(maxText).width;
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
                var _textWidth = chart.ctx.measureText(maxText).width;
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

    var roundCornersAfterUpdate = function roundCornersAfterUpdate(chart) {
        if (chart.config.options.elements.arc.roundCorners !== undefined) {
            var arc = chart.getDatasetMeta(0).data[chart.config.options.elements.arc.roundCorners];
            arc.round = {
                x: (chart.chartArea.left + chart.chartArea.right) / 2,
                y: (chart.chartArea.top + chart.chartArea.bottom) / 2,
                radius: (chart.outerRadius + chart.innerRadius) / 2,
                thickness: (chart.outerRadius - chart.innerRadius) / 2,
                backgroundColor: arc._model.backgroundColor
            };
        }
    };

    var addCenterTextAfterDraw = function addCenterTextAfterDraw(chart) {
        if (chart.center && chart.centerSub) {
            chart.ctx.textAlign = 'center';
            chart.ctx.textBaseline = 'middle';
            var centerX = (chart.chartArea.left + chart.chartArea.right) / 2;
            var centerY = (chart.chartArea.top + chart.chartArea.bottom) / 2;
            var lowerY = (chart.chartArea.top + chart.chartArea.bottom) / 2 + 65;
            var centerConfig = chart.config.options.elements.center;
            chart.ctx.font = chart.center.font;
            chart.ctx.fillStyle = chart.center.fillStyle;
            chart.ctx.fillText(centerConfig.text, centerX, centerY);
            var centerSubConfig = chart.config.options.elements.centerSub;
            chart.ctx.font = chart.centerSub.font;
            chart.ctx.fillStyle = chart.centerSub.fillStyle;
            chart.ctx.fillText(centerSubConfig.text, centerX, lowerY);
        }
    };

    var roundCornersAfterDraw = function roundCornersAfterDraw(chart) {
        if (chart.config.options.elements.arc.roundCorners !== undefined) {
            var arc = chart.getDatasetMeta(0).data[chart.config.options.elements.arc.roundCorners];
            var startAngle = pi / 2 - arc._view.startAngle;
            var endAngle = pi / 2 - arc._view.endAngle;
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
    var datasets = [{
        "data": [happyPercent, sadPercent],
        "backgroundColor": ["#36455a", "#36455a"]
    }];
    var chartData = {
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

    var canvas : any = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");
    var chart = new Chart(ctx, _extends({}, chartData, {
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

  lineChart(){

    var canvas : any = document.getElementById('canvas2');
    var chart = canvas.getContext("2d");

    var data  = {
        labels: [ 'Aug 7', 'Aug 8', 'Aug 9', 'Aug 10', 'Aug 13', 'Aug 14', 'Aug 15', 'Today' ],
        datasets: [{
          backgroundColor: 'rgb(65, 82, 104)',
          pointBackgroundColor: 'white',
          borderWidth: 4,
          borderColor: '#83d6c0',
          data: [60, 50, 55, 80, 81, 54, 50, 72]
        }]
    };


    var options = {
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
            suggestedMin: 60,
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
            var dataset = data.datasets[tooltipItem.datasetIndex];
            var label = data.labels[tooltipItem.datasetIndex];
            return  'Happy for ' + label + ' is ' + dataset.data[tooltipItem.index] + "%";
          }
        }
      }
    };


    var chartInstance = new Chart(chart, {
        type: 'line',
        data: data,
        options: options
    });
  }



}
