import { Component, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { Color, LegendPosition, LineChartComponent, ScaleType } from '@swimlane/ngx-charts';
import { ILineChartEntry, ILineChartData } from '../interfaces/ILineChartData';

@Component({
  selector: 'app-compact-line-chart',
  templateUrl: './compact-line-chart.component.html',
  styleUrls: ['./compact-line-chart.component.less']
})
export class CompactLineChartComponent implements OnInit {
  @Input() data: ILineChartData;
  @Input() activeEntries: string[];
  @Input() view: [number, number] = [400, 275];
  @Input() xAxisLabel: string;
  @Input() yAxisLabel: string;

  legend: boolean = true;
  legendPosition: LegendPosition = LegendPosition.Below;
  showLabels: boolean = true;
  animations: boolean = false;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = true;
  showXAxisLabel: boolean = true;
  timeline: boolean = true;
  autoScale: boolean = true;


  colorScheme: Color = {
    name: "cool",
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5'],
  };

  @ViewChild(LineChartComponent) compactLineChart: LineChartComponent;

  constructor() {
    Object.assign(this, { data: this.data });
  }

  ngOnInit(): void {
    this.updateData();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.updateData();
  }

  ngAfterViewInit(): void {
    this.updateData();
  }

  updateData() {
    if (this.compactLineChart)
      this.compactLineChart.hoveredVertical = this.data.selectedValue;
  }

  onLineChartUnHover() {
    this.compactLineChart.hoveredVertical = this.data.selectedValue;
  }

}
