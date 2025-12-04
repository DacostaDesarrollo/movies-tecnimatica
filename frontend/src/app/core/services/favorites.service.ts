import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

import { FavoriteResponse, ListFavoriteResponse, Movie } from '../models/movie.model';

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {

  private readonly API_URL = `${environment.apiUrl}/movies`;

  constructor(
    private http: HttpClient,
  ) {

  }

  addFavorite(movie: Movie): Observable<FavoriteResponse> {
    return this.http.post<FavoriteResponse>(`${this.API_URL}/favorites`, movie);
  }

  getFavorites(page: number = 1, pageSize: number = 10): Observable<ListFavoriteResponse> {

    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<ListFavoriteResponse>(`${this.API_URL}/favorites`, { params });
  }

  removeFavorite(favoriteId: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/favorites/${favoriteId}`);
  }

}
