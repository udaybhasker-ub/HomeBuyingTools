import { ChangeDetectorRef, Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { ICalculatedMonthParams } from '../interfaces/ICalculatedMonthData';

@Component({
  selector: 'app-diff-param',
  templateUrl: './diff-param.component.html',
  styleUrls: ['./diff-param.component.less']
})
export class DiffParamComponent implements OnInit {
  @Input() data: ICalculatedMonthParams;
  @Input() prevData: ICalculatedMonthParams;
  @Input() param: string;
  @Input() showIndicator: boolean;
  @Input() reverseColors: boolean = false;
  value: number;

  constructor(private cd: ChangeDetectorRef) { }

  ngOnChanges(changes: SimpleChanges): void {
    this.calculateVal();
  }

  ngOnInit(): void {
    this.calculateVal();
  }

  calculateVal() {
    if (!(this.param && this.prevData && this.data[this.param] && this.prevData[this.param]))
      return;

    let val = this.data[this.param] - this.prevData[this.param];
    this.value = val;
  }

}
