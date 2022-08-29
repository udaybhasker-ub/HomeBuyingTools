import { Component, Input, OnInit } from '@angular/core';
import { ICalculatedMonthData, ICalculatedMonthParams } from '../interfaces/ICalculatedMonthData';

@Component({
  selector: 'app-diff-table',
  templateUrl: './diff-table.component.html',
  styleUrls: ['./diff-table.component.less']
})
export class DiffTableComponent implements OnInit {
  @Input() diffData: ICalculatedMonthParams;

  constructor() { }

  ngOnInit(): void {
  }

}
