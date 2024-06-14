import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import { Category } from '../models/category.model';
import { Observable } from 'rxjs';

const CATEGORIES_API = 'http://localhost:8080/api/categories/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  constructor(private http: HttpClient) {}

  getCategories(idUser: number): Observable<Category[]> {
    const params = new HttpParams().set('idUser', idUser.toString()); // Send userId as query parameter

    return this.http.get<Category[]>(CATEGORIES_API, { params });
  }

  postCategory(
    userId: number,
    name: string,
    isPersonalized: boolean
  ): Observable<Category> {
    return this.http.post<Category>(
      CATEGORIES_API,
      {
        userId,
        name,
        isPersonalized,
      },
      httpOptions
    );
  }

  deleteCategory(idCategory: number): Observable<Category> {
    const url = `${CATEGORIES_API}${idCategory}`;
    // console.log('DELETE URL:', url);
    return this.http.delete<Category>(url, httpOptions);
  }
}
