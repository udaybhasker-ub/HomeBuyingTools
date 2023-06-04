import { Component, Input } from '@angular/core';
import { TaxCalculated } from '../interfaces/tax-options.type';

@Component({
  selector: 'app-tax-info',
  templateUrl: './tax-info.component.html',
  styleUrls: ['./tax-info.component.less']
})
export class TaxInfoComponent {
  @Input() data: TaxCalculated;

}
