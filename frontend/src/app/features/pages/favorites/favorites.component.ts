import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  NbCardModule,
  NbButtonModule,
  NbIconModule,
  NbSpinnerModule,
  NbAlertModule,
  NbToastrService
} from '@nebular/theme';
import { FavoriteService } from '../../../core/services/favorites.service';
import { ListFavoriteResponse, Movie } from '../../../core/models/movie.model';
import { MovieCardComponent } from '../../../shared/components/movie-card/movie-card.component';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [
    CommonModule,
    NbCardModule,
    NbButtonModule,
    NbIconModule,
    NbSpinnerModule,
    NbAlertModule,
    MovieCardComponent
  ],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.scss'
})
export class FavoritesComponent implements OnInit {
  favorites: Movie[] = [];
  isLoading = false;
  errorMessage = '';

  // Paginación
  currentPage = 1;
  pageSize = 12;
  totalCount = 0;
  totalPages = 0;
  hasNextPage = false;
  hasPreviousPage = false;

  constructor(
    private favoriteService: FavoriteService,
    private toastrService: NbToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadFavorites();
  }

  loadFavorites(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.favoriteService.getFavorites(this.currentPage, this.pageSize).subscribe({
      next: (response:ListFavoriteResponse) => {
        // Mapear FavoriteResponse a Movie
        this.favorites = response.favorites.map(fav => ({
          id: fav.id,
          ImdbID: fav.imdbId,
          Title: fav.title,
          Year: fav.year,
          Poster: fav.poster,
          Type: fav.type
        }));

        this.totalCount = response.totalCount;
        this.totalPages = response.totalPages;
        this.hasNextPage = response.hasNextPage;
        this.hasPreviousPage = response.hasPreviousPage;
        this.isLoading = false;
      },
      error: (error) => {

        this.isLoading = false;
        this.errorMessage = 'Error al cargar favoritos. Intenta nuevamente.';
        console.error('Error:', error);

      }
    });
  }

  onRemoveFromFavorites(movie: Movie): void {
    if (!movie.id) {
      this.toastrService.danger('ID de favorito no válido', 'Error');
      return;
    }

    this.favoriteService.removeFavorite(movie.id).subscribe({
      next: () => {
        this.toastrService.success(
          `"${movie.Title}" eliminada de favoritos`,
          'Éxito',
          { duration: 3000, icon: 'checkmark-circle-outline' }
        );

        // Recargar la lista
        this.loadFavorites();
      },
      error: (error) => {
        const errorMessage = error.error?.error || 'Error al eliminar de favoritos';
        this.toastrService.danger(
          errorMessage,
          'Error',
          { duration: 4000, icon: 'alert-circle-outline' }
        );
        console.error('Error:', error);
      }
    });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadFavorites();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  goToSearch(): void {
    this.router.navigate(['/pages/search']);
  }

  get isEmpty(): boolean {
    return !this.isLoading && this.favorites.length === 0;
  }
}
