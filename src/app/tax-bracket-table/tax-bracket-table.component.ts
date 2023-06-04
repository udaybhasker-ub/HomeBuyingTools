import { Component, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { TaxBracket } from '../interfaces/tax-bracket.type';
import { TaxOptions } from '../interfaces/tax-options.type';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-tax-bracket-table',
  templateUrl: './tax-bracket-table.component.html',
  styleUrls: ['./tax-bracket-table.component.less']
})
export class TaxBracketTableComponent {
  @Input() options: TaxOptions;
  @Output() onOptionsChanged = new Subject<TaxOptions>();

  readonly defaultBracket: TaxBracket = {
    min: 0,
    max: 0,
    rate: 0
  };

  @ViewChild('table') compactLineChart: HTMLTableElement;

  onRowChange(index: number) {
    if (index < this.options.taxBrackets.length - 1) {
      this.options.taxBrackets[index + 1].min = this.options.taxBrackets[index].max + 1;
    }
    this.onOptionsChanged.next(this.options);
  }

  addTaxBracketRow(event: Event) {
    this.options.taxBrackets.push({ ...this.defaultBracket });
  }

  removeTaxBracketRow(index: number) {
    this.options.taxBrackets.splice(index, 1);
  }
}
