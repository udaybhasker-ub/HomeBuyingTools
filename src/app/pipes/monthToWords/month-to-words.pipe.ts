import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'monthToWords'
})
export class MonthToWordsPipe implements PipeTransform {

  transform(value: number, ...args: unknown[]): string {
    return this.getWords(value);
  }

  private getWords(monthCount): string {
    function getPlural(number, word) {
      return number === 1 && word.one || word.other;
    }

    var months = { one: 'month', other: 'months' },
      years = { one: 'year', other: 'years' },
      m = monthCount % 12,
      y = Math.floor(monthCount / 12),
      result = [];

    y && result.push(y + ' ' + getPlural(y, years));
    m && result.push(m + ' ' + getPlural(m, months));
    return result.join(', ');
  }
}
