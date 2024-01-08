import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { ICalculatedMonthData, ICalculatedMonthParams } from '../interfaces/ICalculatedMonthData';
import { IOptions } from '../interfaces/IOptions';
import { SharedService } from '../services/shared/shared.service';
import { CalculationUtils } from '../utils/CalculationUtils';

@Component({
  selector: 'app-summary-card',
  templateUrl: './summary-card.component.html',
  styleUrls: ['./summary-card.component.less']
})
export class SummaryCardComponent implements OnInit {
  @Input() selectedOptions: IOptions;
  @Input() diffData: ICalculatedMonthParams;

  @Input() showSummaryDetails: boolean = false;
  @Input() detailsCard: boolean = false;
  @Input() lastItemUserSelected: boolean = false;
  @Input() cumulative: boolean = false;
  @Input() atMonth: number = 1;
  @Input() forComparision: boolean = false;
  @Output() onPinnedForComparision = new EventEmitter<IOptions>();

  allResults: ICalculatedMonthData[];
  result: ICalculatedMonthParams;
  pinned = false;

  constructor(private sharedService: SharedService) {

  }

  ngOnInit(): void {
    this.allResults = CalculationUtils.calculateDataMatrix(this.selectedOptions, this.selectedOptions.loanLength * 12);
    this.updateData();
    this.showSummaryDetails = this.detailsCard || this.showSummaryDetails;

    this.sharedService.updateNavOptions.subscribe(({ cumulative }) => {
      if (typeof cumulative !== "boolean")
        return;

      this.cumulative = cumulative;
      this.updateData();
    });

  }

  ngOnChanges(changes: SimpleChanges) {
  }

  updateData() {
    if (!(this.allResults && this.allResults.length))
      return;

    const result = this.allResults[this.atMonth - 1];
    this.result = this.cumulative ? result.cumulative : result.atMonth;
  }

  addToCompare() {
    this.sharedService.addToCompare.next(this.selectedOptions);
  }

  removeFromCompare() {
    this.sharedService.removeFromCompare.next(this.selectedOptions);
  }

  setDefault(itemOptions: IOptions) {
    this.sharedService.defaultOptionsUpdated.next(itemOptions);
  }

  togglePin(event: Event) {
    this.pinned = !this.pinned;
    if (this.pinned) {
      this.onPinnedForComparision.next(this.selectedOptions);
    }
  }
}
