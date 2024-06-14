import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import { Task } from '../models/task.model';
import { Observable } from 'rxjs';

const TASKS_API = 'http://localhost:8080/api/tasks/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  constructor(private http: HttpClient) {}

  getTasks(idUser: number): Observable<Task[]> {
    if (idUser !== undefined && idUser !== null) {
      // Option 2: Update backend to accept userId as query parameter
      const params = new HttpParams().set('idUser', idUser.toString()); // Send userId as query parameter

      return this.http.get<Task[]>(TASKS_API, { params });
    } else {
      // Handle the case when userId is undefined or null
      const idUser = '0'; // Or any other default value

      const params = new HttpParams().set('idUser', idUser.toString());
      return this.http.get<Task[]>(TASKS_API, { params });
    }
  }
  getOneTask(idTask: number): Observable<Task> {
    const params = new HttpParams().set('idTask', idTask.toString());
    return this.http.get<Task>(TASKS_API + 'task', { params });
  }

  createTask(
    userId: number,
    categoryId: number,
    title: string,
    description: string,
    comments: string,
    deadline: Date | null,
    importance: boolean,
    urgency: boolean,
    status: boolean,
    pomodoroEstimacion: number
  ): Observable<Task> {
    return this.http.post<Task>(
      TASKS_API,
      {
        userId,
        categoryId,
        title,
        description,
        comments,
        deadline,
        importance,
        urgency,
        status,
        pomodoroEstimacion,
      },
      httpOptions
    );
  }

  updateTask(task: Task): Observable<Task> {
    const url = `${TASKS_API}${task.idTask}`;

    // console.log('UPDATE URL:', url);

    return this.http.put<Task>(url, task, httpOptions);
  }

  deleteTask(idTask: number): Observable<Task> {
    const url = `${TASKS_API}${idTask}`;
    // console.log('DELETE URL:', url);
    return this.http.delete<Task>(url, httpOptions);
  }
}
