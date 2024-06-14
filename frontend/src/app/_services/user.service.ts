import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

const USERS_API = 'http://localhost:8080/api/users/';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  getOneUser(idUser: number): Observable<User> {
    const params = new HttpParams().set('idUser', idUser.toString());
    return this.http.get<User>(USERS_API + 'user', { params });
  }

  updateUser(user: User): Observable<User> {
    const url = `${USERS_API}${user.idUser}`;

    return this.http.put<User>(url, user, httpOptions);
  }
  updatePassword(user: User): Observable<User> {
    const url = `${USERS_API}${'password/'}${user.idUser}`;
    return this.http.put<User>(url, user, httpOptions);
  }

  deleteUser(idUser: number): Observable<User> {
    const url = `${USERS_API}${idUser}`;
    // console.log('DELETE URL:', url);
    return this.http.delete<User>(url, httpOptions);
  }
}
