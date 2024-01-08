import { Component, Input } from '@angular/core';
import { ICalculatedMonthParams } from 'src/app/interfaces/ICalculatedMonthData';
import { IOptions } from 'src/app/interfaces/IOptions';

@Component({
  selector: 'app-math-snippet',
  templateUrl: './math-snippet.component.html',
  styleUrls: ['./math-snippet.component.less']
})
export class MathSnippetComponent {
  @Input() property: keyof ICalculatedMonthParams;
  @Input() monthData: ICalculatedMonthParams;
  @Input() selectedOptions: IOptions;
  @Input() cumulative: boolean = false;
  @Input() partial: boolean = false;
}
