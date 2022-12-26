import { Component, Input, OnInit } from '@angular/core';
import { IAdditionalOptions } from '../interfaces/IAdditionalOptions';
import { ICalculatedMonthData, ICalculatedMonthParams } from '../interfaces/ICalculatedMonthData';
import { IOptions } from '../interfaces/IOptions';
import * as financial from 'financial';
import { SharedService } from '../services/shared/shared.service';
import { CalculationUtils } from '../utils/CalculationUtils';


@Component({
  selector: 'app-additional-summary',
  templateUrl: './additional-summary.component.html',
  styleUrls: ['./additional-summary.component.less']
})
export class AdditionalSummaryComponent implements OnInit {
  selectedOptions: IOptions;
  calcData: ICalculatedMonthData[];
  categories: ["principal",
    "interest",
    "emi",
    "loanBalance"];

  constructor(private sharedService: SharedService) { }

  ngOnInit(): void {
    this.sharedService.optionsUpdated.subscribe((options: IOptions) => {
      if (!Object.keys(options).length) return;

      this.selectedOptions = options;
      this.calcData = CalculationUtils.calculateDataMatrix(this.selectedOptions, this.selectedOptions.loanLength * 12);
    });
  }
}
