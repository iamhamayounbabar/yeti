import { style } from '@angular/animations';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexYAxis,
  ApexDataLabels,
  ApexTooltip,
  ApexStroke,
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  stroke: ApexStroke;
  tooltip: ApexTooltip;
  dataLabels: ApexDataLabels;

};

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnChanges {
  chartOptions: Partial<ChartOptions> | any;

  @Input() chartData: {x: string, y: number}[] = [];

  constructor() {
    this.chartOptions = {
      series: [
        {
          name: "Price",
          data: this.chartData
        }
      ],
      chart: {
        height: 330,
        type: "area"
      },
      colors: ['#FF54C7'],
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: "smooth"
      },
      xaxis: {
        type: "datetime",
        labels: {
          datetimeFormatter: {
            year: 'yyyy',
            month: 'MMM yy',
            day: 'dd MMM',
            hour: 'HH:mm'
          }
        },
      },
      yaxis:{
        labels: {
          formatter: (value: number) => {
            return "$" + value.toFixed(4);
          }
        }
      },
      tooltip: {
        custom: ({series, seriesIndex, dataPointIndex, w}: any) => {
          var date = new Date(w.globals.seriesX[seriesIndex][dataPointIndex]);
          var formattedDate = this.formatDate(date);
          return ('<div class="p-2 rounded-3 arrow_box">' +
                    '<div class="d-flex mb-3 gap-3">' +
                        '<span style="font-size: 1vw !important">When</span>' +
                        '<span class="ms-auto" style="font-size: 1vw !important">' + formattedDate + '</span>' +
                    '</div>' +
                    '<div class="d-flex gap-2">' +
                        '<span style="font-size: 1vw !important">Price</span>' +
                        '<span class="ms-auto" style="font-size: 1vw !important">$' + series[seriesIndex][dataPointIndex] + '</span>' +
                    '</div>' +
                  '</div>')
        }
      }
    };
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.chartOptions.series = [
      {
        name: "Price",
        data: this.chartData
      }
    ]
  }

  formatDate(date: any) {
    const day = date.getDate().toString().padStart(2, '0');
    const month = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(date);
    return `${day} ${month}`;
  }
}
