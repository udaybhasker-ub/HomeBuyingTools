import { SeriesLabels } from './../objects/SeriesLabels';
import { Component, Input, OnInit, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { Color, LegendPosition, ScaleType } from '@swimlane/ngx-charts';
import { IChartSeriesEntry, ILineChartEntry } from '../interfaces/ILineChartData';
import { ICalculatedMonthParams } from '../interfaces/ICalculatedMonthData';

@Component({
  selector: 'app-summary-pie-chart',
  templateUrl: './summary-pie-chart.component.html',
  styleUrls: ['./summary-pie-chart.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class SummaryPieChartComponent implements OnInit {
  @Input() data: ICalculatedMonthParams;
  @Input() categories?: string[];
  defaultCategories: string[] = [
    "principal",
    "interest",
    "pmi",
    "propertyTax",
    "homeInsuranceCost",
    "maintainanceCost",
    "hoaMonthly"
  ];

  single: IChartSeriesEntry[] = [];
  view: [number, number] = [600, 250];

  // options
  gradient: boolean = true;
  showLegend: boolean = true;
  showLabels: boolean = true;
  isDoughnut: boolean = false;
  trimLabels: boolean = true;
  maxLabelLength: number = 15;


  colorScheme: Color = {
    name: "cool",
    selectable: true,
    group: ScaleType.Ordinal,
    domain: [
      '#FF8A80',
      '#EA80FC',
      '#8C9EFF',
      '#80D8FF',
      '#A7FFEB',
      '#CCFF90',
      '#FFFF8D',
      '#FF9E80'
    ]
  };


  constructor() {
    Object.assign(this, { single: this.single });
  }

  ngOnInit(): void {
    this.prepareData();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.prepareData();
  }

  prepareData() {
    if (!this.data) return;

    this.single = [];

    (this.categories || this.defaultCategories).forEach((seriesName) => {
      const val = this.data[seriesName];
      const seriesEntry: IChartSeriesEntry = {
        name: this.trimLabel(SeriesLabels[seriesName] || seriesName),
        value: Math.round(val)
      };
      this.single.push(seriesEntry);
    });
  }

  onSelect(data): void {
  }

  onActivate(data): void {
  }

  onDeactivate(data): void {
  }

  trimLabel(label: string): string {
    if (this.trimLabels && label) {
      label = label.slice(0, this.maxLabelLength);
    }
    return label;
  }

}
