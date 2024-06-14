import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import { Event } from '../models/event.model';
import { Observable } from 'rxjs';

const EVENTS_API = 'http://localhost:8080/api/events/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class EventService {
  constructor(private http: HttpClient) {}

  getEvents(idTask: number): Observable<Event[]> {
    if (idTask !== undefined && idTask !== null) {
      const params = new HttpParams().set('idTask', idTask.toString()); // Send userId as query parameter

      return this.http.get<Event[]>(EVENTS_API, { params });
    } else {
      // Handle the case when userId is undefined or null
      const idTask = '0'; // Or any other default value

      const params = new HttpParams().set('idTask', idTask.toString());
      return this.http.get<Event[]>(EVENTS_API, { params });
    }
  }
  createEvents(
    taskId: number,
    createdAt: string,
    description: string
  ): Observable<Event> {
    return this.http.post<Event>(
      EVENTS_API,
      {
        taskId,
        createdAt,
        description,
      },
      httpOptions
    );
  }
}
