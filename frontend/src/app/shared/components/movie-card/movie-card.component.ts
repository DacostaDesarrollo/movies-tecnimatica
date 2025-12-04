import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbCardModule, NbButtonModule, NbIconModule } from '@nebular/theme';
import { Movie } from '../../../core/models/movie.model';

@Component({
  selector: 'app-movie-card',
  standalone: true,
  imports: [
    CommonModule,
    NbCardModule,
    NbButtonModule,
    NbIconModule
  ],
  templateUrl: './movie-card.component.html',
  styleUrl: './movie-card.component.scss'
})
export class MovieCardComponent {
  @Input() movie!: Movie;
  @Input() mode: 'add' | 'remove' = 'add';
  @Output() addToFavorites = new EventEmitter<Movie>();
  @Output() removeFromFavorites = new EventEmitter<Movie>();

  onAddToFavorites(): void {
    this.addToFavorites.emit(this.movie);
  }

  onRemoveFromFavorites(): void {
    this.removeFromFavorites.emit(this.movie);
  }

  handleImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    target.src = 'assets/no-poster.png';
  }
}
