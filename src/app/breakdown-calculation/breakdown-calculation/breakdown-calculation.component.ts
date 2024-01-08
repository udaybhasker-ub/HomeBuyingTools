import { Component, Input } from '@angular/core';
import { ICalculatedMonthData, ICalculatedMonthParams } from 'src/app/interfaces/ICalculatedMonthData';
import { IOptions } from 'src/app/interfaces/IOptions';

@Component({
  selector: 'app-breakdown-calculation',
  templateUrl: './breakdown-calculation.component.html',
  styleUrls: ['./breakdown-calculation.component.less']
})
export class BreakdownCalculationComponent {
  @Input() selectedOptions: IOptions;
  @Input() data: ICalculatedMonthParams;
}
