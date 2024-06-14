import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'padTo2Digits',
})
export class PadTo2DigitsPipe implements PipeTransform {
  transform(value: number): string {
    if (value < 10) {
      return `0${value}`;
    } else {
      return `${value}`;
    }
  }
}
