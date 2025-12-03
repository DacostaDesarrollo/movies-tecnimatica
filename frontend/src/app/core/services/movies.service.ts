import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  User
} from '../models/user.model';
import { TokenService } from './token.service';
import { SearchResponse } from '../models/movie.model';

@Injectable({
  providedIn: 'root'
})
export class MoviesService {

  private readonly API_URL = `${environment.apiUrl}/movies`;

  constructor(
    private http: HttpClient,
  ) {

  }

  searchMovies(title:string,type?:string,page?:number ){

    let params: any = {
      title: title,
      page: page || 1
    };

    // Solo agregar type si viene definido
    if (type) {
      params.type = type;
    }

    return this.http.get<SearchResponse>(`${this.API_URL}/search`, { params });
  }


}
