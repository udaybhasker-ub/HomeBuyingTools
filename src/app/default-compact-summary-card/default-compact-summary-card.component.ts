import { Component, Input, OnInit } from '@angular/core';
import { ICalculatedMonthParams } from '../interfaces/ICalculatedMonthData';
import { IOptions } from '../interfaces/IOptions';

@Component({
  selector: 'app-default-compact-summary-card',
  templateUrl: './default-compact-summary-card.component.html',
  styleUrls: ['./default-compact-summary-card.component.less']
})
export class DefaultCompactSummaryCardComponent implements OnInit {
  @Input() selectedOptions: IOptions;
  @Input() data: ICalculatedMonthParams;
  @Input() cumulative: boolean = false;
  @Input() atMonth: number = 1;

  constructor() { }

  ngOnInit(): void {
  }

}
