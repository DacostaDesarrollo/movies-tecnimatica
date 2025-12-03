import { Component, OnInit } from '@angular/core';
import { MoviesService } from '../../../core/services/movies.service';
import { NbAlertModule, NbButtonModule, NbCardModule, NbFormFieldModule, NbIconModule, NbInputModule, NbRadioModule, NbSpinnerModule } from '@nebular/theme';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Movie, MovieType, SearchResponse } from '../../../core/models/movie.model';

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
    NbFormFieldModule
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent implements OnInit {
  searchForm!: FormGroup;
  movies: Movie[] = [];
  isLoading:boolean = false;
  errorMessage:string = '';
  hasSearched:boolean = false;
  MovieType = MovieType;

  constructor(
    private fb: FormBuilder,
    private moviesService: MoviesService){

  }
  ngOnInit(): void {
    this.initForm();
  }
  private initForm(): void {

    this.searchForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      type: [MovieType.Movie]
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
      next: (response:SearchResponse) => {
        this.isLoading = false;
        debugger
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
      }
    });
  }

  get titleControl() {
    return this.searchForm.get('title');
  }
}
