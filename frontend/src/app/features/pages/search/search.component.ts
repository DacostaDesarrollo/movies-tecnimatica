import { Component, OnInit } from '@angular/core';
import { MoviesService } from '../../../core/services/movies.service';
import {
  NbAlertModule,
  NbButtonModule,
  NbCardModule,
  NbFormFieldModule,
  NbIconModule,
  NbInputModule,
  NbRadioModule,
  NbSpinnerModule,
  NbToastrService,
} from '@nebular/theme';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  FavoriteResponse,
  Movie,
  MovieType,
  SearchResponse,
} from '../../../core/models/movie.model';
import { MovieCardComponent } from '../../../shared/components/movie-card/movie-card.component';
import { FavoriteService } from '../../../core/services/favorites.service';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NbCardModule,
    NbInputModule,
    NbButtonModule,
    NbIconModule,
    NbRadioModule,
    NbAlertModule,
    NbSpinnerModule,
    NbFormFieldModule,
    MovieCardComponent,
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
})
export class SearchComponent implements OnInit {
  searchForm!: FormGroup;
  movies: Movie[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';
  hasSearched: boolean = false;
  MovieType = MovieType;

  constructor(
    private fb: FormBuilder,
    private moviesService: MoviesService,
    private favoriteService: FavoriteService,
    private toastrService: NbToastrService
  ) {}
  ngOnInit(): void {
    this.initForm();
  }
  private initForm(): void {
    this.searchForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      type: [MovieType.Movie],
    });
  }

  onSearch(): void {
    if (this.searchForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.hasSearched = true;

    const { title, type } = this.searchForm.value;

    this.moviesService.searchMovies(title, type, 1).subscribe({
      next: (response: SearchResponse) => {
        this.isLoading = false;

        if (response.response === 'True') {
          this.movies = response.movies;
        } else {
          this.movies = [];
          this.errorMessage = 'No se encontraron películas con ese título.';
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.movies = [];
        this.errorMessage = 'Error al buscar películas. Intenta nuevamente.';
        console.error('Error:', error);
      },
    });
  }

  get titleControl() {
    return this.searchForm.get('title');
  }

  onAddToFavorites(movie: Movie): void {

    this.favoriteService.addFavorite(movie).subscribe({
        next:(response:FavoriteResponse)=>{

          this.toastrService.success(
            `"${movie.Title}" agregada a favoritos`,
            'Éxito',
            { duration: 3000, icon: 'checkmark-circle-outline' }
          );

        },
        error: (error) => {
          const errorMessage = error.error?.error || 'Error al agregar a favoritos';
          this.toastrService.danger(
            errorMessage,
            'Error',
            { duration: 4000, icon: 'alert-circle-outline' }
          );
          console.error('Error:', error);
        },
    })

  }
}
