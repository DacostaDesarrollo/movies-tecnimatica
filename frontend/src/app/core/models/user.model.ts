export interface User {
  email: string;
  token: string;
  createdAt?: Date;
}

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  email: string;
  token: string;
  createdAt?: string;
}

export interface ErrorResponse {
  error: string;
  details?: string;
}
