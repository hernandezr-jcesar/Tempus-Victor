import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';

import { PomodoroSession } from '../models/pomodoroSession.model';
import { Observable, Timestamp } from 'rxjs';

const POMODORO_API = 'http://localhost:8080/api/pomodoroSessions/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class PomodoroSessionService {
  constructor(private http: HttpClient) {}

  getAllSessions(idUser: number): Observable<PomodoroSession> {
    const params = new HttpParams().set('idUser', idUser.toString());
    return this.http.get<PomodoroSession>(POMODORO_API, {
      params,
    });
  }

  getOneSession(idTask: number): Observable<PomodoroSession> {
    const params = new HttpParams().set('idTask', idTask.toString());
    return this.http.get<PomodoroSession>(POMODORO_API + 'session', {
      params,
    });
  }
  createSession(
    taskId: number,
    status: string,
    completedPomodoros: number,
    startTime: Date | null,
    endTime: Date | null,
    estimate: number,
    totalTimeElapsed: number,
    workTimeElapsed: number,
    breakTimeElapsed: number,
    remainingWorkTime: number,
    remainingBreakTime: number,
    currentWorkTime: number,
    currentBreakTime: number,
    working: boolean,
    resting: boolean
  ): Observable<PomodoroSession> {
    return this.http.post<PomodoroSession>(
      POMODORO_API,
      {
        taskId,
        status,
        completedPomodoros,
        startTime,
        endTime,
        estimate,
        totalTimeElapsed,
        workTimeElapsed,
        breakTimeElapsed,
        remainingWorkTime,
        remainingBreakTime,
        currentWorkTime,
        currentBreakTime,
        working,
        resting,
      },
      httpOptions
    );
  }
  updateSession(PomodoroSession: PomodoroSession): Observable<PomodoroSession> {
    const url = `${POMODORO_API}${PomodoroSession.idPomodoro}`;

    // console.log('UPDATE URL:', url);

    return this.http.put<PomodoroSession>(url, PomodoroSession, httpOptions);
  }
}
