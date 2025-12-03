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
