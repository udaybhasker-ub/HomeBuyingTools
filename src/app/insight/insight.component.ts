import { IOptions } from './../interfaces/IOptions';
import { Component, Input, OnInit } from '@angular/core';
import { Iinsights } from '../interfaces/Iinsights';
import { SharedService } from '../services/shared/shared.service';
import { IInsightChartData } from '../interfaces/ILineChartData';

@Component({
  selector: 'app-insight',
  templateUrl: './insight.component.html',
  styleUrls: ['./insight.component.less']
})
export class InsightComponent implements OnInit {

  @Input() insights: Iinsights;
  @Input() selectedOptions: IOptions;
  @Input() insightType: string;
  @Input() cumulative: boolean;
  @Input() data: any;

  constructor(private sharedService: SharedService) { }

  ngOnInit(): void {
  }

  onMonthClick(atMonth: number, cumulative: boolean = false) {
    this.sharedService.changeNavOptions.next({
      cumulative: cumulative,
      atMonth: atMonth
    });
  }
}
