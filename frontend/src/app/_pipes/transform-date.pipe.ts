import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'transformDate',
})
export class TransformDatePipe implements PipeTransform {
  constructor(private datePipe: DatePipe) {}

  transform(date: string | Date, format?: string): string {
    if (!date) {
      return '';
    }

    const formattedDate = this.datePipe.transform(date as string, format); // Assert as string

    return formattedDate || ''; // Return empty string if formatting fails
  }
}
