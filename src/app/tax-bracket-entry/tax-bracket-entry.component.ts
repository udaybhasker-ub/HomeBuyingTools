import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { TaxBracket } from '../interfaces/tax-bracket.type';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-tax-bracket-entry',
  templateUrl: './tax-bracket-entry.component.html',
  styleUrls: ['./tax-bracket-entry.component.less']
})
export class TaxBracketEntryComponent {
  @Input() data: TaxBracket;
  @Input() index: number;
  @Output() onChange = new EventEmitter<number>();
  @Output() onRemove = new EventEmitter<number>();

  onChanged(index: number): void {
    this.onChange.emit(this.index);
  }
}
