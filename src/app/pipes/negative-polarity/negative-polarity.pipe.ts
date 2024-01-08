import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'negativePolarity'
})
export class NegativePolarityPipe implements PipeTransform {
  transform(value: string | number): number {
    if (typeof value === 'string' || typeof value === 'number') {
      return -Number(value); // Negate the numeric value
    }
    return NaN; // Return NaN for other types
  }
}
