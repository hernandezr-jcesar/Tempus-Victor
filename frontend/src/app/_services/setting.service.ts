import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import { Setting } from '../models/setting.model';
import { Observable } from 'rxjs';

const SETTINGS_API = 'http://localhost:8080/api/settings/';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class SettingService {
  constructor(private http: HttpClient) {}

  getSetting(idUser: number): Observable<Setting> {
    const params = new HttpParams().set('idUser', idUser.toString()); // Send userId as query parameter

    return this.http.get<Setting>(SETTINGS_API + 'setting/', { params });
  }

  postSetting(
    userId: number,
    pomodoroWorkDuration: number,
    shortBreakDuration: number,
    longBreakDuration: number,
    workImg: number,
    breakImg: number,
    neglectedImg: number,
    alarmSound: number,
    tictacSound: number
  ): Observable<Setting> {
    return this.http.post<Setting>(
      SETTINGS_API,
      {
        userId,
        pomodoroWorkDuration,
        shortBreakDuration,
        longBreakDuration,
        workImg,
        breakImg,
        neglectedImg,
        alarmSound,
        tictacSound,
      },
      httpOptions
    );
  }

  putSetting(setting: Setting): Observable<Setting> {
    const url = `${SETTINGS_API}${setting.idSetting}`;

    return this.http.put<Setting>(url, setting, httpOptions);
  }

  deleteSetting(idSetting: number): Observable<Setting> {
    const url = `${SETTINGS_API}${idSetting}`;
    // console.log('DELETE URL:', url);
    return this.http.delete<Setting>(url, httpOptions);
  }
}
