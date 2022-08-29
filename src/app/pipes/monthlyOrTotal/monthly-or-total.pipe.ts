import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'monthlyOrTotalPipe'
})
export class MonthlyOrTotalPipe implements PipeTransform {

  transform(value: number, cumulative: boolean, average: boolean = false, underline: boolean = false): string {
    const currencyPipe = new CurrencyPipe("en-US");

    let underlineClass = "val-primary ";
    if (underline) {
      if (value > 0) {
        underlineClass += "val-primary-positive";
      } else {
        underlineClass += "val-primary-negative";
      }
    }
    return "<span class='" + underlineClass + "'>" + currencyPipe.transform(value, "USD", "symbol", "1.0-0") + "</span>" +
      "<span class='val-desc'>" + (cumulative ? " Total" : " Per Month") + (!cumulative && average ? " (average)" : "") + "</span>";
  }

}
