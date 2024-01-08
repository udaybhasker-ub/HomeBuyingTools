import { Component, Input } from '@angular/core';
import { ICalculatedMonthData, ICalculatedMonthParams } from 'src/app/interfaces/ICalculatedMonthData';

@Component({
  selector: 'app-summary-toggle-header',
  templateUrl: './summary-toggle-header.component.html',
  styleUrls: ['./summary-toggle-header.component.less']
})
export class SummaryToggleHeaderComponent {
  @Input() allResults: ICalculatedMonthData[];
  @Input() categories: string[] = [];
  @Input() cumulative: boolean = false;
  @Input() atMonth: number = 1;
  @Input() labelText: string = '';
  @Input() topLabel: boolean = false;
  panelOpenState: boolean = false;
}
