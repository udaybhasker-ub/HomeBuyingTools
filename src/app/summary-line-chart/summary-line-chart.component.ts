import { SeriesLabels } from './../objects/SeriesLabels';
import { Component, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Color, LegendPosition, LineChartComponent, ScaleType } from '@swimlane/ngx-charts';
import { ICalculatedMonthData } from '../interfaces/ICalculatedMonthData';
import { ILineChartEntry, IChartSeriesEntry } from '../interfaces/ILineChartData';

@Component({
  selector: 'app-summary-line-chart',
  templateUrl: './summary-line-chart.component.html',
  styleUrls: ['./summary-line-chart.component.less']
})
export class SummaryLineChartComponent implements OnInit {
  @Input() data: ICalculatedMonthData[];
  @Input() categories: string[];
  @Input() cumulative: boolean = true;
  @Input() monthSelected: number = 1;

  defaultCategories: string[] = [
    "principal",
    "interest",
    "emi",
  ];

  multi: ILineChartEntry[] = [];
  activeEntries: ILineChartEntry[] = [];
  view: [number, number] = [650, 300];

  legend: boolean = true;
  legendPosition: LegendPosition = LegendPosition.Below;
  showLabels: boolean = true;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = 'Month';
  yAxisLabel: string = 'Amount';
  timeline: boolean = true;
  autoScale: boolean = false;


  colorScheme: Color = {
    name: "cool",
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5'],
  };

  @ViewChild("lineChart", { read: LineChartComponent }) lineChart: LineChartComponent;

  constructor() {
    Object.assign(this, { multi: this.multi });
  }

  ngOnInit(): void {
    this.prepareData();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.prepareData();
  }

  prepareData() {
    var multi: ILineChartEntry[] = [];
    var activeEntries: ILineChartEntry[] = [];

    (this.categories || this.defaultCategories).forEach((seriesName) => {
      const name = (SeriesLabels[seriesName] || seriesName) + (this.cumulative ? " (Total)" : ' (Per Month)');
      let series = [], activeSeries = [];

      this.data.forEach((monthData: ICalculatedMonthData) => {
        const val = this.cumulative ? monthData.cumulative[seriesName] : monthData.atMonth[seriesName];
        const monthNo = monthData.cumulative.month;
        const seriesEntry: IChartSeriesEntry = {
          name: monthNo + "",
          value: Math.round(val)
        };
        series.push(seriesEntry);

        if (monthNo === this.monthSelected)
          activeSeries.push(seriesEntry);
      });

      multi.push({ name, series });
      activeEntries.push({ name, series: activeSeries });
    });

    if (this.lineChart) this.lineChart.hoveredVertical = this.monthSelected

    this.multi = [...multi];
  }

  onLineChartUnHover() {
    this.lineChart.hoveredVertical = this.monthSelected;
  }


  onSelect(data): void {
  }

  onActivate(data): void {
  }

  onDeactivate(data): void {
  }

}
