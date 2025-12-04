import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

import { FavoriteResponse, Movie } from '../models/movie.model';

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {

  private readonly API_URL = `${environment.apiUrl}/movies`;

  constructor(
    private http: HttpClient,
  ) {

  }

  addFavorite(movie:Movie ): Observable<FavoriteResponse>{
    return this.http.post<FavoriteResponse>(`${this.API_URL}/favorites`,movie);
  }

}
