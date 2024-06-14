import { Injectable } from '@angular/core';

import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import { Observable } from 'rxjs';

import { Note } from '../models/note.model';

const NOTES_API = 'http://localhost:8080/api/notes/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class NoteService {
  constructor(private http: HttpClient) {}

  getNotes(idUser: number): Observable<Note[]> {
    if (idUser !== undefined && idUser !== null) {
      // Option 2: Update backend to accept userId as query parameter
      const params = new HttpParams().set('idUser', idUser.toString()); // Send userId as query parameter

      return this.http.get<Note[]>(NOTES_API, { params });
    } else {
      // Handle the case when userId is undefined or null
      const idUser = '0'; // Or any other default value

      const params = new HttpParams().set('idUser', idUser.toString());
      return this.http.get<Note[]>(NOTES_API, { params });
    }
  }
  getArchivedNotes(idUser: number): Observable<Note[]> {
    if (idUser !== undefined && idUser !== null) {
      // Option 2: Update backend to accept userId as query parameter
      const params = new HttpParams().set('idUser', idUser.toString()); // Send userId as query parameter

      return this.http.get<Note[]>(NOTES_API + 'archived/', { params });
    } else {
      // Handle the case when userId is undefined or null
      const idUser = '0'; // Or any other default value

      const params = new HttpParams().set('idUser', idUser.toString());
      return this.http.get<Note[]>(NOTES_API, { params });
    }
  }
  getOneNote(idNote: number): Observable<Note> {
    const params = new HttpParams().set('idNote', idNote.toString());
    return this.http.get<Note>(NOTES_API + 'note', { params });
  }

  createNote(
    createdAt: string,
    title: string,
    description: string,
    archived: boolean,
    userId: number
  ): Observable<Note> {
    return this.http.post<Note>(
      NOTES_API,
      { createdAt, title, description, archived, userId },
      httpOptions
    );
  }

  updateNote(note: Note): Observable<Note> {
    const url = `${NOTES_API}${note.idNote}`;
    // console.log('UPDATE URL:', url);
    // console.log('URL: ', url);

    return this.http.put<Note>(url, note, httpOptions);
  }

  deleteNote(idNote: number): Observable<Note> {
    const url = `${NOTES_API}${idNote}`;
    // console.log('DELETE URL:', url);
    return this.http.delete<Note>(url, httpOptions);
  }
}
