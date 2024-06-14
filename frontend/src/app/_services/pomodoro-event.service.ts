import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import { PomodoroEvent } from '../models/pomodoroEvent.model';
import { Observable } from 'rxjs';

const POMODORO_EVENTS_API = 'http://localhost:8080/api/pomodoroEvents/';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class PomodoroEventService {
  constructor(private http: HttpClient) {}

  getPomodoroEvents(idPomodoro: number): Observable<PomodoroEvent[]> {
    const params = new HttpParams().set('idPomodoro', idPomodoro.toString()); // Send userId as query parameter

    return this.http.get<PomodoroEvent[]>(POMODORO_EVENTS_API, { params });
  }

  postPomodoroEvent(
    pomodoroSessionId: number,
    createdAt: String,
    description: String
  ): Observable<PomodoroEvent> {
    return this.http.post<PomodoroEvent>(
      POMODORO_EVENTS_API,
      {
        pomodoroSessionId,
        createdAt,
        description,
      },
      httpOptions
    );
  }
}
