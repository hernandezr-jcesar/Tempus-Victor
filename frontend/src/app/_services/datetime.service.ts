import { Injectable } from '@angular/core';
import { Observable, interval } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class DateTimeService {
  getCurrentDateTime(): Observable<Date> {
    return interval(1000).pipe(
      startWith(0),
      map(() => new Date())
    );
  }
}
