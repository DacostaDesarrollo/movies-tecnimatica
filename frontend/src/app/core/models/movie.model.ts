export interface Movie {
  id?: number;  // Opcional: solo existe cuando viene de favoritos
  ImdbID: string;
  Title: string;
  Year: string;
  Poster: string;
  Type: string;
}
export interface SearchResponse {
  movies: Movie[];
  totalResults: number;
  page: number;
  response: string;
}
export enum MovieType {
  Movie = 'movie',
  Series = 'series',
  Episode = 'episode'
}
export interface FavoriteResponse {
  id: number;
  imdbId: string;
  title: string;
  year: string;
  poster: string;
  type: string;
  createdAt: string;
}

export interface ListFavoriteResponse {
  favorites: FavoriteResponse[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}
