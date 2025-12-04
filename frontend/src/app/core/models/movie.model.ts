export interface Movie {
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
  imdbId: number;
  title: number;
  year: string;
  poster: string;
  type: string;
  createdAt: string;
}
